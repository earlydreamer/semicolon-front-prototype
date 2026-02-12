/**
 * 라우트 경로 상수
 * 
 * App.tsx에서 사용하는 모든 라우트 경로를 중앙화합니다.
 * 경로 변경 시 이 파일만 수정하면 됩니다.
 */

export const ROUTES = {
  // 메인
  HOME: '/',
  SEARCH: '/search',
  DESIGN: '/design',

  // 인증
  LOGIN: '/login',
  SIGNUP: '/signup',
  EMAIL_VERIFY: '/email/verify',
  EMAIL_PENDING: '/email/pending',

  // 카테고리/상품
  CATEGORY: '/categories/:categoryId',
  PRODUCT_DETAIL: '/products/:productId',

  // 장바구니/주문
  CART: '/cart',
  ORDER: '/order',
  ORDER_COMPLETE: '/order/complete',

  // 마이페이지
  MY_PAGE: '/mypage',
  MY_ORDERS: '/mypage/orders',
  MY_LIKES: '/mypage/likes',

  // 상점
  SHOP: '/shop/:shopId',

  // 판매자
  SELLER: '/seller',
  SELLER_PRODUCT_NEW: '/seller/products/new',
  SELLER_PRODUCT_EDIT: '/seller/products/:productId/edit',
  SELLER_SHOP: '/seller/shop',

  // 관리자
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_SETTLEMENTS: '/admin/settlements',
  ADMIN_CATEGORIES: '/admin/categories',
} as const;

/**
 * 동적 라우트 헬퍼 함수
 */
export const buildRoute = {
  category: (categoryId: string) => `/categories/${categoryId}`,
  product: (productId: string) => `/products/${productId}`,
  shop: (shopId: string) => `/shop/${shopId}`,
  productEdit: (productId: string) => `/seller/products/${productId}/edit`,
};
