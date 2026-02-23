import api from '../utils/api';
import { API_ENDPOINTS, API_BASE_URL } from '../constants/apiEndpoints';
import type { SaleStatus, ProductListItem, ConditionStatus, VisibilityStatus } from '../types/product';

export interface ProductCreateRequest {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  imageUrls: string[];
  tags?: string[];
}

export interface ProductUpdateRequest {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  visibilityStatus: VisibilityStatus;
  imageUrls: string[];
  tags?: string[];
}

export interface ShopResponse {
  shopUuid: string;
  nickname: string;
  intro: string;
  salesCount: number;
  activeListingCount: number;
  averageRating: number;
  reviewCount: number;
}

export interface ShopProductListResponse {
  items: ProductListItem[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
}

export const shopService = {
  getShop: async (shopUuid: string): Promise<ShopResponse> => {
    const response = await api.get<ShopResponse>(`${API_ENDPOINTS.SHOPS.BASE}/${shopUuid}`);
    return response.data;
  },

  getShopProducts: async (
    shopUuid: string,
    params?: { saleStatus?: SaleStatus; page?: number; size?: number },
  ): Promise<ShopProductListResponse> => {
    const response = await api.get<ShopProductListResponse>(
      `${API_ENDPOINTS.SHOPS.BASE}/${shopUuid}/products`,
      { params },
    );
    return response.data;
  },

  getMyShopProducts: async (params?: {
    saleStatus?: SaleStatus;
    page?: number;
    size?: number;
  }): Promise<ShopProductListResponse> => {
    const response = await api.get<ShopProductListResponse>(`${API_ENDPOINTS.SHOPS.ME}/products`, {
      params,
    });
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<any> => {
    const response = await api.post(`${API_BASE_URL}/seller/products`, data);
    return response.data;
  },

  updateProduct: async (productUuid: string, data: ProductUpdateRequest): Promise<any> => {
    const response = await api.patch(`${API_BASE_URL}/seller/products/${productUuid}`, data);
    return response.data;
  },

  deleteProduct: async (productUuid: string): Promise<void> => {
    await api.delete(`${API_BASE_URL}/seller/products/${productUuid}`);
  },
};
