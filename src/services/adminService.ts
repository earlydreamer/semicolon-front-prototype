import axios from 'axios';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { PageResponse, OrderListResponse } from '@/types/order';
import type { ProductListResponse } from '@/types/product';
import type {
  AdminOrderPageResponse,
  AdminProductListResponse,
  AdminSettlementDetailResponse,
  AdminSettlementSearchParams,
  AdminSettlementStatisticsParams,
  AdminSettlementStatisticsResponse,
  UserAdminProfileResponse,
} from '@/types/admin';

interface AdminOrderSearchParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  userUuid?: string;
  orderUuid?: string;
}

interface AdminProductSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortType?: 'LATEST' | 'LIKES' | 'PRICE_LOW' | 'PRICE_HIGH';
}

const settlementBaseCandidates = [
  API_ENDPOINTS.ADMIN_SETTLEMENTS.BASE,
  API_ENDPOINTS.ADMIN_SETTLEMENTS.LEGACY_BASE,
] as const;

const requestSettlementApi = async <T>(path: string, params?: object): Promise<T> => {
  let lastError: unknown;

  for (const [index, base] of settlementBaseCandidates.entries()) {
    try {
      const response = await api.get<T>(`${base}${path}`, { params });
      return response.data;
    } catch (error) {
      lastError = error;

      const isLastCandidate = index === settlementBaseCandidates.length - 1;
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      if (isLastCandidate || error.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error('정산 API 호출에 실패했습니다.');
};

const getSellerProfiles = async (productUuids: string[]) => {
  const uniqueProductUuids = Array.from(new Set(productUuids));
  const profileMap = new Map<string, UserAdminProfileResponse>();

  const results = await Promise.allSettled(
    uniqueProductUuids.map(async (productUuid) => {
      const response = await api.get<UserAdminProfileResponse>(
        API_ENDPOINTS.ADMIN_PRODUCTS.USER_BY_PRODUCT(productUuid),
      );
      return { productUuid, profile: response.data };
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      profileMap.set(result.value.productUuid, result.value.profile);
    }
  }

  return profileMap;
};

export const adminService = {
  getAdminOrders: async (params: AdminOrderSearchParams = {}): Promise<AdminOrderPageResponse> => {
    const { page = 0, size = 20, ...searchParams } = params;
    const response = await api.get<PageResponse<OrderListResponse>>(API_ENDPOINTS.ADMIN_ORDERS.BASE, {
      params: { page, size, ...searchParams },
    });
    return response.data;
  },

  getAdminProducts: async (params: AdminProductSearchParams = {}): Promise<AdminProductListResponse> => {
    const { page = 0, size = 20, ...searchParams } = params;
    const response = await api.get<ProductListResponse>(API_ENDPOINTS.ADMIN_PRODUCTS.BASE, {
      params: { page, size, ...searchParams },
    });

    const productItems = response.data.items ?? [];
    if (productItems.length === 0) {
      return { ...response.data, items: [] };
    }

    const profileMap = await getSellerProfiles(productItems.map((item) => item.productUuid));

    return {
      ...response.data,
      items: productItems.map((item) => {
        const profile = profileMap.get(item.productUuid);
        return {
          ...item,
          sellerNickname: profile?.nickname ?? '-',
          sellerUserUuid: profile?.userUuid ?? '',
        };
      }),
    };
  },

  getAdminSettlements: async (
    params: AdminSettlementSearchParams = {},
  ): Promise<PageResponse<AdminSettlementDetailResponse>> => {
    const { page = 0, size = 20, ...searchParams } = params;
    return requestSettlementApi<PageResponse<AdminSettlementDetailResponse>>('', {
      page,
      size,
      ...searchParams,
    });
  },

  getAdminSettlementStatistics: async (
    params: AdminSettlementStatisticsParams = {},
  ): Promise<AdminSettlementStatisticsResponse> => {
    return requestSettlementApi<AdminSettlementStatisticsResponse>('/statistics', params);
  },
};
