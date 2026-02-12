import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type {
  CategoryResponse,
  ProductListResponse,
  ProductListItem,
  ProductDetailResponse,
} from '../types/product';

export const productService = {
  /**
   * 카테고리 목록을 조회합니다.
   */
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
    return response.data;
  },

  /**
   * 추천 상품 목록을 조회합니다.
   */
  getFeaturedProducts: async (size = 20): Promise<ProductListItem[]> => {
    const response = await api.get<ProductListItem[]>(`${API_ENDPOINTS.PRODUCTS.BASE}/featured`, {
      params: { size },
    });
    return response.data;
  },

  /**
   * 상품 목록을 조회합니다.
   */
  getProducts: async (params: {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortType?: 'LATEST' | 'LIKES' | 'PRICE_LOW' | 'PRICE_HIGH';
    page: number;
    size: number;
  }): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS.BASE, {
      params,
    });
    return response.data;
  },

  /**
   * 상품 상세 정보를 조회합니다.
   */
  getProductDetail: async (productUuid: string): Promise<ProductDetailResponse> => {
    const response = await api.get<ProductDetailResponse>(`${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}`);
    return response.data;
  },
};
