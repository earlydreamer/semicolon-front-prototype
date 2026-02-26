# 네이밍 컨벤션 정의서

> [!IMPORTANT]
> **이 문서는 주요 변수명, 상수명의 단일 진실 공급원(SSOT)입니다.**  
> 팀 컨벤션 확정 시 이 문서를 수정하고, 코드베이스에 일괄 반영하세요.

---

## 교체 가이드

### 변경 절차
1. 이 문서에서 변경할 항목 찾기
2. **현재 사용값** → **새로운 값**으로 수정
3. IDE의 전체 검색/치환 기능으로 코드베이스 일괄 교체
4. `src/constants/` 폴더 상수 파일 우선 수정

### 검색 패턴
```
검색: 현재_변수명
치환: 새로운_변수명
범위: src/ 폴더 전체
```

---

## 엔티티 변수명

### 사용자 (User)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 사용자 ID | `userId` | 사용자 고유 식별자 | `string` |
| 이메일 | `email` | 로그인 이메일 | `string` |
| 닉네임 | `nickname` | 표시 이름 | `string` |
| 프로필 이미지 | `profileImage` | 프로필 사진 URL | `string` |
| 휴대폰 | `phoneNumber` | 휴대폰 번호 | `string` |
| 가입일 | `createdAt` | 가입 일시 | `Date` |
| 포인트 | `points` | 보유 포인트 | `number` |
| 역할 | `role` | 사용자 역할 | `'user' \| 'admin'` |

### 상품 (Product)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 상품 ID | `productId` | 상품 고유 식별자 | `string` |
| 제목 | `title` | 상품 제목 | `string` |
| 가격 | `price` | 판매 가격 | `number` |
| 설명 | `description` | 상품 설명 | `string` |
| 이미지 목록 | `images` | 상품 이미지 URLs | `string[]` |
| 썸네일 | `thumbnail` | 대표 이미지 URL | `string` |
| 카테고리 ID | `categoryId` | 카테고리 식별자 | `string` |
| 판매자 ID | `sellerId` | 판매자 사용자 ID | `string` |
| 상품 상태 | `condition` | 사용감 상태 | `ProductCondition` |
| 판매 상태 | `status` | 판매/예약/완료 | `ProductStatus` |
| 조회수 | `viewCount` | 조회수 | `number` |
| 좋아요수 | `likeCount` | 좋아요 수 | `number` |
| 댓글수 | `commentCount` | 댓글 수 | `number` |
| 배송비 | `shippingFee` | 배송비 | `number` |
| 등록일 | `createdAt` | 등록 일시 | `Date` |
| 수정일 | `updatedAt` | 수정 일시 | `Date` |

### 카테고리 (Category)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 카테고리 ID | `categoryId` | 카테고리 식별자 | `string` |
| 이름 | `name` | 카테고리명 | `string` |
| 슬러그 | `slug` | URL용 슬러그 | `string` |
| 부모 ID | `parentId` | 상위 카테고리 ID | `string \| null` |
| 아이콘 | `icon` | 카테고리 아이콘 | `string` |
| 순서 | `order` | 정렬 순서 | `number` |

### 주문 (Order)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 주문 ID | `orderId` | 주문 식별자 | `string` |
| 주문번호 | `orderNumber` | 표시용 주문번호 | `string` |
| 구매자 ID | `buyerId` | 구매자 사용자 ID | `string` |
| 상품 ID | `productId` | 주문 상품 ID | `string` |
| 수량 | `quantity` | 주문 수량 | `number` |
| 상품금액 | `productAmount` | 상품 총 금액 | `number` |
| 배송비 | `shippingFee` | 배송비 | `number` |
| 할인금액 | `discountAmount` | 쿠폰/포인트 할인 | `number` |
| 최종금액 | `totalAmount` | 최종 결제 금액 | `number` |
| 주문상태 | `orderStatus` | 주문 상태 | `OrderStatus` |
| 결제일시 | `paidAt` | 결제 완료 일시 | `Date` |
| 주문일시 | `createdAt` | 주문 생성 일시 | `Date` |

### 장바구니 (Cart)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 장바구니 ID | `cartId` | 장바구니 항목 ID | `string` |
| 사용자 ID | `userId` | 사용자 ID | `string` |
| 상품 ID | `productId` | 상품 ID | `string` |
| 수량 | `quantity` | 담은 수량 | `number` |
| 추가일시 | `addedAt` | 장바구니 추가 일시 | `Date` |

### 배송지 (Address)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 배송지 ID | `addressId` | 배송지 식별자 | `string` |
| 배송지명 | `addressName` | 배송지 별칭 | `string` |
| 수령인 | `recipientName` | 받는 분 이름 | `string` |
| 연락처 | `recipientPhone` | 받는 분 연락처 | `string` |
| 우편번호 | `zipCode` | 우편번호 | `string` |
| 주소 | `address` | 기본 주소 | `string` |
| 상세주소 | `detailAddress` | 상세 주소 | `string` |
| 기본배송지 | `isDefault` | 기본 배송지 여부 | `boolean` |

### 상점 (Shop)

| 속성 | 현재 사용값 | 설명 | 타입 |
|------|-------------|------|------|
| 상점 ID | `shopId` | 상점 식별자 | `string` |
| 상점명 | `shopName` | 상점 이름 | `string` |
| 소개 | `introduction` | 상점 소개글 | `string` |
| 누적판매수 | `totalSalesCount` | 총 판매 건수 | `number` |
| 현재판매수 | `activeSalesCount` | 현재 판매중 수 | `number` |
| 팔로워수 | `followerCount` | 팔로워 수 | `number` |
| 평점 | `rating` | 상점 평점 | `number` |

---

## Enum 값 정의

### 상품 상태 (ProductCondition)

| 값 | 현재 사용값 | 표시 텍스트 |
|----|-------------|-------------|
| 새상품 | `NEW` | 새 상품 (미개봉) |
| 거의새것 | `LIKE_NEW` | 거의 새 것 |
| 사용감없음 | `EXCELLENT` | 사용감 없음 |
| 잔기스있음 | `GOOD` | 잔기스 있음 |
| 사용감있음 | `FAIR` | 사용감 있음 |

### 판매 상태 (ProductStatus)

| 값 | 현재 사용값 | 표시 텍스트 |
|----|-------------|-------------|
| 판매중 | `ON_SALE` | 판매중 |
| 예약중 | `RESERVED` | 예약중 |
| 판매완료 | `SOLD_OUT` | 판매완료 |

### 주문 상태 (OrderStatus)

| 값 | 현재 사용값 | 표시 텍스트 |
|----|-------------|-------------|
| 주문완료 | `ORDERED` | 주문완료 |
| 결제완료 | `PAID` | 결제완료 |
| 배송준비 | `PREPARING` | 배송준비중 |
| 배송중 | `SHIPPING` | 배송중 |
| 배송완료 | `DELIVERED` | 배송완료 |
| 구매확정 | `CONFIRMED` | 구매확정 |
| 취소됨 | `CANCELLED` | 주문취소 |
| 환불됨 | `REFUNDED` | 환불완료 |

### 정산 상태 (SettlementStatus)

| 값 | 현재 사용값 | 표시 텍스트 |
|----|-------------|-------------|
| 정산대기 | `PENDING` | 정산 대기 |
| 정산가능 | `AVAILABLE` | 정산 가능 |
| 정산완료 | `COMPLETED` | 정산 완료 |

---

## 상수 정의

### 앱 설정

| 상수 | 현재 사용값 | 설명 |
|------|-------------|------|
| 앱 이름 | `APP_NAME = '세미콜론'` | 서비스 명 |
| 앱 설명 | `APP_DESCRIPTION = '취미 특화 중고거래'` | 서비스 설명 |

### 페이지네이션

| 상수 | 현재 사용값 | 설명 |
|------|-------------|------|
| 기본 페이지 크기 | `DEFAULT_PAGE_SIZE = 20` | 목록 기본 개수 |
| 최대 페이지 크기 | `MAX_PAGE_SIZE = 100` | 최대 조회 개수 |

### 파일 업로드

| 상수 | 현재 사용값 | 설명 |
|------|-------------|------|
| 최대 이미지 용량 | `MAX_IMAGE_SIZE = 5242880` | 5MB (bytes) |
| 최대 이미지 개수 | `MAX_IMAGE_COUNT = 10` | 상품당 최대 이미지 |
| 허용 확장자 | `ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp']` | 이미지 확장자 |

### 정렬 옵션

| 상수 | 현재 사용값 | 표시 텍스트 |
|------|-------------|-------------|
| 최신순 | `SORT_LATEST = 'latest'` | 최신순 |
| 인기순 | `SORT_POPULAR = 'popular'` | 인기순 |
| 저가순 | `SORT_PRICE_LOW = 'price_low'` | 낮은 가격순 |
| 고가순 | `SORT_PRICE_HIGH = 'price_high'` | 높은 가격순 |

---

## 스토리지 키

| 용도 | 현재 사용값 | 설명 |
|------|-------------|------|
| 액세스 토큰 | `STORAGE_ACCESS_TOKEN = 'accessToken'` | localStorage |
| 리프레시 토큰 | `STORAGE_REFRESH_TOKEN = 'refreshToken'` | localStorage |
| 사용자 정보 | `STORAGE_USER = 'user'` | localStorage |
| 최근 검색어 | `STORAGE_RECENT_SEARCHES = 'recentSearches'` | localStorage |
| 장바구니 | `STORAGE_CART = 'cart'` | localStorage (비로그인) |

---

## 라우트 경로

| 페이지 | 현재 사용값 | 설명 |
|--------|-------------|------|
| 홈 | `ROUTE_HOME = '/'` | 메인 페이지 |
| 로그인 | `ROUTE_LOGIN = '/login'` | 로그인 |
| 회원가입 | `ROUTE_SIGNUP = '/signup'` | 회원가입 |
| 카테고리 | `ROUTE_CATEGORY = '/category/:id'` | 카테고리 목록 |
| 상품상세 | `ROUTE_PRODUCT = '/product/:id'` | 상품 상세 |
| 검색결과 | `ROUTE_SEARCH = '/search'` | 검색 결과 |
| 장바구니 | `ROUTE_CART = '/cart'` | 장바구니 |
| 주문 | `ROUTE_ORDER = '/order'` | 주문/결제 |
| 주문완료 | `ROUTE_ORDER_COMPLETE = '/order/complete'` | 주문 완료 |
| 마이페이지 | `ROUTE_MYPAGE = '/mypage'` | 마이페이지 |
| 주문내역 | `ROUTE_ORDERS = '/mypage/orders'` | 주문 내역 |
| 배송지관리 | `ROUTE_ADDRESSES = '/mypage/addresses'` | 배송지 관리 |
| 내상점 | `ROUTE_MY_SHOP = '/shop/me'` | 내 상점 |
| 상점 | `ROUTE_SHOP = '/shop/:id'` | 판매자 상점 |
| 상품등록 | `ROUTE_PRODUCT_NEW = '/product/new'` | 상품 등록 |
| 상품수정 | `ROUTE_PRODUCT_EDIT = '/product/:id/edit'` | 상품 수정 |

---

## 기타 UI 텍스트

| 용도 | 현재 사용값 | 설명 |
|------|-------------|------|
| 로딩 텍스트 | `TEXT_LOADING = '불러오는 중...'` | 로딩 표시 |
| 빈 목록 | `TEXT_EMPTY_LIST = '목록이 비어있습니다.'` | 빈 상태 |
| 에러 메시지 | `TEXT_ERROR_DEFAULT = '오류가 발생했습니다.'` | 기본 에러 |
| 네트워크 에러 | `TEXT_ERROR_NETWORK = '네트워크 연결을 확인해주세요.'` | 네트워크 오류 |

---

> **마지막 업데이트**: 2026-01-08  
> **버전**: 1.0.0  
> **상태**: 임시 (팀 컨벤션 미확정)
