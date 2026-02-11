# API 연동 구현 내역

## 1. 인증 및 회원 관리 (Step 1)
- **상태**: 완료
- **내용**: 
    - `authService.ts`가 백엔드 엔드포인트와 연동됨.
    - `useAuthStore.ts`에서 실제 유저 정보(UUID, 이메일, 닉네임 등)를 관리하도록 수정됨.
    - `LoginPage`, `SignupPage`에서 실데이터 기반으로 작동 확인.

## 2. 장바구니 연동 (Step 2)
- **상태**: 완료
- **변경 사항**:
    - `src/constants/apiEndpoints.ts`에 `CARTS` 그룹 추가.
    - `src/services/cartService.ts` 신규 생성 및 API 연동.
    - `src/stores/useCartStore.ts`를 로컬 상태에서 API 동기화 방식으로 전면 개편.
    - `CartPage`, `CartList`, `CartItem` 컴포넌트가 백엔드 `CartDto` 구조를 사용하도록 수정.

## 3. 주문 및 결제 연동 (Step 3)
- **상태**: 완료
- **내용**:
    - `orderService.ts` 신규 생성 및 주문 생성 API(`/api/v1/orders`) 연동.
    - `OrderPage.tsx`에서 실제 주문 생성을 호출하고 발급된 `orderUuid`를 결제 단계로 전달.
    - `CheckoutPage.tsx`에서 토스페이먼츠 연동 시 `orderUuid`를 멱등키로 사용하고, 실데이터 기반 상품명 구성.
    - `paymentService.ts`를 통해 결제 준비(`prepare`) 및 승인(`confirm`) API 호출 로직 정비.

## 4. 상품 Catalog 및 사용자 기능 고도화 (Phase 2, 2025-05-23)
- **상태**: 완료
- **내용**:
    - `productService.ts`와 `useProductStore.ts`를 신설하여 카테고리/추천상품/상품목록/상세 조회 API 연동.
    - `HomePage`와 `ProductDetailPage`를 실제 백엔드 데이터 기반으로 전환.
    - `userService.ts`를 통해 예치금(Deposit) 잔액 조회 및 찜하기(Like) 기능 연동.
    - `useLikeStore.ts`를 로컬 스토리지 기반에서 API 연동 방식으로 전면 개편.
    - `MyPage.tsx`에서 실제 유저의 예치금 잔고와 찜 목록 동기화 처리.

## 5. 실데이터 미교체 리스트 (Mock 유지)
- **검색(Search)**: 백엔드 미구현으로 Mock 유지.
- **리뷰(Reviews)**: 백엔드 미구현으로 Mock 유지.
- **배송지 관리**: 백엔드 `UserController`에 주소록 관련 엔드포인트가 없어 Mock 데이터(`mocks/address.ts`) 유지.
- **팔로우(Follow)**: 백엔드 엔드포인트 부재로 Mock 유지.

## 6. 알려진 이슈 및 개선 필요 사항
- **CartDto sellerUuid 부재**: 주문 생성 시 `sellerUuid`가 필수(`@NotNull`)이나, `CartDto` 응답에 해당 필드가 없어 현재 임시 UUID값으로 처리 중임. 백엔드 DTO 수정 필요.
- **배송비 정보**: 백엔드 `CartDto`에 `shippingFee`가 포함되지 않아 장바구니 요약에서 배송비가 0으로 고정됨.

---

## 2026-02-11 추가 연동 내역 (백엔드 최신 반영)

### 완료 항목
- Like API 경로를 백엔드 구현과 일치하도록 수정
  - `POST/DELETE /api/v1/products/{productUuid}/like`
  - `GET /api/v1/products/likes/me`
- 상점 페이지 실데이터 연동
  - `GET /api/v1/shops/{shopUuid}`
  - `GET /api/v1/shops/{shopUuid}/products`
  - `GET /api/v1/sellers/{sellerUuid}/followers`
  - `GET /api/v1/sellers/{sellerUuid}/reviews`
  - `GET /api/v1/sellers/{sellerUuid}/reviews-summary`
- 팔로우 스토어/컴포넌트 API 연동
  - `POST/DELETE /api/v1/sellers/{sellerUuid}/follow`
  - `GET /api/v1/sellers/me/following`
- 상품 상세 댓글 연동
  - `GET /api/v1/products/{productUuid}/comments`
- 주소 타입 분리 및 주소 선택 컴포넌트 API 연동
  - `GET /api/v1/users/me/addresse`

### 신규/수정 파일
- 신규
  - `src/types/category.ts`
  - `src/types/address.ts`
  - `src/services/shopService.ts`
  - `src/services/followService.ts`
  - `src/services/reviewService.ts`
  - `src/services/commentService.ts`
- 주요 수정
  - `src/constants/apiEndpoints.ts`
  - `src/services/userService.ts`
  - `src/stores/useFollowStore.ts`
  - `src/components/features/mypage/FollowingShops.tsx`
  - `src/components/features/shop/FollowButton.tsx`
  - `src/pages/ShopPage.tsx`
  - `src/pages/ProductDetailPage.tsx`
  - `src/components/features/review/ReviewList.tsx`
  - `src/components/features/product/ProductComments.tsx`
  - `src/components/features/order/AddressSelector.tsx`
  - `src/stores/useUserStore.ts`

### 남은 mock 사용 항목 (추가 교체 필요)
- 판매자 상품 관리 스토어/컴포넌트
  - `src/stores/useSellerStore.ts`
  - `src/components/features/seller/*`
- 관리자 화면 일부
  - `src/pages/admin/AdminDashboardPage.tsx`
  - `src/components/features/admin/AdminProductList.tsx`
  - `src/components/features/admin/AdminUserList.tsx`
  - `src/components/features/admin/CategoryTree.tsx`
- 배너 스토어
  - `src/stores/useBannerStore.ts`
- 상품 필터 카테고리 mock 참조
  - `src/components/features/product/ProductFilter.tsx`

### 스펙/구현 이슈 리스트
- 주소 API 경로 오탈자성 스펙
  - 현재 백엔드 구현 경로: `/api/v1/users/me/addresse`
  - 일반적 네이밍은 `/addresses`가 자연스러움
- ShopResponse에 닉네임 필드 부재
  - `ShopResponse`에는 `shopUuid, intro, salesCount, activeListingCount`만 존재
  - 프론트 상점명 표시는 현재 UUID 기반 임시 처리
- 댓글/리뷰 응답에 표시용 사용자 프로필 데이터 부재
  - buyer/seller 닉네임, 아바타가 없어 프론트는 UUID 축약 표시
- Order 생성 시 `sellerUuid` 보강 이슈는 여전히 존재
  - Cart 응답 기반으로 sellerUuid 확보가 어려운 케이스가 남아 있음

## 2026-02-11 추가 반영 (2차)
- 주소 경로 기준을 `adresses`로 통일
  - `src/constants/apiEndpoints.ts` (`/api/v1/users/me/adresses`)
- 판매자 영역 mock 제거
  - `src/stores/useSellerStore.ts`: `MOCK_PRODUCTS` 제거, `GET /api/v1/shops/me/products` 연동
  - `src/components/features/seller/ProductForm.tsx`: `MOCK_CATEGORIES` 제거, 카테고리 API 연동
- 필터/마이페이지/판매자 컴포넌트의 mock 타입 의존 제거
  - `src/components/features/product/ProductFilter.tsx`
  - `src/components/features/mypage/ProfileCard.tsx`
  - `src/components/features/mypage/SalesTabs.tsx`
  - `src/components/features/seller/SellerProductList.tsx`
  - `src/components/features/seller/SellerProductCard.tsx`
- 빌드 검증 통과 (`npm run build`)
