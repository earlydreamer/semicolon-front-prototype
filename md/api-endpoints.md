# API 엔드포인트 정의서

> [!IMPORTANT]
> **이 문서는 모든 API 엔드포인트의 단일 진실 공급원(SSOT)입니다.**  
> 엔드포인트 변경 시 이 문서를 먼저 수정하고, `src/constants/apiEndpoints.ts`에 반영하세요.

---

## 기본 설정

```typescript
// src/constants/apiEndpoints.ts 에서 관리
export const API_BASE_URL = '/api/v1';
```

---

## 인증 (Auth)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `AUTH_LOGIN` | POST | `/auth/login` | 로그인 | 목업 |
| `AUTH_LOGOUT` | POST | `/auth/logout` | 로그아웃 | 목업 |
| `AUTH_SIGNUP` | POST | `/auth/signup` | 회원가입 | 목업 |
| `AUTH_REFRESH` | POST | `/auth/refresh` | 토큰 갱신 | 목업 |
| `AUTH_OAUTH_KAKAO` | GET | `/auth/oauth/kakao` | 카카오 로그인 | 목업 |
| `AUTH_OAUTH_NAVER` | GET | `/auth/oauth/naver` | 네이버 로그인 | 목업 |
| `AUTH_OAUTH_GOOGLE` | GET | `/auth/oauth/google` | 구글 로그인 | 목업 |

---

## 사용자 (Users)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `USERS_ME` | GET | `/users/me` | 내 정보 조회 | 목업 |
| `USERS_ME_UPDATE` | PUT | `/users/me` | 내 정보 수정 | 목업 |
| `USERS_PASSWORD` | PUT | `/users/me/password` | 비밀번호 변경 | 목업 |
| `USERS_DELETE` | DELETE | `/users/me` | 회원 탈퇴 | 목업 |
| `USERS_ADDRESSES` | GET | `/users/addresses` | 배송지 목록 | 목업 |
| `USERS_ADDRESSES_CREATE` | POST | `/users/addresses` | 배송지 추가 | 목업 |
| `USERS_ADDRESSES_UPDATE` | PUT | `/users/addresses/:id` | 배송지 수정 | 목업 |
| `USERS_ADDRESSES_DELETE` | DELETE | `/users/addresses/:id` | 배송지 삭제 | 목업 |
| `USERS_DEPOSITS_BALANCE` | GET | `/deposits/me/balance` | 예치금 잔액 조회 | 구현됨 |
| `USERS_DEPOSITS_HISTORIES` | GET | `/deposits/me/histories` | 예치금 내역 조회 | 구현됨 |
| `USERS_FOLLOWING` | GET | `/users/following` | 팔로잉 목록 | 목업 |
| `USERS_FOLLOW` | POST | `/users/:id/follow` | 팔로우 | 목업 |
| `USERS_UNFOLLOW` | DELETE | `/users/:id/follow` | 언팔로우 | 목업 |
| `USERS_LIKES` | GET | `/users/likes` | 좋아요 목록 | 목업 |

---

## 상품 (Products)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `PRODUCTS_LIST` | GET | `/products` | 상품 목록 | 목업 |
| `PRODUCTS_DETAIL` | GET | `/products/:id` | 상품 상세 | 목업 |
| `PRODUCTS_CREATE` | POST | `/products` | 상품 등록 | 목업 |
| `PRODUCTS_UPDATE` | PUT | `/products/:id` | 상품 수정 | 목업 |
| `PRODUCTS_DELETE` | DELETE | `/products/:id` | 상품 삭제 | 목업 |
| `PRODUCTS_LATEST` | GET | `/products/latest` | 최신 상품 | 목업 |
| `PRODUCTS_POPULAR` | GET | `/products/popular` | 인기 상품 | 목업 |
| `PRODUCTS_FAVORITES` | GET | `/products/favorites` | 즐겨찾기 상품 | 목업 |
| `PRODUCTS_MINE` | GET | `/products/mine` | 내 상품 목록 | 목업 |
| `PRODUCTS_LIKE` | POST | `/products/:id/like` | 좋아요 | 목업 |
| `PRODUCTS_UNLIKE` | DELETE | `/products/:id/like` | 좋아요 취소 | 목업 |

---

## 카테고리 (Categories)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `CATEGORIES_LIST` | GET | `/categories` | 카테고리 목록 | 목업 |
| `CATEGORIES_PRODUCTS` | GET | `/categories/:id/products` | 카테고리별 상품 | 목업 |

---

## 검색 (Search)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `SEARCH` | GET | `/search` | 상품 검색 | 목업 |
| `SEARCH_AUTOCOMPLETE` | GET | `/search/autocomplete` | 자동완성 | 목업 |

---

## 장바구니 (Cart)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `CART_LIST` | GET | `/cart` | 장바구니 조회 | 목업 |
| `CART_ADD` | POST | `/cart` | 장바구니 추가 | 목업 |
| `CART_UPDATE` | PUT | `/cart/:id` | 수량 변경 | 목업 |
| `CART_DELETE` | DELETE | `/cart/:id` | 상품 삭제 | 목업 |
| `CART_CLEAR` | DELETE | `/cart` | 장바구니 비우기 | 목업 |

---

## 주문 (Orders)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `ORDERS_LIST` | GET | `/orders` | 주문 목록 | 목업 |
| `ORDERS_DETAIL` | GET | `/orders/:id` | 주문 상세 | 목업 |
| `ORDERS_CREATE` | POST | `/orders` | 주문 생성 | 목업 |
| `ORDERS_CONFIRM` | POST | `/orders/:id/confirm` | 구매 확정 | 목업 |
| `ORDERS_CANCEL` | POST | `/orders/:id/cancel` | 주문 취소 | 목업 |

---

## 결제 (Payments)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `PAYMENTS_CREATE` | POST | `/payments` | 결제 요청 | 목업 |
| `PAYMENTS_STATUS` | GET | `/payments/:id` | 결제 상태 | 목업 |
| `PAYMENTS_CONFIRM` | POST | `/payments/:id/confirm` | 결제 확인 | 목업 |
| `PAYMENTS_CANCEL` | POST | `/payments/:id/cancel` | 결제 취소 | 목업 |

---

## 쿠폰 (Coupons)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `COUPONS_AVAILABLE` | GET | `/coupons/available` | 사용 가능 쿠폰 | 목업 |
| `COUPONS_APPLY` | POST | `/coupons/:code/apply` | 쿠폰 적용 | 목업 |

---

## 상점 (Shops)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `SHOPS_DETAIL` | GET | `/shops/:id` | 상점 정보 | 목업 |
| `SHOPS_UPDATE` | PUT | `/shops/me` | 내 상점 수정 | 목업 |
| `SHOPS_PRODUCTS` | GET | `/shops/:id/products` | 상점 상품 목록 | 목업 |
| `SHOPS_REVIEWS` | GET | `/shops/:id/reviews` | 상점 후기 | 목업 |

---

## 정산 (Settlements)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `SETTLEMENTS_LIST` | GET | `/settlements` | 정산 내역 | 목업 |
| `SETTLEMENTS_AVAILABLE` | GET | `/settlements/available` | 정산 가능 금액 | 목업 |
| `SETTLEMENTS_REQUEST` | POST | `/settlements/request` | 정산 요청 | 목업 |

---

## 배송 (Delivery)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `DELIVERY_TRACK` | GET | `/delivery/:trackingNo` | 배송 추적 | 목업 |

---

## 관리자 (Admin)

| Key | Method | Endpoint | 설명 | 상태 |
|-----|--------|----------|------|------|
| `ADMIN_DASHBOARD` | GET | `/admin/dashboard` | 대시보드 통계 | 목업 |
| `ADMIN_REPORTS` | GET | `/admin/reports` | 신고 목록 | 목업 |
| `ADMIN_REPORTS_PROCESS` | PUT | `/admin/reports/:id` | 신고 처리 | 목업 |
| `ADMIN_PRODUCTS` | GET | `/admin/products` | 상품 목록 | 목업 |
| `ADMIN_PRODUCTS_SUSPEND` | PUT | `/admin/products/:id/suspend` | 상품 정지 | 목업 |
| `ADMIN_USERS` | GET | `/admin/users` | 회원 목록 | 목업 |
| `ADMIN_USERS_SUSPEND` | PUT | `/admin/users/:id/suspend` | 회원 정지 | 목업 |
| `ADMIN_SETTLEMENTS` | GET | `/admin/settlements` | 정산 목록 | 목업 |
| `ADMIN_COUPONS` | GET | `/admin/coupons` | 쿠폰 목록 | 목업 |
| `ADMIN_COUPONS_CREATE` | POST | `/admin/coupons` | 쿠폰 생성 | 목업 |
| `ADMIN_COUPONS_UPDATE` | PUT | `/admin/coupons/:id` | 쿠폰 수정 | 목업 |
| `ADMIN_COUPONS_DELETE` | DELETE | `/admin/coupons/:id` | 쿠폰 삭제 | 목업 |
| `ADMIN_CATEGORIES` | GET | `/admin/categories` | 카테고리 목록 | 목업 |
| `ADMIN_CATEGORIES_CREATE` | POST | `/admin/categories` | 카테고리 생성 | 목업 |
| `ADMIN_CATEGORIES_UPDATE` | PUT | `/admin/categories/:id` | 카테고리 수정 | 목업 |
| `ADMIN_CATEGORIES_DELETE` | DELETE | `/admin/categories/:id` | 카테고리 삭제 | 목업 |

---

## 사용 예시

```typescript
// src/constants/apiEndpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/signup',
    // ...
  },
  USERS: {
    ME: '/users/me',
    ADDRESSES: '/users/addresses',
    // ...
  },
  // ...
} as const;

// 사용 시
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
const response = await api.get(API_ENDPOINTS.USERS.ME);
```

---

> **마지막 업데이트**: 2026-01-08  
> **버전**: 1.0.0  
> **상태**: 목업 (Mock)
