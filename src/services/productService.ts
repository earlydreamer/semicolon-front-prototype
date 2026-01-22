import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { 
  CategoryResponse, 
  ProductListResponse, 
  ProductListItem, 
  ProductDetailResponse 
} from '../types/product';

export const productService = {
  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
    return response.data;
  },

  /**
   * 추천 상품 목록 조회
   */
  getFeaturedProducts: async (size = 20): Promise<ProductListItem[]> => {
    const response = await api.get<ProductListItem[]>(`${API_ENDPOINTS.PRODUCTS.BASE}/featured`, {
      params: { size }
    });
    return response.data;
  },

  /**
   * 상품 목록 조회 (필터링, 페이징)
   */
  getProducts: async (params: {
    categoryId?: number;
    sort?: string;
    page?: number;
    size?: number;
  }): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS.BASE, {
      params
    });
    return response.data;
  },

  /**
   * 상품 상세 조회
   */
  getProductDetail: async (productUuid: string): Promise<ProductDetailResponse> => {
    const response = await api.get<ProductDetailResponse>(`${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}`);
    return response.data;
  },
};
