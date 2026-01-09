# 쿠폰 시스템

## 개요
- **목적**: 할인 쿠폰 발급 및 사용 기능
- **관련 페이지**: 관리자 쿠폰관리, 주문 페이지, 마이페이지

## 구현 체크리스트

### 관리자 (Admin)
### 관리자 (Admin)
- [x] AdminCouponList.tsx (쿠폰 목록 및 생성 폼 통합)
- [x] CouponManagePage.tsx (쿠폰 관리 페이지)
- [x] `/admin/coupons` 라우트 추가

### 사용자
- [x] CouponSelector.tsx (주문 시 쿠폰 선택)
- [x] MyCoupons.tsx (마이페이지 - 추후 구현, 현재는 주문 시 선택으로 기능 대체)
- [x] OrderPage.tsx 쿠폰 적용 UI 연동

### 기능
- [x] 쿠폰 생성 (정액/정률 할인)
- [x] 쿠폰 조건 (최소 주문 금액, 유효 기간)
- [x] 쿠폰 발급/삭제
- [x] 주문 시 쿠폰 적용
- [x] 할인 금액 계산

## 컴포넌트 구조

```
pages/admin/
└── CouponManagePage.tsx

components/features/admin/
└── AdminCouponList.tsx

components/features/order/
└── CouponSelector.tsx
```

## Mock 데이터 구조

```typescript
type DiscountType = 'FIXED' | 'PERCENT';

interface Coupon {
  id: string;
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;  // 정액이면 원, 정률이면 %
  minOrderAmount: number;
  maxDiscount?: number;   // 정률일 때 최대 할인액
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}
```

---

> **작성일**: 2026-01-09  
> **상태**: 완료
