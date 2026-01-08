# 관리자 페이지

## 개요
- **목적**: 플랫폼 운영을 위한 관리자 기능
- **접근**: 서브도메인 (admin.example.com)
- **관련 페이지**: 관리자 대시보드, 각종 관리 페이지

## 기능 요구사항

### 대시보드
- [ ] 주요 지표 요약
  - 일일 거래액
  - 신규 가입자
  - 활성 상품 수
  - 미처리 신고 건수
- [ ] 그래프/차트 시각화

### 신고 관리
- [ ] 신고 목록 조회
- [ ] 신고 상세
- [ ] 신고 처리 (승인/반려)
- [ ] 필터 (미처리/처리완료)

### 상품 관리
- [ ] 상품 목록 조회
- [ ] 상품 검색
- [ ] 상품 상세 조회
- [ ] 상품 판매 중지
- [ ] 상품 삭제

### 회원 관리
- [ ] 회원 목록 조회
- [ ] 회원 검색
- [ ] 회원 상세 조회
- [ ] 회원 정지 (정지/해제)
- [ ] 회원 삭제

### 정산 관리
- [ ] 정산 내역 조회
- [ ] 정산 검색
- [ ] 정산 상세
- [ ] 정산 승인/반려

### 쿠폰 관리 (CRUD)
- [ ] 쿠폰 목록
- [ ] 쿠폰 생성
  - 쿠폰명
  - 할인 타입 (정액/정률)
  - 할인 금액/비율
  - 최소 주문 금액
  - 유효 기간
  - 발급 수량
- [ ] 쿠폰 수정
- [ ] 쿠폰 삭제
- [ ] 쿠폰 사용 현황

### 카테고리 관리 (CRUD)
- [ ] 카테고리 목록 (트리)
- [ ] 카테고리 생성
- [ ] 카테고리 수정
- [ ] 카테고리 삭제
- [ ] 카테고리 순서 변경

## 컴포넌트 구조

```
components/features/admin/
├── AdminHeader.tsx
├── AdminSidebar.tsx
├── Dashboard.tsx
├── StatsCard.tsx
├── ChartWidget.tsx
│
├── ReportList.tsx
├── ReportCard.tsx
├── ReportDetail.tsx
│
├── AdminProductList.tsx
├── AdminProductCard.tsx
│
├── AdminUserList.tsx
├── AdminUserCard.tsx
├── UserStatusBadge.tsx
│
├── AdminSettlementList.tsx
├── AdminSettlementCard.tsx
│
├── CouponList.tsx
├── CouponForm.tsx
├── CouponCard.tsx
│
├── CategoryTree.tsx
├── CategoryForm.tsx
└── CategoryDraggable.tsx

pages/admin/
├── AdminDashboardPage.tsx
├── ReportManagePage.tsx
├── ProductManagePage.tsx
├── UserManagePage.tsx
├── SettlementManagePage.tsx
├── CouponManagePage.tsx
└── CategoryManagePage.tsx
```

## API 연동 (예상)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/admin/dashboard | 대시보드 통계 |
| GET | /api/admin/reports | 신고 목록 |
| PUT | /api/admin/reports/{id} | 신고 처리 |
| GET | /api/admin/products | 상품 목록 |
| PUT | /api/admin/products/{id}/suspend | 상품 정지 |
| DELETE | /api/admin/products/{id} | 상품 삭제 |
| GET | /api/admin/users | 회원 목록 |
| PUT | /api/admin/users/{id}/suspend | 회원 정지 |
| DELETE | /api/admin/users/{id} | 회원 삭제 |
| GET | /api/admin/settlements | 정산 목록 |
| PUT | /api/admin/settlements/{id}/approve | 정산 승인 |
| GET | /api/admin/coupons | 쿠폰 목록 |
| POST | /api/admin/coupons | 쿠폰 생성 |
| PUT | /api/admin/coupons/{id} | 쿠폰 수정 |
| DELETE | /api/admin/coupons/{id} | 쿠폰 삭제 |
| GET | /api/admin/categories | 카테고리 목록 |
| POST | /api/admin/categories | 카테고리 생성 |
| PUT | /api/admin/categories/{id} | 카테고리 수정 |
| DELETE | /api/admin/categories/{id} | 카테고리 삭제 |

## 권한 관리
- 관리자 전용 라우팅
- 관리자 토큰 검증
- 역할 기반 접근 제어 (RBAC)

## 주의사항
- 관리자 액션 로깅 (ELK)
- 민감 데이터 접근 기록
- 2단계 인증 권장
- 중요 작업 확인 모달

---

> **작성일**: 2026-01-08  
> **상태**: 대기
