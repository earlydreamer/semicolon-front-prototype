import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface CommentResponse {
  commentUuid: string;
  productUuid: string;
  authorUuid: string;
  authorRole: 'SELLER' | 'BUYER';
  content: string;
  parentCommentUuid: string | null;
}

export interface CommentThreadResponse {
  parent: CommentResponse;
  replies: CommentResponse[];
}

export interface CommentListResponse {
  items: CommentThreadResponse[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
}

export const commentService = {
  getProductComments: async (
    productUuid: string,
    params?: { page?: number; size?: number },
  ): Promise<CommentListResponse> => {
    const response = await api.get<CommentListResponse>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}/comments`,
      { params },
    );
    return response.data;
  },
};

