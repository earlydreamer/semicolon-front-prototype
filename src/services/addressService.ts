import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { Address } from '../types/address';
import type { PageResponse } from '../types/order';

export const addressService = {
  /**
   * 내 주소록 목록 조회 (페이징)
   */
  getMyAddresses: async (page = 0, size = 10): Promise<PageResponse<Address>> => {
    const response = await api.get<PageResponse<Address>>(API_ENDPOINTS.USERS.ADDRESSES, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * 기본 주소 조회
   */
  getDefaultAddress: async (): Promise<Address> => {
    const response = await api.get<Address>(`${API_ENDPOINTS.USERS.ADDRESSES}/default`);
    return response.data;
  },

  /**
   * 주소 등록
   */
  addAddress: async (address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
    const response = await api.post<Address>(API_ENDPOINTS.USERS.ADDRESSES, address);
    return response.data;
  },

  /**
   * 주소 수정
   */
  updateAddress: async (id: number, address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
    const response = await api.patch<Address>(`${API_ENDPOINTS.USERS.ADDRESSES}/${id}`, address);
    return response.data;
  },

  /**
   * 주소 삭제
   */
  deleteAddress: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.USERS.ADDRESSES}/${id}`);
  },

  /**
   * 기본 주소 설정
   */
  setDefaultAddress: async (id: number): Promise<Address> => {
    const response = await api.patch<Address>(`${API_ENDPOINTS.USERS.ADDRESSES}/${id}/default`);
    return response.data;
  }
};
