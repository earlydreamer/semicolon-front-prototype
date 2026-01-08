# 메인 페이지 및 상품 탐색 구현 계획

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

**목표**: 번개장터 레퍼런스를 참고하여 메인 페이지 레이아웃(배너, 상품 리스트)을 구현하고, 우리만의 디자인 시스템을 적용합니다.

## User Review Required
> [!NOTE]
> - **레이아웃**: 번개장터 메인 페이지 참조 (상단 배너 + '오늘의 상품 추천' 그리드).
> - **데이터**: 백엔드 API가 없으므로 Mock 데이터를 사용하여 상품 목록을 렌더링합니다.
> - **카테고리**: 기획서에 명시된 5대 핵심 타깃 카테고리(캠핑, 악기, 카메라 등)를 중심으로 구성합니다.

## Proposed Changes

### Feature Components (`src/components/features`)
#### [NEW] [src/components/features/home/HeroBanner.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/home/HeroBanner.tsx)
- 큰 이미지 배너와 문구, CTA 버튼 포함
- 번개장터 스타일의 깔끔한 홍보 영역

#### [NEW] [src/components/features/product/ProductCard.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/product/ProductCard.tsx)
- **정보**: 썸네일, 제목, 가격(원화 포맷), 등록 시간(N일 전), 안전결제 배지 등
- **인터랙션**: 호버 시 줌 효과 (디자인 시스템 반영)

#### [NEW] [src/components/features/product/ProductList.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/product/ProductList.tsx)
- 상품 카드를 Grid 레이아웃으로 배치 (반응형)

### Pages (`src/pages`)
#### [NEW] [src/pages/HomePage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/HomePage.tsx)
- `HeroBanner` + `ProductList` 조합
- 섹션 타이틀 ("오늘의 상품 추천")

### Mocks (`src/mocks`)
#### [NEW] [src/mocks/products.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/mocks/products.ts)
- 상품 더미 데이터 (이미지, 가격, 제목 등)

### Routing (`src/App.tsx`)
- 루트 경로(`/`)를 `HomePage`로 교체 (`DesignSystemPage`는 별도 경로 `/design`으로 이동 유지)

## Verification Plan
### Manual Verification
- **Visual**: 배너 및 상품 카드 디자인이 레퍼런스(번개장터)와 유사하되 Semicolon 스타일(보라색)이 적용되었는지 확인
- **Responsive**: 모바일/데스크탑에서 그리드 레이아웃 적절성 확인
- **Format**: 가격(콤마), 시간(상대 시간) 표시 확인
