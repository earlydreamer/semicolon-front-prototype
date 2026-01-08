# 상품 상세 페이지 리팩토링 및 댓글 기능 구현 계획

## 개요
- **목적**: 사용자 피드백(매너온도 제거, 댓글 기능 추가, ERD 기반 구조 변경) 반영 및 기능 고도화.
- **주요 변경사항**:
    1. **매너온도 제거 & 신뢰도 UI 변경**: '매너온도' 삭제 -> 별점 형태의 신뢰도/안전 점수 UI로 대체 (번개장터 레퍼런스).
    2. **댓글 시스템 추가**: 상품 문의를 위한 댓글 및 대댓글(답글) 기능 구현.
    3. **ERD 기반 타입 동기화**: `Product` 타입의 상태값을 ERD(`sale_status`, `condition_status`)와 일치시킴.

## User Review Required
> [!IMPORTANT]
> **신뢰도 지표**: ERD에 명시적인 '별점' 필드는 없으나, 사용자가 "별점에 가까운 형식"을 요청했습니다. Mock 데이터에 `rating` (0~5) 필드를 임의로 추가하여 UI를 구성하겠습니다. 추후 백엔드 구현 시 `reviews` 테이블 집계 등으로 대체될 수 있습니다.

## Proposed Changes

### 1. Mock Data & Types Update
#### [MODIFY] [products.ts](file:///d:/Projects/Programmers/Semi-Project/frontend/src/mocks/products.ts)
- `Product` 인터페이스 수정:
    - `seller`: `mannerTemp` 삭제 -> `rating` (number, 0-5), `salesCount`, `activeProductCount` 추가.
    - `status` -> `saleStatus` ('ON_SALE', 'RESERVED', 'SOLD_OUT'), `conditionStatus` ('SEALED', 'NO_WEAR', ...) 추가.
- `ProductComment` 인터페이스 및 Mock 데이터 추가:
    - `id`, `userId`, `content`, `createdAt`, `parentId` (대댓글용), `user` (작성자 정보).

### 2. UI Components
#### [MODIFY] [ProductDetailPage.tsx](file:///d:/Projects/Programmers/Semi-Project/frontend/src/pages/ProductDetailPage.tsx)
- **Seller Profile**: 매너온도 바 제거 -> 별점(Star Icon) 및 평점 표시. "상품 n개 | 판매 n회" 정보 추가.
- **Comment Section** (New):
    - 하단에 댓글 리스트 영역 추가.
    - 대댓글(답글) 계층형 렌더링.
    - 판매자 본인이면 '답글 달기' 버튼 활성화 (Mocking).
- **Product Info**: `status` 표시 로직을 `conditionStatus` 기반으로 변경.

## Verification Plan

### Manual Verification
1. **신뢰도 표시**: 판매자 프로필에 별점과 판매 횟수가 정상적으로 표시되는지 확인.
2. **댓글 동작**:
    - 댓글 목록이 계층(댓글-대댓글) 구조로 렌더링되는지 확인.
    - (UI Only) 댓글 입력 창 및 답글 버튼 클릭 시 동작 확인.
3. **데이터 정합성**: 변경된 Status Enum에 따라 '새상품', '중고' 등의 라벨이 올바르게 표시되는지 확인.
