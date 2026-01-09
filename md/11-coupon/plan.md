# 쿠폰 시스템

## 개요
- **목적**: 할인 쿠폰 발급 및 사용 기능
- **관련 페이지**: 관리자 쿠폰관리, 주문 페이지, 마이페이지

## 구현 체크리스트

### 관리자 (Admin)
- [ ] AdminCouponList.tsx (쿠폰 목록)
- [ ] CouponForm.tsx (쿠폰 생성/수정 폼)
- [ ] CouponManagePage.tsx (쿠폰 관리 페이지)
- [ ] `/admin/coupons` 라우트 추가

### 사용자
- [ ] CouponSelector.tsx (주문 시 쿠폰 선택)
- [ ] MyCoupons.tsx (내 쿠폰 목록)
- [ ] OrderPage.tsx 쿠폰 적용 UI 연동

### 기능
- [ ] 쿠폰 생성 (정액/정률 할인)
- [ ] 쿠폰 조건 (최소 주문 금액, 유효 기간)
- [ ] 쿠폰 발급/삭제
- [ ] 주문 시 쿠폰 적용
- [ ] 할인 금액 계산

## 컴포넌트 구조

```
pages/admin/
└── CouponManagePage.tsx

components/features/admin/
├── AdminCouponList.tsx
└── CouponForm.tsx

components/features/order/
└── CouponSelector.tsx

components/features/mypage/
└── MyCoupons.tsx
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
> **상태**: 대기
