import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface DepositBalanceData {
  userUuid: string;
  depositUuid: string;
  balance: number;
  updatedAt: string;
}

export interface DepositBalanceResponse {
  success: boolean;
  code: string;
  message: string;
  data: DepositBalanceData;
}

export interface DepositHistoryItem {
  id: number;
  depositHistoryUuid: string;
  amount: number;
  type: 'CHARGE' | 'PAYMENT' | 'REFUND';
  description: string;
  createdAt: string;
}

export interface DepositHistoryResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    items: DepositHistoryItem[];
    page: {
      size: number;
      nextCursor: string | null;
    };
  };
}

export interface LikeProductResponse {
  productUuid: string;
  isLiked: boolean;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // User Profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await api.put(API_ENDPOINTS.USERS.ME, data);
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordRequest) => {
    const response = await api.put(API_ENDPOINTS.USERS.PASSWORD, data);
    return response.data;
  },

  // Deposit
  getDepositBalance: async () => {
    const response = await api.get<DepositBalanceResponse>(API_ENDPOINTS.DEPOSITS.BALANCE);
    return response.data;
  },

  getDepositHistories: async (size = 10, cursor?: string) => {
    const response = await api.get<DepositHistoryResponse>(API_ENDPOINTS.DEPOSITS.HISTORIES, {
      params: { size, cursor }
    });
    return response.data;
  },

  // Likes
  likeProduct: async (productUuid: string) => {
    const response = await api.post<LikeProductResponse>(`/products/${productUuid}/likes`);
    return response.data;
  },

  unlikeProduct: async (productUuid: string) => {
    const response = await api.delete<LikeProductResponse>(`/products/${productUuid}/likes`);
    return response.data;
  },

  getLikedProducts: async (page = 0, size = 20) => {
    const response = await api.get(`/me/likes`, {
      params: { page, size }
    });
    return response.data;
  }
};
