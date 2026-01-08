# 결제 기능

## 개요
- **목적**: 결제 연동, 환불 처리, 예치금 관리
- **담당자**: 박재현
- **관련 페이지**: 결제, 환불, 예치금 관리

## 기능 요구사항

### 결제
- [ ] 결제 수단 선택
  - 신용카드
  - 카카오페이
  - 네이버페이
  - 토스페이
- [ ] 결제 진행 (PG사 연동)
- [ ] 결제 완료 처리
- [ ] 결제 실패 처리

### 쿠폰
- [ ] 보유 쿠폰 목록
- [ ] 쿠폰 적용
- [ ] 쿠폰 사용 조건 검증

### 포인트
- [ ] 포인트 잔액 조회
- [ ] 포인트 사용
- [ ] 포인트 적립 (구매 확정 시)

### 환불
- [ ] 환불 요청
- [ ] 환불 상태 조회
- [ ] 환불 완료 처리

### 예치금 (판매자용)
- [ ] 예치금 잔액 조회
- [ ] 예치금 출금 요청
- [ ] 예치금 내역 조회

## 컴포넌트 구조

```
components/features/payment/
├── PaymentMethods.tsx
├── PaymentSummary.tsx
├── CouponList.tsx
├── CouponCard.tsx
├── PointUseForm.tsx
├── RefundForm.tsx
├── RefundStatus.tsx
├── DepositBalance.tsx
└── DepositHistory.tsx

pages/
├── PaymentPage.tsx
├── PaymentCompletePage.tsx
├── PaymentFailPage.tsx
└── RefundPage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/payments | 결제 요청 |
| GET | /api/payments/{id} | 결제 상태 조회 |
| POST | /api/payments/{id}/confirm | 결제 확인 |
| POST | /api/payments/{id}/cancel | 결제 취소 |
| GET | /api/coupons/available | 사용 가능 쿠폰 |
| POST | /api/coupons/{code}/apply | 쿠폰 적용 |
| GET | /api/points | 포인트 조회 |
| POST | /api/points/use | 포인트 사용 |
| POST | /api/refunds | 환불 요청 |
| GET | /api/refunds/{id} | 환불 상태 |
| GET | /api/deposits | 예치금 조회 |
| POST | /api/deposits/withdraw | 출금 요청 |

## 결제 플로우

```
주문 정보 입력
    ↓
결제 수단 선택 + 쿠폰/포인트 적용
    ↓
결제 요청 (PG사)
    ↓
성공 → 주문 완료 / 실패 → 재시도 안내
```

## 보안 요구사항
- 결제 정보 암호화 필수
- PCI-DSS 준수
- 토큰 기반 인증

## 주의사항
- PG사 테스트 모드 활용
- 결제 타임아웃 처리
- 중복 결제 방지
- 환불 정책 명확히 안내

---

> **작성일**: 2026-01-08  
> **상태**: 대기
