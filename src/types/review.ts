/**
 * 후기 관련 타입 정의
 */

/** 상점 후기 */
export interface ShopReview {
  id: string;
  shopId: string;
  buyerId: string;
  buyerNickname: string;
  buyerAvatar?: string;
  orderId: string;
  productTitle: string;
  rating: number;
  content: string;
  createdAt: string;
}
