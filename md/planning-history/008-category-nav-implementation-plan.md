# 카테고리 네비게이션 구현 계획

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

**목표**: 번개장터의 데스크탑 메뉴 구성을 참조하여, 헤더에서 접근 가능한 전체 카테고리 네비게이션을 구현합니다.

## User Review Required
> [!NOTE]
> - **UX**: 데스크탑에서는 헤더의 '메뉴(햄버거)' 아이콘 클릭 시 드롭다운 형태의 카테고리 메뉴가 표시됩니다.
> - **모바일**: 기존 모바일 메뉴 버튼을 활용하되, 카테고리 탭을 추가하여 통합합니다.
> - **데이터**: 백엔드 API가 없으므로 5대 핵심 카테고리(캠핑, 악기 등)를 포함한 Mock 데이터를 사용합니다.

## Proposed Changes

### Mocks (`src/mocks`)
#### [NEW] [src/mocks/categories.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/mocks/categories.ts)
- 카테고리 트리 데이터 (대분류 > 중분류 > 소분류)
- 핵심 타깃: 캠핑, 악기, 카메라, 공연/티켓, 앨범/굿즈

### Components (`src/components/features/category`)
#### [NEW] [src/components/features/category/CategoryNav.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/features/category/CategoryNav.tsx)
- 헤더 하단 또는 오버레이로 뜨는 카테고리 네비게이션 컴포넌트
- 마우스 호버 또는 클릭 시 하위 카테고리 노출

### Layout (`src/components/layout`)
#### [MODIFY] [src/components/layout/Header.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/components/layout/Header.tsx)
- 데스크탑: 로고 옆 '카테고리' 메뉴 버튼 추가
- 모바일: 모바일 드로어 내 카테고리 메뉴 연동

## Verification Plan
### Manual Verification
- **Desktop**: 헤더의 카테고리 버튼 클릭 시 메뉴가 정상적으로 열리고 닫히는지 확인.
- **Interaction**: 카테고리 항목 호버/클릭 시 하위 분류가 잘 보이는지 확인.
- **Mobile**: 모바일 메뉴에서 카테고리 목록이 정상적으로 표시되는지 확인.
