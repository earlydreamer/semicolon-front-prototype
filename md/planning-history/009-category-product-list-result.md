# 카테고리별 상품 목록 페이지 구현 결과 (Category Product List Implementation Result)

**날짜**: 2026-01-08  
**작성자**: Semi (AI Agent)

## 개요
URL 파라미터(`/categories/:categoryId`)를 기반으로 상품을 필터링하여 보여주는 카테고리별 상품 목록 페이지를 구현했습니다.

## 주요 구현 사항

### 1. Mock 데이터 업데이트 (`products.ts`)
- **Category ID**: `Product` 인터페이스에 `categoryId` 필드 추가.
- **Data Mapping**: 각 Mock 상품에 `smartphone`, `tent`, `guitar-elec` 등의 카테고리 ID 할당.

### 2. 정렬 드롭다운 컴포넌트 (`ProductSortDropdown.tsx`)
- **기능**: 최신순, 인기순, 저가순, 고가순 정렬 옵션 제공.
- **UI**: 루시드 아이콘(`ChevronDown`)을 활용한 심플한 드롭다운.

### 3. 카테고리 페이지 (`CategoryPage.tsx`)
- **레이아웃**:
    - **Sidebar**: `CategorySidebar` 컴포넌트 적용. 계층형(Accordion) 구조로 상위/하위 카테고리 탐색 가능.
    - **Main Area**: 상단 툴바(총 개수, 정렬) + 상품 그리드(`ProductList`) 배치.
- **로직**:
    - `useParams`로 `categoryId` 추출.
    - **재귀적 필터링**: 선택된 카테고리뿐만 아니라 그 하위 카테고리에 속한 모든 상품을 포함하도록 필터링 로직 개선 (BFS 탐색).
    - **브레드크럼**: `홈 > 상위 > 하위 > 현재` 순서의 전체 경로 표시 로직 구현 (재귀적 경로 탐색).

### 4. 라우팅 (`App.tsx`)
- `/categories/:categoryId` 경로에 `CategoryPage` 컴포넌트 연결 (`lazy` loading 적용).
- `DesignSystemPage` 코드를 별도 파일로 분리하여 `App.tsx` 구조 개선.

## 결과 화면
- [x] **계층형 탐색**: 사이드바에서 상위 카테고리를 펼쳐 하위 카테고리로 이동 가능.
- [x] **재귀적 필터링**: '캠핑/레저' 선택 시 하위의 '텐트', '가구' 관련 상품이 모두 노출됨.
- [x] **브레드크럼**: 현재 위치한 카테고리의 전체 경로가 상단에 표시됨.
- [x] **정렬 동작**: 저가순/고가순 및 최신순 정렬 동작 확인.

## 트러블슈팅
### 1. App.tsx 구문 오류 및 Lazy Loading 이슈
- **증상**: 중복된 코드와 `React.lazy` 사용 시 `default export` 누락으로 런타임 에러 발생.
- **해결**:
    - `App.tsx` 내 중복 코드 제거 및 `DesignSystemPage` 분리.
    - 페이지 컴포넌트(`HomePage`, `LoginPage`, `SignupPage`)를 `export function`에서 `export default function`으로 변경하여 `React.lazy` 호환성 확보.
