# 리뷰 시스템

## 개요
- **목적**: 구매자가 거래 완료 후 판매자/상품 리뷰 작성
- **관련 페이지**: 주문 상세, 상점 페이지

## 구현 체크리스트

### 컴포넌트
### 컴포넌트
- [x] ReviewForm.tsx (StarRating, ReviewList와 함께 구현)
- [x] ReviewList.tsx (리뷰 목록)
- [x] ReviewCard.tsx (개별 리뷰 카드 - ReviewList에서 사용)
- [x] StarRating.tsx (별점 입력/표시)

### 기능
- [x] 리뷰 작성 (별점 + 내용)
- [x] 리뷰 목록 조회
- [x] 상점 리뷰 탭 추가

### 페이지 수정
- [x] ShopPage.tsx 리뷰 탭 추가
- [x] OrderHistoryPage.tsx 리뷰 작성 버튼 (목록 내 구현 완료)

## 컴포넌트 구조

```
components/features/review/
├── ReviewList.tsx     # 리뷰 목록
├── ReviewCard.tsx     # 개별 리뷰
└── StarRating.tsx     # 별점 컴포넌트
```

## Mock 데이터 구조

```typescript
interface Review {
  id: string;
  rating: number;
  content: string;
  buyer: {
    nickname: string;
    avatar?: string;
  };
  productTitle: string;
  createdAt: string;
}
```

## 주의사항
- 구매확정 후에만 리뷰 작성 가능
- 한 주문당 1회만 리뷰 작성

---

> **작성일**: 2026-01-09  
> **상태**: 완료
