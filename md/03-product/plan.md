# 상품 기능

## 개요
- **목적**: 상품 탐색, 검색, 상세 조회 기능 구현
- **담당자**: 오세인
- **관련 페이지**: 메인, 카테고리 목록, 상품 상세

## 기능 요구사항

### 메인 페이지
- [/] 최신 상품 목록
- [/] 인기 상품 목록
- [ ] 즐겨찾기 상품 목록
- [ ] 카테고리 트리 네비게이션

### 카테고리별 상품 목록
- [ ] 카테고리 필터링
- [ ] 정렬 (최신순/인기순/저가순/고가순)
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 상품 카드 표시 항목
  - 사진 / 제목 / 등록시간
  - 가격 / 좋아요 / 댓글수 / 판매상태

### 상품 검색
- [ ] 키워드 검색 (Elasticsearch)
- [ ] 자동완성
- [ ] 검색 필터 (가격대, 상태, 배송비 등)
- [ ] 검색 결과 정렬

### 상품 상세
- [ ] 상품 정보
  - 사진 갤러리 (슬라이드)
  - 제목 / 가격 / 상세설명
  - 상품 상태 (사용감 없음, 잔기스 등)
  - 배송비 / 조회수
- [ ] 판매자 정보 미니 프로필
- [ ] 좋아요 기능
- [ ] 댓글/문의 기능

### 상품 인터랙션
- [ ] 좋아요 추가/취소
- [ ] 장바구니 추가
- [ ] 바로 구매

## 컴포넌트 구조

```
components/features/product/
├── ProductCard.tsx
├── ProductGrid.tsx
├── ProductSlider.tsx
├── ProductGallery.tsx
├── ProductInfo.tsx
├── ProductStatus.tsx
├── CategoryTree.tsx
├── CategoryNav.tsx
├── SearchBar.tsx
├── SearchFilters.tsx
├── SortDropdown.tsx
└── SellerMiniProfile.tsx

pages/
├── HomePage.tsx
├── CategoryPage.tsx
├── ProductDetailPage.tsx
└── SearchResultPage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/products | 상품 목록 |
| GET | /api/products/{id} | 상품 상세 |
| GET | /api/products/latest | 최신 상품 |
| GET | /api/products/popular | 인기 상품 |
| GET | /api/products/favorites | 즐겨찾기 상품 |
| GET | /api/categories | 카테고리 목록 |
| GET | /api/categories/{id}/products | 카테고리별 상품 |
| GET | /api/search | 상품 검색 |
| POST | /api/products/{id}/like | 좋아요 |
| DELETE | /api/products/{id}/like | 좋아요 취소 |

## 핵심 타깃 카테고리
1. 캠핑 장비
2. 악기
3. 카메라
4. 공연·티켓
5. 앨범·굿즈

## 주의사항
- 이미지 최적화 (WebP, lazy loading)
- Elasticsearch 연동 시 검색 지연 처리
- 판매 완료 상품 시각적 구분

---

> **작성일**: 2026-01-08  
> **상태**: 대기
