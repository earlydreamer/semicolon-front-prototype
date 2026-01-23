/**
 * 사용자 및 주문 관련 타입 정의
 */

import type { Product } from './product';

/** 사용자 프로필 */
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  intro?: string;
  deposit: number;
  phone?: string;
  settlementAccount?: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };
  createdAt: string;
}

/** 주문 상태 */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PAYMENT_FAILED'
  | 'CANCELED'
  | 'PARTIAL_REFUNDED';

/** 주문 내역 */
export interface OrderHistory {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  product: Product;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
  shippingFee: number;
  hasReview?: boolean;
  trackingNumber?: string;
  deliveryCompany?: string;
}

/** 상점 정보 */
export interface Shop {
  id: string;
  userId: string;
  name: string;
  intro?: string;
  avatar?: string;
  rating: number;
  salesCount: number;
  activeListingCount: number;
  followerCount: number;
  createdAt: string;
}
