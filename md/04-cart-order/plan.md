# 장바구니 & 주문 기능

## 개요
- **목적**: 장바구니 관리, 주문 프로세스 구현
- **담당자**: 문찬희
- **관련 페이지**: 장바구니, 주문/결제, 주문내역

## 기능 요구사항

### 장바구니 ✅ (구현 완료)
- [x] 상품 추가 (동일 상품 1개 제한)
- [x] 상품 삭제
- [x] 선택 삭제
- [x] 전체 선택/해제
- [x] Header 장바구니 아이콘 수량 뱃지
- [ ] 장바구니 비우기
- [ ] 주문하기 연동

### 주문
- [x] 주문서 작성
  - [x] 배송지 정보 입력
  - [x] 주문 상품 확인
  - [x] 결제 금액 확인
- [x] 결제 수단 선택
- [x] 결제 진행 (Mock)
- [x] 주문 확인
- [x] 주문 완료

### 주문 내역
- [ ] 주문 목록 조회
- [ ] 주문 상세 조회
  - 주문 상태
  - 주문 ID
  - 결제 일시
  - 상품 정보
  - 금액 정보
  - 배송 정보
- [ ] 배송 추적 (스윗트래커 연동)
- [ ] 구매 확정
- [ ] 주문 취소

## 컴포넌트 구조

```
components/features/cart/
├── CartItem.tsx
├── CartList.tsx
├── CartSummary.tsx
└── QuantityControl.tsx

components/features/order/
├── OrderForm.tsx
├── OrderSummary.tsx
├── AddressSelector.tsx
├── CouponSelector.tsx
├── PointInput.tsx
├── PaymentMethodSelector.tsx
├── OrderConfirmation.tsx
├── OrderHistoryCard.tsx
└── DeliveryTracker.tsx

pages/
├── CartPage.tsx
├── OrderPage.tsx
├── OrderCompletePage.tsx
├── OrderHistoryPage.tsx
└── OrderDetailPage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/cart | 장바구니 조회 |
| POST | /api/cart | 장바구니 추가 |
| PUT | /api/cart/{id} | 수량 변경 |
| DELETE | /api/cart/{id} | 상품 삭제 |
| DELETE | /api/cart | 장바구니 비우기 |
| POST | /api/orders | 주문 생성 |
| GET | /api/orders | 주문 목록 |
| GET | /api/orders/{id} | 주문 상세 |
| POST | /api/orders/{id}/confirm | 구매 확정 |
| POST | /api/orders/{id}/cancel | 주문 취소 |
| GET | /api/delivery/{trackingNo} | 배송 추적 |

## 주문 상태 플로우

```
주문완료 → 결제완료 → 배송준비중 → 배송중 → 배송완료 → 구매확정
                                                    ↓
                                               정산 대기
```

## 주의사항
- 재고 부족 시 실시간 처리
- 결제 실패 시 재시도 로직
- 배송 API 연동 오류 핸들링
- 구매 확정 후 정산 연동

---

> **작성일**: 2026-01-08  
> **상태**: 장바구니 구현 완료 / 주문 기능 대기
