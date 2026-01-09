# 검색 기능

## 개요
- **목적**: 전체 상품 검색 및 필터링 기능
- **관련 페이지**: 헤더 검색바, 검색 결과 페이지

## 구현 체크리스트

### 컴포넌트
- [ ] SearchPage.tsx (검색 결과 페이지)
- [ ] SearchFilters.tsx (필터 UI)
- [ ] SearchResults.tsx (결과 목록)

### 기능
- [ ] 헤더 검색창 기능 연결
- [ ] 키워드 검색
- [ ] 필터링 (카테고리, 가격대, 상태)
- [ ] 정렬 (최신순, 가격순)

### 라우팅
- [ ] `/search` 라우트 추가
- [ ] `/search?q=검색어&category=xxx` 쿼리 파라미터

## 컴포넌트 구조

```
pages/
└── SearchPage.tsx

components/features/search/
├── SearchFilters.tsx    # 필터 사이드바
└── SearchResults.tsx    # 결과 그리드
```

## 주의사항
- 검색어 디바운싱 적용
- URL 쿼리 파라미터로 상태 관리 (공유 가능)
- 검색어 하이라이트 표시

---

> **작성일**: 2026-01-09  
> **상태**: 대기
