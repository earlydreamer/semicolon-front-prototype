import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type {
  ReturnRequestCreateDto,
  ReturnTrackingRegisterDto,
  ReturnRejectDto,
  ReturnResponse,
  SellerReturnResponse,
} from '../types/return';

/**
 * 반품 관련 API 서비스
 */
export const returnService = {
  /**
   * [구매자] 반품 신청
   * POST /api/v1/returns/orders/{orderUuid}
   */
  requestReturn: async (orderUuid: string, data: ReturnRequestCreateDto): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/orders/${orderUuid}`, data);
    return response.data;
  },

  /**
   * [판매자] 반품 1차 승인
   * POST /api/v1/returns/{returnRequestUuid}/seller-approve
   */
  approveBySeller: async (returnRequestUuid: string): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/seller-approve`);
    return response.data;
  },

  /**
   * [판매자] 반품 1차 거절
   * POST /api/v1/returns/{returnRequestUuid}/seller-reject
   */
  rejectBySeller: async (returnRequestUuid: string, data: ReturnRejectDto): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/seller-reject`, data);
    return response.data;
  },

  /**
   * [구매자] 반품 운송장 등록
   * PUT /api/v1/returns/{returnRequestUuid}/tracking
   */
  registerTrackingInfo: async (returnRequestUuid: string, data: ReturnTrackingRegisterDto): Promise<ReturnResponse> => {
    const response = await api.put<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/tracking`, data);
    return response.data;
  },

  /**
   * [판매자] 반송품 수령 확인
   * POST /api/v1/returns/{returnRequestUuid}/seller-receive
   */
  receiveBySeller: async (returnRequestUuid: string): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/seller-receive`);
    return response.data;
  },

  /**
   * [판매자] 환불 최종 승인
   * POST /api/v1/returns/{returnRequestUuid}/final-approve
   */
  approveReturn: async (returnRequestUuid: string): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/final-approve`);
    return response.data;
  },

  /**
   * [판매자] 환불 최종 거절
   * POST /api/v1/returns/{returnRequestUuid}/final-reject
   */
  rejectFinalReturn: async (returnRequestUuid: string, data: ReturnRejectDto): Promise<ReturnResponse> => {
    const response = await api.post<ReturnResponse>(`${API_ENDPOINTS.RETURNS.BASE}/${returnRequestUuid}/final-reject`, data);
    return response.data;
  },

  /**
   * [판매자] 본인 상품에 접수된 반품 요청 목록 조회
   * GET /api/v1/returns/me/sales
   */
  getSellerReturns: async (): Promise<SellerReturnResponse[]> => {
    const response = await api.get<SellerReturnResponse[]>(`${API_ENDPOINTS.RETURNS.BASE}/me/sales`);
    return response.data;
  },
};
