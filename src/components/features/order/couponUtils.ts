import type { CouponResponse } from '@/types/coupon';

export type UserCoupon = CouponResponse;

export function calculateCouponDiscount(coupon: UserCoupon | null, orderAmount: number): number {
  if (!coupon) return 0;
  return Math.min(coupon.discountAmount, orderAmount);
}
