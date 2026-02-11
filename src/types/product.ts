/**
 * 상품 관련 타입 정의
 */

/** 상품 상태 */
export type ConditionStatus = 'SEALED' | 'NO_WEAR' | 'MINOR_WEAR' | 'VISIBLE_WEAR' | 'DAMAGED';

/** 판매 상태 */
export type SaleStatus = 'ON_SALE' | 'RESERVED' | 'SOLD_OUT';

/** 가시성 상태 */
export type VisibilityStatus = 'VISIBLE' | 'HIDDEN' | 'BLOCKED';

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

/** 상품 (Mock 데이터용) */
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  category: string;
  categoryId: number;
  createdAt: string;
  conditionStatus: ConditionStatus;
  saleStatus: SaleStatus;
  visibilityStatus?: VisibilityStatus;
  shippingFee: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isSafe: boolean;
  purchaseDate?: string;
  usePeriod?: string;
  detailedCondition?: string;
  seller: ProductSeller;
  comments?: ProductComment[];
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
  viewCount?: number;
  commentCount?: number;
  createdAt?: string;
  saleStatus?: SaleStatus;
  visibilityStatus?: VisibilityStatus;
}

export interface ProductListResponse {
  items: ProductListItem[];
  content?: ProductListItem[]; // 호환성을 위해 유지
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
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
  seller?: {
    shopUuid: string;
    nickname: string;
  };
}

export interface ShopResponse {
  shopUuid: string;
  nickname: string;
  intro: string;
  salesCount: number;
  activeListingCount: number;
}
