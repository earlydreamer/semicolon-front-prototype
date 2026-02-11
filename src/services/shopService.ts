import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { SaleStatus, ProductListItem } from '../types/product';

export interface ShopResponse {
  shopUuid: string;
  intro: string;
  salesCount: number;
  activeListingCount: number;
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
};
