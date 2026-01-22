# 🚀 프론트엔드-백엔드 연동 통합 계획 (Frontend Integration Plan)

## 1. 개요 (Overview)
본 문서는 프론트엔드(`Vite + React`)와 백엔드(`Spring Boot`) 간의 API 연동을 위한 상세 구현 계획이다. MVP 범위 내에서 실데이터 연동이 가능한 부분과 Mock 데이터를 유지해야 하는 부분을 명확히 구분하여 작업한다.

## 2. 작업 원칙 (Principles)
- **독립 브랜치**: `feature/frontend-integration` 브랜치에서 모든 작업 수행.
- **점진적 구현**: 공통 모듈(API Client) → Auth → Order/Payment → Deposit 순으로 구현.
- **Mock 유지**: 상품(Product), 장바구니(Cart), 정산(Settlement)은 Mock 유지.

## 3. 상세 구현 단계 (Step-by-Step)

### Step 1: API Client 및 공통 설정
- **목표**: Axios 인스턴스에 JWT 토큰 자동 주입 및 에러 처리 로직 추가.
- **작업 내용**:
  - `src/utils/api.ts`: Request Interceptor 보완 (Zustand `useAuthStore` 연동).
  - `vite.config.ts`: Proxy 설정 재확인 (기 완료).

### Step 2: 회원(Auth) 도메인 연동
- **목표**: 회원가입, 로그인, 내 정보 조회/수정을 실데이터로 처리.
- **작업 내용**:
  - `authService.ts` 구현:
    - `register(UserRegisterRequest)`: `POST /api/v1/users/register`
    - `login(LoginRequest)`: `POST /api/v1/auth/login`
    - `getMe()`: `GET /api/v1/users/me`
    - `updateMe(UserUpdateRequest)`: `PUT /api/v1/users/me`
  - 페이지 연동:
    - `LoginPage.tsx`: 실제 로그인 API 호출 및 토큰 저장.
    - `SignupPage.tsx`: 회원가입 API 호출.
    - `MyPage.tsx`, `ProfilePage.tsx`: 내 정보 조회/수정 연동.

### Step 3: 주문(Order) 및 결제(Payment) 연동
- **목표**: 상품 주문부터 토스 결제 승인까지의 프로세스 완수.
- **작업 내용**:
  - `orderService.ts` 구현:
    - `createOrder(OrderCreateRequest)`: `POST /api/v1/orders`
    - `getOrder(uuid)`: `GET /api/v1/orders/{uuid}`
    - `getMyOrders()`: `GET /api/v1/orders/me`
  - `paymentService.ts` 보완:
    - `requestPayment`: 엔드포인트 확인 및 DTO 매핑.
    - `confirmPayment`: 토스 승인 후 백엔드 최종 승인 호출.
  - 페이지 연동:
    - `OrderPage.tsx`: 주문 생성 API 호출 후 `paymentUuid` 획득.
    - `CheckoutPage.tsx`: 토스 위젯 렌더링 및 결제 요청.
    - `OrderCompletePage.tsx`: 완료된 주문 정보 표시.

### Step 4: 예치금(Deposit) 연동
- **목표**: 마이페이지 예치금 잔액 및 내역 실시간 조회.
- **작업 내용**:
  - `depositService.ts` 구현:
    - `getBalance()`: `GET /api/v1/deposits/me/balance`
    - `getHistories()`: `GET /api/v1/deposits/me/histories`
  - 페이지 연동:
    - `MyPage.tsx`: 잔액 표시 컴포넌트 연동.
    - `DepositHistoryPage.tsx` (가칭): 변동 내역 리스트 연동.

## 4. Mock 유지 대상 (미구현 API)
- **상품(Product)**: 홈, 카테고리, 검색, 상세(`ProductDetailPage`) -> Mock 유지.
- **장바구니(Cart)**: 상품 데이터 의존성으로 인해 Mock 유지.
- **정산(Settlement)**: 판매자 기능 미구현으로 Mock 유지.
