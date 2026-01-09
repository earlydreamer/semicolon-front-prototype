# 리뷰 시스템

## 개요
- **목적**: 구매자가 거래 완료 후 판매자/상품 리뷰 작성
- **관련 페이지**: 주문 상세, 상점 페이지

## 구현 체크리스트

### 컴포넌트
- [ ] ReviewForm.tsx (리뷰 작성 폼)
- [ ] ReviewList.tsx (리뷰 목록)
- [ ] ReviewCard.tsx (개별 리뷰 카드)
- [ ] StarRating.tsx (별점 입력/표시)

### 기능
- [ ] 리뷰 작성 (별점 + 내용)
- [ ] 리뷰 목록 조회
- [ ] 상점 리뷰 탭 추가

### 페이지 수정
- [ ] ShopPage.tsx 리뷰 탭 추가
- [ ] OrderHistoryPage.tsx 리뷰 작성 버튼

## 컴포넌트 구조

```
components/features/review/
├── ReviewForm.tsx     # 리뷰 작성 폼
├── ReviewList.tsx     # 리뷰 목록
├── ReviewCard.tsx     # 개별 리뷰
└── StarRating.tsx     # 별점 컴포넌트
```

## Mock 데이터 구조

```typescript
interface Review {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  buyer: {
    nickname: string;
    avatar?: string;
  };
  rating: number;  // 1-5
  content: string;
  createdAt: string;
}
```

## 주의사항
- 구매확정 후에만 리뷰 작성 가능
- 한 주문당 1회만 리뷰 작성

---

> **작성일**: 2026-01-09  
> **상태**: 대기
