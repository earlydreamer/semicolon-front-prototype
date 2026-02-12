import api from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  CouponCreateRequest,
  CouponResponse,
  CouponUpdateRequest,
} from '@/types/coupon';

export const couponService = {
  getMyCoupons: async (): Promise<CouponResponse[]> => {
    const response = await api.get<CouponResponse[]>(API_ENDPOINTS.COUPONS.ME);
    return response.data;
  },

  getAdminCoupons: async (): Promise<CouponResponse[]> => {
    const response = await api.get<CouponResponse[]>(API_ENDPOINTS.ADMIN_COUPONS.BASE);
    return response.data;
  },

  createAdminCoupon: async (payload: CouponCreateRequest): Promise<CouponResponse> => {
    const response = await api.post<CouponResponse>(API_ENDPOINTS.ADMIN_COUPONS.BASE, payload);
    return response.data;
  },

  updateAdminCouponDraft: async (couponUuid: string, payload: CouponUpdateRequest): Promise<void> => {
    await api.put(`${API_ENDPOINTS.ADMIN_COUPONS.BASE}/${couponUuid}/draft`, payload);
  },

  activateAdminCoupon: async (couponUuid: string): Promise<void> => {
    await api.post(`${API_ENDPOINTS.ADMIN_COUPONS.BASE}/${couponUuid}/activate`);
  },
};
