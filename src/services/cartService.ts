import api from '../utils/api';
import axios from 'axios';
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
  removeFromCart: async (cartIds: number[]): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.CARTS.DEFAULT, {
        data: { cartIds },
      });
      return;
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const shouldFallback =
        status === 400 || status === 403 || status === 404 || status === 405 || status === 415;

      if (!shouldFallback) {
        throw error;
      }
    }

    // 일부 환경은 DELETE body를 차단하거나 구버전 단건 삭제 엔드포인트만 지원합니다.
    await Promise.all(
      cartIds.map((cartId) => api.delete(`${API_ENDPOINTS.CARTS.DEFAULT}/${cartId}`))
    );
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.CARTS.ME);
  },
};
