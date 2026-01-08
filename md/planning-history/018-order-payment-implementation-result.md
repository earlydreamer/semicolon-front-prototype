# 주문/결제 기능 구현 결과

**작성일**: 2026-01-09  
**구현 범위**: 주문서 작성, 배송지/결제후단 선택, 결제 완료 (Mock)

---

## 📝 구현 요약

주문 및 결제 프로세스를 구현했습니다. 장바구니에서 선택된 상품을 주문서로 이동시키고, 배송지와 결제 수단을 선택한 후 모의 결제를 진행하여 완료 페이지로 이동합니다.

---

## 📁 생성된 파일

### Mock 데이터 및 Store

| 파일 | 설명 |
| ---- | ---- |
| `src/mocks/address.ts` | 배송지 주소 Mock 데이터 |
| `src/stores/useOrderStore.ts` | 주문 상태 관리 (선택 상품, 배송지, 결제수단) |

### 컴포넌트

| 파일 | 설명 |
| ---- | ---- |
| `src/components/features/order/OrderItemList.tsx` | 주문 상품 목록 |
| `src/components/features/order/AddressSelector.tsx` | 배송지 선택 (Mock 데이터 연동) |
| `src/components/features/order/PaymentMethodSelector.tsx` | 결제 수단 선택 (UI) |
| `src/components/features/order/OrderSummary.tsx` | 결제 금액 요약 및 결제 버튼 |

### 페이지

| 파일 | 설명 |
| ---- | ---- |
| `src/pages/OrderPage.tsx` | 주문서 작성 페이지 |
| `src/pages/OrderCompletePage.tsx` | 주문 완료 페이지 |

---

## 🔧 수정된 파일

| 파일 | 변경 내용 |
| ---- | -------- |
| `src/App.tsx` | `/order`, `/order/complete` 라우트 추가 |
| `src/components/features/cart/CartSummary.tsx` | 주문하기 버튼 클릭 로직 구현 (→ `/order` 이동) |

---

## ✨ 주요 기능

### 1. 주문서 작성 (`/order`)

- **상품 정보**: 장바구니에서 선택된 상품 정보를 표시
- **배송지**: 기본 배송지 자동 선택, 목록에서 변경 가능 (신규 입력은 UI만 제)
- **결제 수단**: 신용카드, 간편결제, 무통장입금 선택 가능
- **요약**: 상품 금액 + 배송비 = 최종 결제 금액 계산

### 2. 결제 처리 (Mock)

- 필수 정보(배송지, 결제수단) 입력 확인
- 결제 진행 시 1.5초 로딩 후 성공 처리
- 실패 케이스는 현재 구현하지 않음

### 3. 주문 완료 (`/order/complete`)

- 주문 성공 메시지 및 주문 번호 생성 (Timestamp 기반)
- "주문 상세보기" 및 "쇼핑 계속하기" 버튼 제공
- 완료 후 장바구니에서 구매 상품 제거

---

## 🧪 테스트 방법

1. 장바구니에서 상품 선택 후 "주문하기" 클릭
2. `/order` 페이지 진입 확인
3. 배송지 선택 (기본 선택됨)
4. 결제 수단 선택
5. "000원 결제하기" 버튼 클릭
6. 로딩 후 `/order/complete` 페이지 이동 확인

---

> **다음 단계**: 마이페이지 주문 내역 조회 기능 구현 연동
