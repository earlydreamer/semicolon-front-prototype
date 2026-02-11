import api from "../utils/api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type {
  User,
  UserUpdateRequest,
  PasswordUpdateRequest,
} from "../types/auth"; // auth.ts의 타입을 사용

export interface DepositBalanceData {
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
  depositHistoryId: string;
  type: "CHARGE" | "PAYMENT" | "REFUND";
  amount: number;
  balanceAfter: number;
  ref: {
    orderUuid?: string;
  };
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

export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  zipcode: string;
  address1: string;
  address2: string;
  isDefault: boolean;
}

export interface AddressRequest {
  receiverName: string;
  receiverPhone: string;
  zipcode: string;
  address1: string;
  address2: string;
  isDefault: boolean;
}

export interface LikeProductResponse {
  productUuid: string;
  isLiked: boolean;
}

export const userService = {
  // User Profile
  updateProfile: async (data: UserUpdateRequest): Promise<User> => {
    const response = await api.put<User>(API_ENDPOINTS.USERS.ME, data);
    return response.data;
  },

  updatePassword: async (data: PasswordUpdateRequest): Promise<void> => {
    await api.put(API_ENDPOINTS.USERS.PASSWORD, data);
  },

  withdraw: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.USERS.ME);
  },

  // Address
  getMyAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>(API_ENDPOINTS.USERS.ADDRESSES);
    return response.data;
  },

  addAddress: async (data: AddressRequest): Promise<Address> => {
    const response = await api.post<Address>(
      API_ENDPOINTS.USERS.ADDRESSES,
      data,
    );
    return response.data;
  },

  // Deposit
  getDepositBalance: async (): Promise<DepositBalanceData> => {
    const response = await api.get<DepositBalanceResponse>(
      API_ENDPOINTS.DEPOSITS.BALANCE,
    );
    return response.data.data; // Response wrapper handling
  },

  getDepositHistories: async (
    size = 10,
    cursor?: string,
  ): Promise<DepositHistoryResponse["data"]> => {
    const response = await api.get<DepositHistoryResponse>(
      API_ENDPOINTS.DEPOSITS.HISTORIES,
      {
        params: { size, cursor },
      },
    );
    return response.data.data;
  },

  // Likes
  likeProduct: async (productUuid: string) => {
    const response = await api.post<LikeProductResponse>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}/like`,
    );
    return response.data;
  },

  unlikeProduct: async (productUuid: string) => {
    const response = await api.delete<LikeProductResponse>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}/like`,
    );
    return response.data;
  },

  getLikedProducts: async (page = 0, size = 20) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.ME_LIKES, {
      params: { page, size },
    });
    return response.data;
  },
};
