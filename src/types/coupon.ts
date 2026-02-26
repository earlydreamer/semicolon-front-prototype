export type CouponStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface CouponResponse {
  uuid: string;
  couponName: string;
  discountAmount: number;
  minimumOrderAmount: number;
  validFrom: string;
  createdAt: string;
  status: CouponStatus;
  totalQuantity: number;
  issuedQuantity: number;
}

export interface CouponCreateRequest {
  couponName: string;
  discountAmount: number;
  minimumOrderAmount: number;
  validFrom: string;
  totalQuantity: number;
}

export interface CouponUpdateRequest {
  couponName: string;
  discountAmount: number;
  minimumOrderAmount: number;
  validFrom: string;
}
