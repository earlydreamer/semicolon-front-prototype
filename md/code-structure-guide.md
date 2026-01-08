# 코드 구조 가이드

> [!NOTE]
> 이 문서는 하드코딩 방지 및 교체 용이성을 위한 코드 구조 가이드입니다.

---

## 상수 관리 구조

### 폴더 구조

```
src/
├── constants/
│   ├── index.ts              # 전체 export
│   ├── apiEndpoints.ts       # API 엔드포인트
│   ├── routes.ts             # 라우트 경로
│   ├── storage.ts            # 스토리지 키
│   ├── enums.ts              # Enum 값들
│   ├── config.ts             # 앱 설정
│   └── messages.ts           # UI 텍스트
├── types/
│   ├── index.ts              # 전체 export
│   ├── user.ts               # 사용자 관련 타입
│   ├── product.ts            # 상품 관련 타입
│   ├── order.ts              # 주문 관련 타입
│   ├── cart.ts               # 장바구니 타입
│   ├── shop.ts               # 상점 타입
│   └── common.ts             # 공통 타입
└── mocks/
    ├── index.ts              # Mock 데이터 export
    ├── users.ts              # 더미 사용자
    ├── products.ts           # 더미 상품
    ├── categories.ts         # 더미 카테고리
    └── orders.ts             # 더미 주문
```

---

## 파일 예시

### `src/constants/apiEndpoints.ts`

```typescript
/**
 * API 엔드포인트 상수
 * 
 * @description
 * 모든 API 경로는 이 파일에서 중앙 관리합니다.
 * 엔드포인트 변경 시 이 파일만 수정하면 됩니다.
 * 
 * @see md/api-endpoints.md - 전체 API 문서
 */

export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    OAUTH: {
      KAKAO: '/auth/oauth/kakao',
      NAVER: '/auth/oauth/naver',
      GOOGLE: '/auth/oauth/google',
    },
  },
  
  // 사용자
  USERS: {
    ME: '/users/me',
    PASSWORD: '/users/me/password',
    ADDRESSES: '/users/addresses',
    POINTS: '/users/points',
    FOLLOWING: '/users/following',
    LIKES: '/users/likes',
    FOLLOW: (userId: string) => `/users/${userId}/follow`,
  },
  
  // 상품
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (productId: string) => `/products/${productId}`,
    LATEST: '/products/latest',
    POPULAR: '/products/popular',
    FAVORITES: '/products/favorites',
    MINE: '/products/mine',
    LIKE: (productId: string) => `/products/${productId}/like`,
  },
  
  // 카테고리
  CATEGORIES: {
    LIST: '/categories',
    PRODUCTS: (categoryId: string) => `/categories/${categoryId}/products`,
  },
  
  // 장바구니
  CART: {
    LIST: '/cart',
    ITEM: (cartId: string) => `/cart/${cartId}`,
  },
  
  // 주문
  ORDERS: {
    LIST: '/orders',
    DETAIL: (orderId: string) => `/orders/${orderId}`,
    CONFIRM: (orderId: string) => `/orders/${orderId}/confirm`,
    CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
  },
  
  // 상점
  SHOPS: {
    DETAIL: (shopId: string) => `/shops/${shopId}`,
    ME: '/shops/me',
    PRODUCTS: (shopId: string) => `/shops/${shopId}/products`,
  },
} as const;
```

### `src/constants/routes.ts`

```typescript
/**
 * 라우트 경로 상수
 * 
 * @see md/naming-conventions.md - 라우트 경로 섹션
 */

export const ROUTES = {
  // 메인
  HOME: '/',
  
  // 인증
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // 상품
  CATEGORY: '/category/:id',
  PRODUCT_DETAIL: '/product/:id',
  PRODUCT_NEW: '/product/new',
  PRODUCT_EDIT: '/product/:id/edit',
  SEARCH: '/search',
  
  // 장바구니/주문
  CART: '/cart',
  ORDER: '/order',
  ORDER_COMPLETE: '/order/complete',
  
  // 마이페이지
  MYPAGE: '/mypage',
  MYPAGE_ORDERS: '/mypage/orders',
  MYPAGE_ADDRESSES: '/mypage/addresses',
  MYPAGE_LIKES: '/mypage/likes',
  
  // 상점
  SHOP: '/shop/:id',
  MY_SHOP: '/shop/me',
  SETTLEMENT: '/shop/settlement',
  
  // 관리자
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_COUPONS: '/admin/coupons',
} as const;

// 동적 경로 헬퍼
export const buildRoute = {
  category: (id: string) => `/category/${id}`,
  product: (id: string) => `/product/${id}`,
  productEdit: (id: string) => `/product/${id}/edit`,
  shop: (id: string) => `/shop/${id}`,
  orderDetail: (id: string) => `/mypage/orders/${id}`,
};
```

### `src/constants/enums.ts`

```typescript
/**
 * Enum 상수
 * 
 * @see md/naming-conventions.md - Enum 값 정의 섹션
 */

// 상품 상태
export const PRODUCT_CONDITION = {
  NEW: 'NEW',
  LIKE_NEW: 'LIKE_NEW',
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
} as const;

export const PRODUCT_CONDITION_LABEL: Record<string, string> = {
  [PRODUCT_CONDITION.NEW]: '새 상품 (미개봉)',
  [PRODUCT_CONDITION.LIKE_NEW]: '거의 새 것',
  [PRODUCT_CONDITION.EXCELLENT]: '사용감 없음',
  [PRODUCT_CONDITION.GOOD]: '잔기스 있음',
  [PRODUCT_CONDITION.FAIR]: '사용감 있음',
};

// 판매 상태
export const PRODUCT_STATUS = {
  ON_SALE: 'ON_SALE',
  RESERVED: 'RESERVED',
  SOLD_OUT: 'SOLD_OUT',
} as const;

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  [PRODUCT_STATUS.ON_SALE]: '판매중',
  [PRODUCT_STATUS.RESERVED]: '예약중',
  [PRODUCT_STATUS.SOLD_OUT]: '판매완료',
};

// 주문 상태
export const ORDER_STATUS = {
  ORDERED: 'ORDERED',
  PAID: 'PAID',
  PREPARING: 'PREPARING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  [ORDER_STATUS.ORDERED]: '주문완료',
  [ORDER_STATUS.PAID]: '결제완료',
  [ORDER_STATUS.PREPARING]: '배송준비중',
  [ORDER_STATUS.SHIPPING]: '배송중',
  [ORDER_STATUS.DELIVERED]: '배송완료',
  [ORDER_STATUS.CONFIRMED]: '구매확정',
  [ORDER_STATUS.CANCELLED]: '주문취소',
  [ORDER_STATUS.REFUNDED]: '환불완료',
};

// 정렬 옵션
export const SORT_OPTIONS = {
  LATEST: 'latest',
  POPULAR: 'popular',
  PRICE_LOW: 'price_low',
  PRICE_HIGH: 'price_high',
} as const;

export const SORT_OPTIONS_LABEL: Record<string, string> = {
  [SORT_OPTIONS.LATEST]: '최신순',
  [SORT_OPTIONS.POPULAR]: '인기순',
  [SORT_OPTIONS.PRICE_LOW]: '낮은 가격순',
  [SORT_OPTIONS.PRICE_HIGH]: '높은 가격순',
};
```

---

## 사용 예시

### 컴포넌트에서 사용

```tsx
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { ROUTES, buildRoute } from '@/constants/routes';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABEL } from '@/constants/enums';

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(buildRoute.product(product.productId));
  };
  
  return (
    <div onClick={handleClick}>
      <span className="status-badge">
        {PRODUCT_STATUS_LABEL[product.status]}
      </span>
    </div>
  );
};
```

### API 호출에서 사용

```tsx
import { API_ENDPOINTS, API_BASE_URL } from '@/constants/apiEndpoints';

const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.LIST}`);
  return response.json();
};

const getProductDetail = async (productId: string) => {
  const endpoint = API_ENDPOINTS.PRODUCTS.DETAIL(productId);
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return response.json();
};
```

---

## 교체 시 주의사항

1. **문서 먼저 수정**: `md/api-endpoints.md` 또는 `md/naming-conventions.md` 먼저 수정
2. **상수 파일 수정**: `src/constants/` 해당 파일 수정
3. **타입 확인**: TypeScript 타입 오류 확인
4. **테스트**: 영향받는 기능 테스트

---

> **마지막 업데이트**: 2026-01-08  
> **버전**: 1.0.0
