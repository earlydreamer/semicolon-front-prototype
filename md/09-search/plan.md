# 검색 기능

## 개요
- **목적**: 전체 상품 검색 및 필터링 기능
- **관련 페이지**: 헤더 검색바, 검색 결과 페이지

## 구현 체크리스트

### 컴포넌트
- [x] SearchPage.tsx (검색 결과 페이지)
- [x] SearchFilters.tsx (필터 UI - CategorySidebar 사용 및 통합 구현)
- [x] SearchResults.tsx (결과 목록 - ProductList 사용)

### 기능
- [x] 헤더 검색창 기능 연결
- [x] 키워드 검색
- [x] 필터링 (카테고리, 가격대, 상태)
- [x] 정렬 (최신순, 가격순)

### 라우팅
- [x] `/search` 라우트 추가
- [x] `/search?q=검색어&category=xxx` 쿼리 파라미터

## 컴포넌트 구조

```
pages/
└── SearchPage.tsx

components/features/search/
└── (기존의 ProductList, CategorySidebar 재사용)
```

## 주의사항
- 검색어 디바운싱 적용 (추후 고도화)
- URL 쿼리 파라미터로 상태 관리 (공유 가능)
- 검색어 하이라이트 표시 (추후 고도화)

---

> **작성일**: 2026-01-09  
> **상태**: 완료
