# 장바구니 구현 변경 이력

## 2026-01-08 - 장바구니 기능 구현

### 신규 기능
- **장바구니 페이지** (`/cart`) 구현
- **장바구니 Store** (Zustand) 구현
- **Header 수량 뱃지** 추가

### 변경사항

| 버전 | 날짜 | 내용 |
|------|------|------|
| 1.0.0 | 2026-01-08 | 장바구니 기본 기능 구현 |
| 1.0.1 | 2026-01-08 | 동일 상품 1개 제한 적용 (수량 조절 기능 제거) |

### 상세 변경 내용

#### v1.0.0
- `src/types/cart.ts` - CartItem, CartSummary 타입 정의
- `src/stores/useCartStore.ts` - Zustand 장바구니 Store
- `src/components/features/cart/*` - 장바구니 컴포넌트들
- `src/pages/CartPage.tsx` - 장바구니 페이지

#### v1.0.1
- 중고거래 특성 반영: 동일 상품 1개 제한
- `QuantityControl` 컴포넌트 사용 안 함 (추후 삭제 가능)
- `addItem()` 반환값을 boolean으로 변경 (중복 체크)
- 이미 담긴 상품에 대한 안내 메시지 추가

### 참조 문서
- [구현 상세](./implementation-cart.md)
- [플래닝 히스토리](../planning-history/015-cart-implementation-result.md)

---

> **마지막 업데이트**: 2026-01-08
