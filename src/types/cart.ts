/**
 * 장바구니 관련 타입 정의
 */

import type { Product } from '../mocks/products';

/**
 * 장바구니 아이템 인터페이스
 */
export interface CartItem {
  /** 상품 ID */
  productId: string;
  /** 상품 정보 */
  product: Product;
  /** 수량 */
  quantity: number;
  /** 추가 시각 (ISO 문자열) */
  addedAt: string;
  /** 선택 상태 */
  selected: boolean;
}

/**
 * 장바구니 요약 정보
 */
export interface CartSummary {
  /** 선택된 상품 수 */
  selectedCount: number;
  /** 상품 총 가격 (배송비 제외) */
  productTotal: number;
  /** 배송비 총액 */
  shippingTotal: number;
  /** 총 결제 예정 금액 */
  grandTotal: number;
}
