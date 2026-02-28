import api from '@/utils/api';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { OrderStatus } from '@/types/order';

export interface AdminTestUserLookupResponse {
  userUuid: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface DepositChargeRequest {
  amount: number;
  settlementUuid: string;
}

interface CouponIssueRequest {
  userUuid: string;
}

export const adminTestService = {
  findUserByEmail: async (email: string): Promise<AdminTestUserLookupResponse> => {
    const response = await api.get<AdminTestUserLookupResponse>(API_ENDPOINTS.INTERNAL_USERS.UUID, {
      params: { email },
    });
    return response.data;
  },

  grantDepositToUser: async (userUuid: string, amount: number): Promise<void> => {
    const payload: DepositChargeRequest = {
      amount,
      settlementUuid: crypto.randomUUID(),
    };
    await api.post(API_ENDPOINTS.INTERNAL_DEPOSITS.CHARGE(userUuid), payload);
  },

  issueCouponToUser: async (couponUuid: string, userUuid: string): Promise<void> => {
    const payload: CouponIssueRequest = { userUuid };
    await api.post(API_ENDPOINTS.ADMIN_COUPONS.ISSUE_TO_USER(couponUuid), payload);
  },

  updateOrderStatus: async (orderUuid: string, status: OrderStatus): Promise<void> => {
    // TODO: 백엔드 관리자 주문 상태 변경 API(OrderUserAdminController/OrderFacade) 재구현 후
    //       최종 스펙(HTTP method, path, body/query)을 확정해서 이 호출부를 동기화하세요.
    await api.patch(API_ENDPOINTS.ADMIN_ORDERS.UPDATE_STATUS(orderUuid), null, {
      params: { status },
    });
  },
};
