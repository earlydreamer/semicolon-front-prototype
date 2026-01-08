# 카테고리별 상품 목록 페이지 구현 계획

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

**목표**: 특정 카테고리를 선택했을 때 해당 카테고리에 주요 상품 목록을 필터링하여 보여주는 페이지를 구현합니다.

## User Review Required
> [!NOTE]
> - **URL**: `/categories/:categoryId` 경로를 사용합니다.
> - **Filtering**: Mock 데이터의 `categoryId` 필드를 기준으로 클라이언트 사이드 필터링을 수행합니다.
> - **UI**: 좌측에는 카테고리 트리(Sidebar), 우측에는 상품 목록 그리드와 상단 정렬/필터 옵션을 배치합니다. (번개장터 스타일)

## Proposed Changes

### Mocks (`src/mocks`)
#### [MODIFY] [src/mocks/products.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/mocks/products.ts)
- `Product` 인터페이스에 `categoryId` 속성 추가 (Optional for now, but will populate for testing).
- 기존 Mock 데이터에 적절한 `categoryId` 할당.

### Pages (`src/pages`)
#### [NEW] [src/pages/CategoryPage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/CategoryPage.tsx)
- 레이아웃: 2컬럼 구조 (사이드바: 카테고리 네비, 메인: 상품 목록)
- 기능: URL 파라미터(`categoryId`)를 읽어 상품 필터링, 정렬 옵션(최신순/저가순 등 - UI만 구현)

### Components (`src/components/features/product`)
#### [NEW] [src/components/features/product/ProductSortDropdown.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/product/ProductSortDropdown.tsx)
- 정렬 옵션 선택 드롭다운 (최신순, 인기순, 저가순, 고가순)

### Routing (`src/App.tsx`)
- `/categories/:categoryId` 라우트 추가 -> `CategoryPage` 컴포넌트 매핑

## Verification Plan
### Manual Verification
1. 헤더 내 카테고리 메뉴에서 '캠핑 > 텐트' 클릭.
2. `/categories/tent` 등으로 이동 확인.
3. 해당 카테고리에 맞는 상품만 리스트에 표시되는지 확인.
4. 카테고리가 없는 경우 '상품이 없습니다' 등의 빈 상태 메시지 확인.
