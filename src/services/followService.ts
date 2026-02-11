import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface FollowedSellerCardResponse {
  sellerUuid: string;
  nickname: string;
  intro: string;
  averageRating: number;
  reviewCount: number;
  followerCount: number;
  followed: boolean;
}

export interface FollowActionResponse {
  sellerUuid: string;
  followed: boolean;
}

export const followService = {
  followSeller: async (sellerUuid: string): Promise<FollowActionResponse> => {
    const response = await api.post<FollowActionResponse>(`${API_ENDPOINTS.SELLERS.BASE}/${sellerUuid}/follow`);
    return response.data;
  },

  unfollowSeller: async (sellerUuid: string): Promise<FollowActionResponse> => {
    const response = await api.delete<FollowActionResponse>(`${API_ENDPOINTS.SELLERS.BASE}/${sellerUuid}/follow`);
    return response.data;
  },

  getMyFollowing: async (): Promise<FollowedSellerCardResponse[]> => {
    const response = await api.get<FollowedSellerCardResponse[]>(API_ENDPOINTS.SELLERS.ME_FOLLOWING);
    return response.data;
  },

  getSellerFollowers: async (sellerUuid: string): Promise<{ userUuid: string }[]> => {
    const response = await api.get<{ userUuid: string }[]>(`${API_ENDPOINTS.SELLERS.BASE}/${sellerUuid}/followers`);
    return response.data;
  },
};
