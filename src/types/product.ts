/**
 * 상품 관련 타입 정의
 */

/** 상품 상태 */
export type ConditionStatus = 'SEALED' | 'NO_WEAR' | 'MINOR_WEAR' | 'VISIBLE_WEAR' | 'DAMAGED';

/** 판매 상태 */
export type SaleStatus = 'ON_SALE' | 'RESERVED' | 'SOLD_OUT' | 'HIDDEN' | 'BLOCKED';

/** 판매자 정보 */
export interface ProductSeller {
  id: string;
  userId: string;
  nickname: string;
  avatar?: string;
  rating: number;
  intro?: string;
  salesCount: number;
  activeListingCount: number;
}

/** 상품 댓글 */
export interface ProductComment {
  id: number;
  productId: string;
  parentId: number | null;
  userId: string;
  user: { nickname: string; avatar?: string };
  content: string;
  createdAt: string;
  replies?: ProductComment[];
}

/** 상품 */
export interface Product {
/* ... 기존 코드 ... */
}

/**
 * API 응답용 DTO
 */

export interface CategoryResponse {
  id: number;
  name: string;
  depth: number;
  parentId: number | null;
}

export interface ProductListItem {
  productUuid: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  likeCount: number;
}

export interface ProductListResponse {
  items: ProductListItem[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
}

export interface ProductDetailResponse {
  productUuid: string;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  saleStatus: 'ON_SALE' | 'RESERVED' | 'SOLD_OUT';
  visibilityStatus: 'VISIBLE' | 'HIDDEN' | 'BLOCKED';
  likeCount: number;
  viewCount: number;
  imageUrls: string[];
  category: {
    id: number;
    name: string;
    depth: number;
  };
}
