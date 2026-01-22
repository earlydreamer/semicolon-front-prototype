import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { CartListResponse } from '../types/cart';

export const cartService = {
  /**
   * 장바구니 목록 조회
   */
  getCartList: async (): Promise<CartListResponse> => {
    const response = await api.get<CartListResponse>(API_ENDPOINTS.CARTS.ME);
    return response.data;
  },

  /**
   * 장바구니 아이템 추가
   * @param productUuid 상품의 UUID
   */
  addToCart: async (productUuid: string): Promise<void> => {
    await api.post(`${API_ENDPOINTS.CARTS.DEFAULT}/${productUuid}`);
  },

  /**
   * 장바구니 아이템 삭제
   * @param cartId 장바구니 항목의 ID (PK)
   */
  removeFromCart: async (cartId: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.CARTS.DEFAULT}/${cartId}`);
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.CARTS.ME);
  },
};
