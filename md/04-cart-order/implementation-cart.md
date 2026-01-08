# 장바구니 기능 구현 계획

**작성일**: 2026-01-08  
**구현 범위**: 장바구니 CRUD, 동일 상품 1개 제한, Header 뱃지

---

## 개요

- **목적**: 사용자가 상품을 장바구니에 담고 관리할 수 있는 기능 구현
- **범위**: Mock 데이터 기반 프론트엔드 UI + 로컬 상태 관리
- **특이사항**: 중고거래 특성상 동일 상품은 1개만 담을 수 있음

---

## 제약사항

> [!IMPORTANT]
> - 장바구니 기능은 **로컬 상태 (Zustand)** 로만 관리됩니다.
> - 로그인하지 않아도 장바구니 사용 가능
> - 페이지 새로고침 시 장바구니가 초기화됩니다

---

## 파일 구조

### 새로 생성

```
src/
├── types/
│   └── cart.ts                      # 장바구니 타입 정의
├── stores/
│   └── useCartStore.ts              # Zustand 장바구니 Store
├── components/features/cart/
│   ├── CartItem.tsx                 # 개별 상품 카드
│   ├── CartList.tsx                 # 상품 목록 래퍼
│   ├── CartSummary.tsx              # 주문 요약 패널
│   └── QuantityControl.tsx          # 수량 조절 (미사용)
└── pages/
    └── CartPage.tsx                 # 장바구니 페이지
```

### 수정된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/App.tsx` | `/cart` 라우트 추가 |
| `src/components/layout/Header.tsx` | 장바구니 아이콘 링크 + 수량 뱃지 |
| `src/pages/ProductDetailPage.tsx` | 장바구니 담기 Store 연동 |

---

## 핵심 기능

### 1. 동일 상품 1개 제한
```typescript
addItem: (product: Product) => {
  const exists = state.items.some((item) => item.productId === product.id);
  if (exists) return false; // 이미 담긴 상품
  // ... 추가 로직
  return true;
}
```

### 2. 장바구니 Store API

| 함수 | 설명 |
|------|------|
| `addItem(product)` | 상품 추가 (중복 시 false) |
| `removeItem(productId)` | 상품 삭제 |
| `isInCart(productId)` | 담긴 상품인지 확인 |
| `toggleSelect(productId)` | 개별 선택 토글 |
| `selectAll(selected)` | 전체 선택/해제 |
| `removeSelectedItems()` | 선택 상품 삭제 |
| `getCartSummary()` | 가격 요약 계산 |
| `getTotalCount()` | 담긴 상품 수 |

### 3. 반응형 레이아웃

- **데스크톱**: 좌측 상품 목록 + 우측 고정 주문 요약
- **모바일**: 하단 고정 주문 바

---

## 검증 완료 항목

- [x] 상품 상세 페이지에서 장바구니 담기
- [x] 중복 담기 시 안내 메시지
- [x] Header 장바구니 아이콘 수량 뱃지
- [x] 장바구니 페이지 상품 목록 표시
- [x] 선택/해제, 전체 선택
- [x] 상품 삭제, 선택 삭제
- [x] 주문 요약 금액 계산

---

> **상태**: 구현 완료
