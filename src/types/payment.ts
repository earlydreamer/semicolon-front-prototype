/**
 * 결제 관련 타입 정의
 */

export type PaymentStatus = 'PENDING' | 'DONE' | 'FAILED' | 'CANCELED';

export interface PaymentAmounts {
  itemsTotalAmount: number;
  couponDiscountAmount: number;
  finalPayAmount: number;
  depositUseAmount: number;
  pgPayAmount: number;
}

/**
 * 결제 준비 요청 (Prepare)
 */
export interface PaymentPrepareRequest {
  orderUuid: string;
  couponUuid?: string;
  amounts: PaymentAmounts;
  orderName: string;
}

export interface PaymentPrepareResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    paymentUuid: string;
    status: PaymentStatus;
    toss: {
      orderId: string;
      amount: number;
      orderName: string;
      successUrl: string;
      failUrl: string;
    };
    amounts: Pick<PaymentAmounts, 'finalPayAmount' | 'depositUseAmount' | 'pgPayAmount'>;
    createdAt: string;
  };
}

/**
 * 결제 승인 요청 (Confirm)
 */
export interface PaymentConfirmRequest {
  paymentUuid: string;
  toss: {
    paymentKey: string;
    orderId: string;
    amount: number;
  };
}

export interface PaymentConfirmResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    paymentUuid: string;
    status: PaymentStatus;
    approvedAt: string;
    toss: {
      orderId: string;
      paymentKey: string;
    };
    amounts: Pick<PaymentAmounts, 'finalPayAmount' | 'depositUseAmount' | 'pgPayAmount'>;
  };
}
