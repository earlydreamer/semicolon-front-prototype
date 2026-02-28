import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface SellerReviewResponse {
  reviewUuid: string;
  sellerUuid: string;
  buyerUuid: string;
  orderItemUuid: string;
  productUuid: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface SellerReviewListResponse {
  items: SellerReviewResponse[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
  avgRating: number;
  reviewCount: number;
}

export interface SellerReviewSummaryResponse {
  sellerUuid: string;
  avgRating: number;
  reviewCount: number;
}

export const reviewService = {
  getSellerReviewSummary: async (sellerUuid: string): Promise<SellerReviewSummaryResponse> => {
    const response = await api.get<SellerReviewSummaryResponse>(
      `${API_ENDPOINTS.REVIEWS.BASE}/sellers/${sellerUuid}/reviews-summary`,
    );
    return response.data;
  },

  getSellerReviews: async (
    sellerUuid: string,
    params?: { page?: number; size?: number },
  ): Promise<SellerReviewListResponse> => {
    const response = await api.get<SellerReviewListResponse>(
      `${API_ENDPOINTS.REVIEWS.BASE}/sellers/${sellerUuid}/reviews`,
      { params },
    );
    return response.data;
  },
};
