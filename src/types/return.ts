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

// 반품 진행 상태 — 백엔드 ReturnStatus enum과 동일하게 유지
export type ReturnStatus =
  | 'RETURN_REQUESTED'                // 반품 신청됨
  | 'RETURN_SELLER_APPROVED'          // 판매자 1차 승인됨 (발송 대기)
  | 'RETURN_SHIPPED'                  // 구매자 운송장 등록 (반품 발송됨)
  | 'RETURN_APPROVED'                 // 판매자 최종 승인 (환불 진행)
  | 'RETURN_COMPLETED'                // 반품 완료
  | 'RETURN_REJECTED_BEFORE_SHIPMENT' // 배송 전 거절
  | 'RETURN_REJECTED_AFTER_SHIPMENT'  // 배송 후 거절
  | 'RETURN_REJECTED';                // 반품 거절

// 반품 응답 DTO (구매자/공통)
export interface ReturnResponse {
  returnRequestUuid: string;
  orderUuid: string;
  status: ReturnStatus;
  reason: string;
  rejectionReason?: string;
  carrierName?: string;
  carrierCode?: string;
  trackingNumber?: string;
  createdAt: string;
  returnItems: ReturnItemResponse[];
}

export interface ReturnItemResponse {
  returnItemUuid: string;
  orderItemUuid: string;
  refundAmount: number;
}

// 판매자용 반품 목록 응답 DTO
export interface SellerReturnResponse {
  returnRequestUuid: string;
  orderUuid: string;
  status: ReturnStatus;
  reason: string;
  rejectionReason?: string;
  carrierName?: string;
  trackingNumber?: string;
  createdAt: string;
  returnItems: SellerReturnItemSummary[];
}

export interface SellerReturnItemSummary {
  orderItemUuid: string;
  productName: string;
  refundAmount: number;
}
