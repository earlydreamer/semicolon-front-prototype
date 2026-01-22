/**
 * 장바구니 관련 타입 정의
 */

/**
 * 장바구니 아이템 인터페이스 (백엔드 CartDto와 일치)
 */
export interface CartItem {
  cartId: number;           // 장바구니 PK (삭제 시 사용)
  productUuid: string;      // 상품 UUID (상세 페이지 이동용)
  title: string;            // 상품 제목
  price: number;            // 현재 상품 가격
  saleStatus: 'ON_SALE' | 'RESERVED' | 'SOLD_OUT'; // 판매 상태
  thumbnailUrl: string | null; // 썸네일 이미지 URL
  createdAt: string;        // 장바구니에 담은 날짜
  selected?: boolean;       // 프론트엔드 UI 관리를 위한 필드 (선택 필수 아님)
}

/**
 * 장바구니 목록 응답 (백엔드 CartListResponse와 일치)
 */
export interface CartListResponse {
  items: CartItem[];
  totalCount: number;
  expectedTotalPrice: number;
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
