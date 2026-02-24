import api from "../utils/api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type {
  CategoryResponse,
  ProductListResponse,
  ProductListItem,
  ProductDetailResponse,
  PresignedUrlResponse,
} from "../types/product";
import axios from "axios";

export const productService = {
  /**
   * 카테고리 목록을 조회합니다.
   */
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
    );
    return response.data;
  },

  /**
   * 추천 상품 목록을 조회합니다.
   */
  getFeaturedProducts: async (size = 20): Promise<ProductListItem[]> => {
    const response = await api.get<ProductListItem[]>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/featured`,
      {
        params: { size },
      },
    );
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
    sortType?: "LATEST" | "LIKES" | "PRICE_LOW" | "PRICE_HIGH";
    page: number;
    size: number;
  }): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(
      API_ENDPOINTS.PRODUCTS.BASE,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 상품 상세 정보를 조회합니다.
   */
  getProductDetail: async (
    productUuid: string,
  ): Promise<ProductDetailResponse> => {
    const response = await api.get<ProductDetailResponse>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}`,
    );
    return response.data;
  },

  /**
   * S3 업로드를 위한 Presigned URL을 요청합니다.
   */
  getPresignedUrl: async (extension: string): Promise<string> => {
    const response = await api.get<PresignedUrlResponse>(
      API_ENDPOINTS.PRODUCTS.IMAGE_PRESIGNED_URL,
      {
        params: { extension },
      },
    );
    return response.data.url;
  },

  /**
   * S3에 파일을 직접 업로드합니다.
   */
  uploadImageToS3: async (presignedUrl: string, file: File): Promise<void> => {
    // Presigned URL은 axios 인스턴스(공통 설정/인증 헤더 포함) 대신
    // 기본 axios를 사용하여 헤더 충돌을 방지합니다.
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },
};
