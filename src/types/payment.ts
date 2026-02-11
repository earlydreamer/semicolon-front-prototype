export interface PaymentAmounts {
  itemsTotalAmount: number;
  couponDiscountAmount: number;
  finalPayAmount: number;
  depositUseAmount: number;
  pgPayAmount: number;
}

export interface PaymentRequestItem {
  orderItemUuid: string;
  productId: number; // 백엔드 DTO가 Integer productId를 받음 (UUID가 아님에 주의)
  productName: string;
  price: number;
  sellerUuid: string;
  paymentCoupon: number;
}

export interface PaymentRequest {
  orderUuid: string;
  couponUuid?: string;
  amounts: PaymentAmounts;
  orderName: string;
  items: PaymentRequestItem[];
}

export interface TossInfo {
  orderId: string;
  amount: number;
  orderName: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentResponseData {
  paymentUuid: string;
  status: string;
  toss: TossInfo;
  amounts: PaymentAmounts;
  createdAt: string;
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data: PaymentResponseData;
}

export interface TossConfirmInfo {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmRequest {
  paymentUuid: string;
  toss: TossConfirmInfo;
}

export interface ReviewPaymentResponse {
    success: boolean;
    code: string;
    message: string;
    data: any; // 필요시 상세 정의
}

// Alias exports for backward compatibility
export type PaymentPrepareRequest = PaymentRequest;
export type PaymentPrepareResponse = PaymentResponse;
export type PaymentConfirmResponse = PaymentResponse;
