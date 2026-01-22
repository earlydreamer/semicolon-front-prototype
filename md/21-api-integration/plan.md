# API 연동 계획서

## 1. 개요
프론트엔드 목업 상태에서 백엔드 실데이터 연동으로 전환합니다. Swagger 문서를 기반으로 API를 연결하며, MVP 범위 내에서 구현된 백엔드 기능을 우선적으로 적용합니다.

## 2. 연동 대상 분석

### 2.1. 연동 가능 (백엔드 구현 완료)
| 기능 | 엔드포인트 | 비고 |
|------|-----------|------|
| 로그인 | `POST /api/v1/auth/login` | |
| 회원가입 | `POST /api/v1/users/register` | |
| 내 정보 조회 | `GET /api/v1/users/me` | |
| 카테고리 목록 | `GET /api/v1/categories` | 신규 연동 예정 |
| 추천 상품 목록 | `GET /api/v1/products/featured` | 신규 연동 예정 |
| 상품 목록 조회 | `GET /api/v1/products` | 신규 연동 예정 |
| 상품 상세 조회 | `GET /api/v1/products/{productUuid}` | 신규 연동 예정 |
| 상품 찜하기/취소 | `POST/DELETE /api/v1/products/{productUuid}/likes` | 신규 연동 예정 |
| 내 찜 목록 | `GET /api/v1/me/likes` | 신규 연동 예정 |
| 예치금 잔액 | `GET /api/v1/deposits/me/balance` | 신규 연동 예정 |
| 예치금 내역 | `GET /api/v1/deposits/me/histories` | 신규 연동 예정 |
| 장바구니 목록 | `GET /api/v1/carts/me` | |
| 장바구니 추가 | `POST /api/v1/carts/{productUuid}` | |
| 주문 생성 | `POST /api/v1/orders` | |
| 내 주문 목록 | `GET /api/v1/orders/me` | 신규 연동 예정 |

### 2.2. 연동 보류 (백엔드 미구현 또는 MVP 제외)
- 리뷰(Reviews): 백엔드 미구현.
- 검색(Search): 백엔드 미구현 (상품 목록 조회의 필터로 대체 가능 여부 확인 필요).
- 판매자 전용 기능: 어드민 정산 외 일반 판매자 기능은 백엔드 확인 필요.

## 3. 구현 단계별 계획

### Step 4: 상품 및 카테고리 연동
- [ ] `ProductService` 구현 및 `ProductController` 엔드포인트 연결
- [ ] 홈 화면 추천 상품, 카테고리 목록 실데이터 교체
- [ ] 상품 상세 페이지 실데이터 연동

### Step 5: 찜(Like) 및 예치금(Deposit) 연동
- [ ] `LikeService` 구현 및 상품 상세 찜하기 연동
- [ ] 마이페이지 찜 목록 연동
- [ ] `DepositService` 구현 및 마이페이지/주문서 예치금 정보 연동

### Step 6: 주문 목록 연동
- [ ] 마이페이지 주문 내역 조회 실데이터 교체

## 4. 공통 가이드 (AGENTS.md 준수)
- 모든 API 호출은 `src/utils/api.ts` 인스턴스 사용
- 엔드포인트는 `src/constants/apiEndpoints.ts` 관리
- 에러 처리는 공통 인터셉터 또는 각 서비스 레벨에서 수행
- 구현 결과는 `frontend/md/21-api-integration/implementation.md`에 기록
