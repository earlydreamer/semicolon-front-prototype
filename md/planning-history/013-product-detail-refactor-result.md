# 상품 상세 페이지 리팩토링 결과 (Refactoring Results)

**작성일**: 2026-01-08  
**구현 범위**: ERD 기반 데이터 구조 반영 및 신뢰도/댓글 UI 추가

## 📸 주요 변경 사항

### 1. Mock 데이터 & 타입 (ERD 기반)
- **Status Enum 적용**: 
  - `conditionStatus`: `SEALED` (미개봉), `NO_WEAR` (사용감 없음) 등
  - `saleStatus`: `ON_SALE`, `SOLD_OUT` 등
- **필드 명칭 변경**: `timeAgo` -> `createdAt` (유틸함수로 변환), `counts` -> `viewCount`, `likeCount` 등 평탄화.

### 2. 상세 페이지 UI (`ProductDetailPage`)
#### A. 판매자 신뢰도 (Safety Score)
- **기존**: 매너온도 (온도계) 표시
- **변경**: **별점(Rating)** 및 평점 (예: 4.5 / 5.0) 표시. 
- **추가 정보**: 판매자의 '상품 수', '판매 횟수'를 함께 표시하여 신뢰도 판단 보조.

#### B. 댓글/문의 시스템 (Comments)
- **구조**: `ProductComment` 테이블 구조를 반영하여 계층형(댓글-대댓글) 렌더링 구현.
- **UI**: 
  - 하단에 댓글 리스트 및 입력창 배치.
  - 판매자 본인이 작성한 대댓글은 '판매자' 뱃지로 구분.
  - 작성 시간은 `방금 전`, `n시간 전` 등으로 동적 표시.

#### C. 상품 상태 뱃지
- **상단**: `미개봉`, `사용감 없음` 등의 상태 뱃지를 상품 제목 위에 표시.

## 🧪 테스트 방법
1. **서버 실행**: `npm run dev`
2. **접속**: 
   - [http://localhost:5173/products/1](http://localhost:5173/products/1): 댓글 2개(대댓글 포함)가 있는 아이폰 상품 확인.
   - [http://localhost:5173/products/5](http://localhost:5173/products/5): 5.0 만점의 판매자 프로필 확인.

## ⚠️ 특이사항
- 댓글 입력은 UI만 구현되어 있으며, 실제 데이터 저장은 되지 않습니다 (새로고침 시 초기화).
