/**
 * 반품 및 환불 관련 타입 정의
 */

// 반품 신청 요청 DTO
export interface ReturnRequestCreateDto {
  reason: string;
  orderItemUuids: string[];
}

// 반품 운송장 등록 요청 DTO
export interface ReturnTrackingRegisterDto {
  carrierName: string;
  carrierCode: string;
  trackingNumber: string;
}

// 반품 거절 요청 DTO (1차 및 최종 거절 공통)
export interface ReturnRejectDto {
  reason: string;
}

// 반품 진행 상태 (백엔드 ReturnStatus 참고)
export type ReturnStatus =
  | 'REQUESTED'       // 반품 신청됨
  | 'SELLER_APPROVED' // 판매자 1차 승인됨 (발송 대기)
  | 'SELLER_REJECTED' // 판매자 1차 거절됨
  | 'SHIPPED'         // 구매자가 운송장 등록함 (반품 발송됨)
  | 'FINAL_APPROVED'  // 판매자 최종 승인됨 (환불 진행/완료)
  | 'FINAL_REJECTED'; // 판매자 최종 거절됨

// 반품 응답 DTO
export interface ReturnResponse {
  returnRequestUuid: string;
  orderUuid: string;
  userUuid: string;
  status: ReturnStatus;
  reason: string;
  rejectReason?: string;
  refundAmount: number;
  carrierName?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}
