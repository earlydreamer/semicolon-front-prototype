# 상품 상세 페이지 구현 계획 (Product Detail Page Implementation Plan)

## 개요
- **목적**: 사용자가 상품의 상세 정보(이미지, 설명, 판매자 정보 등)를 확인하고 구매/채팅 등의 액션을 취할 수 있는 페이지를 구현합니다.
- **주요 기능**: 
    - 상품 상세 정보 표시 (다중 이미지, 설명, 상태 등)
    - 판매자 프로필 및 매너온도 표시
    - 하단 고정 액션바 (모바일 대응) 또는 우측 플로팅 바 (데스크톱)
    - 연관 상품 노출 (Optional)

## User Review Required
> [!IMPORTANT]
> **Mock 데이터 구조 변경**: 상품 상세 페이지 표현을 위해 `Product` 인터페이스에 `description`, `seller`, `images` (다중 이미지) 등의 필드를 추가합니다. 기존 목록 페이지에도 영향이 없도록 하위 호환성을 고려하거나 데이터를 일괄 업데이트하겠습니다.

## Proposed Changes

### 1. Mock Data & Types Update
#### [MODIFY] [products.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/mocks/products.ts)
- `Product` 인터페이스 확장:
    - `description`: 상품 설명 (HTML or Text)
    - `images`: 추가 이미지 배열 (string[])
    - `seller`: 판매자 정보 객체 `{ name, avatar, mannerTemp }`
    - `status`: 상품 상태 (중고, 새상품 등)
    - `counts`: 조회, 찜, 채팅 수 `{ view, like, chat }`
- `MOCK_PRODUCTS` 데이터 업데이트 (상세 데이터 추가)

### 2. UI Components
#### [NEW] [ProductDetailPage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/ProductDetailPage.tsx)
- 레이아웃 구조:
    - **Header**: 기존 헤더 사용
    - **Main Content**:
        - **Left (Mobile Top)**: 이미지 갤러리 (메인 이미지 + 썸네일 리스트)
        - **Right (Mobile Bottom)**: 
            - 카테고리/Breadcrumb
            - 상품 제목, 가격, 시간, 조회수
            - 상품 상태, 교환 여부 등 메타 정보
            - 상품 설명
            - 태그 (Optional)
            - 판매자 프로필 카드
        - **Bottom Fixed (Mobile)**: 찜하기, 채팅하기, 안전결제 버튼 바
    - **Related Products**: 같은 카테고리 상품 추천 (기존 ProductList 컴포넌트 재사용)

### 3. Routing
#### [MODIFY] [App.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/App.tsx)
- `/products/:productId` 라우트 추가
- `ProductDetailPage` Lazy Loading 적용

## Verification Plan

### Automated Tests
- 현재 테스트 환경이 구축되지 않았으므로 생략.

### Manual Verification
1. **라우팅 확인**: `/products/1` 등 URL 직접 접근 시 해당 상품 정보 표시 확인.
2. **데이터 표시**: 
    - 제목, 가격, 이미지가 Mock 데이터와 일치하는지 확인.
    - 다중 이미지가 있는 경우 갤러리 동작 확인.
3. **반응형 확인**:
    - 모바일(sm): 이미지 상단, 설명 하단, 하단 고정 액션바 확인.
    - 데스크톱(lg): 2단 컬럼 레이아웃, 우측 정보 영역 고정(Sticky) 확인.
4. **목록 연동**: 카테고리 목록에서 상품 클릭 시 상세 페이지로 이동 확인.
