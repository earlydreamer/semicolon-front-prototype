# 신고 관리 (Admin)

## 개요
- **목적**: 부적절한 상품/사용자 신고 관리
- **관련 페이지**: 관리자 신고관리 페이지

## 구현 체크리스트

### 컴포넌트
- [ ] AdminReportList.tsx (신고 목록 테이블)
- [ ] ReportDetailModal.tsx (신고 상세 모달)

### 페이지
- [ ] ReportManagePage.tsx (신고 관리 페이지)

### 기능
- [ ] 신고 목록 조회
- [ ] 상태 필터 (미처리/처리완료)
- [ ] 신고 상세 보기
- [ ] 신고 처리 (승인/반려)

### 라우팅
- [ ] `/admin/reports` 라우트 추가
- [ ] AdminSidebar 메뉴 추가

## 컴포넌트 구조

```
pages/admin/
└── ReportManagePage.tsx

components/features/admin/
├── AdminReportList.tsx
└── ReportDetailModal.tsx
```

## Mock 데이터 구조

```typescript
interface Report {
  id: string;
  type: 'PRODUCT' | 'USER';
  targetId: string;
  reason: string;
  description: string;
  reporterId: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}
```

---

> **작성일**: 2026-01-09  
> **상태**: 대기
