# 장바구니 기능 구현 결과

**작성일**: 2026-01-08  
**구현 범위**: 장바구니 CRUD, 수량 1개 제한, Header 뱃지

## 📝 구현 요약

중고거래 플랫폼 특성을 반영하여 **동일 상품은 1개만 담을 수 있는** 장바구니 기능을 구현했습니다.

## 📁 생성된 파일

### 타입 정의
- `src/types/cart.ts`: CartItem, CartSummary 인터페이스

### 상태 관리
- `src/stores/useCartStore.ts`: Zustand 기반 장바구니 Store
  - `addItem()`: 상품 추가 (중복 시 false 반환)
  - `removeItem()`: 상품 삭제
  - `isInCart()`: 장바구니에 담긴 상품인지 확인
  - `toggleSelect()` / `selectAll()`: 선택 관리
  - `getCartSummary()`: 가격 요약 계산

### 컴포넌트
- `src/components/features/cart/CartItem.tsx`: 개별 상품 카드
- `src/components/features/cart/CartList.tsx`: 상품 목록 + 전체 선택
- `src/components/features/cart/CartSummary.tsx`: 주문 요약 + 버튼
- `src/components/features/cart/QuantityControl.tsx`: (미사용, 추후 삭제 가능)

### 페이지
- `src/pages/CartPage.tsx`: 장바구니 페이지

## 🔧 수정된 파일

- `src/App.tsx`: `/cart` 라우트 추가
- `src/components/layout/Header.tsx`: 장바구니 아이콘 링크 + 수량 뱃지
- `src/pages/ProductDetailPage.tsx`: 장바구니 담기 기능 연동

## ✨ 주요 기능

### 1. 동일 상품 1개 제한
- 중고거래 특성상 동일 상품은 1개만 담을 수 있음
- 이미 담긴 상품 클릭 시 "이미 장바구니에 담긴 상품입니다" 안내

### 2. 장바구니 관리
- 상품 선택/해제
- 전체 선택/해제
- 선택 삭제
- 개별 삭제

### 3. Header 장바구니 아이콘
- 장바구니에 담긴 상품 수 뱃지 표시
- 99개 초과 시 "99+" 표시

### 4. 반응형 UI
- 데스크톱: 좌측 상품 목록 + 우측 고정 주문 요약
- 모바일: 하단 고정 주문 바

## 🧪 테스트 방법

1. 상품 상세 페이지 (`/products/1`) 접근
2. "장바구니" 버튼 클릭 → Toast "장바구니에 담았습니다"
3. 다시 클릭 → Toast "이미 장바구니에 담긴 상품입니다"
4. Header 장바구니 아이콘 또는 `/cart` 접근
5. 선택/해제, 삭제 기능 확인

## ⚠️ 주의사항

- 페이지 새로고침 시 장바구니 데이터가 초기화됨 (로컬 스토리지 persistence 미적용)
- 주문하기 기능은 아직 준비 중 (Toast로 안내)

---

> **다음 단계**: 주문 프로세스 구현 또는 마이페이지 구현
