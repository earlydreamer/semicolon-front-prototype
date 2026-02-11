import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { 
  PaymentPrepareRequest, 
  PaymentPrepareResponse, 
  PaymentConfirmRequest, 
  PaymentConfirmResponse 
} from '../types/payment';

/**
 * 결제 관련 서비스
 */
export const paymentService = {
  /**
   * 결제 준비 (Prepare)
   * 백엔드에 결제 정보를 미리 등록하고 토스 연동에 필요한 데이터를 받아옵니다.
   */
  preparePayment: async (request: PaymentPrepareRequest, idempotencyKey: string): Promise<PaymentPrepareResponse> => {
    const response = await api.post<PaymentPrepareResponse>(
      API_ENDPOINTS.PAYMENTS.PREPARE,
      request,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    return response.data;
  },

  /**
   * 결제 승인 (Confirm)
   * 토스 인증 성공 후 백엔드에 최종 승인 처리를 요청합니다.
   */
  confirmPayment: async (request: PaymentConfirmRequest, idempotencyKey: string): Promise<PaymentConfirmResponse> => {
    const response = await api.post<PaymentConfirmResponse>(
      API_ENDPOINTS.PAYMENTS.CONFIRM,
      request,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    return response.data;
  },
};
