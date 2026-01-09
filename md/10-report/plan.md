# 신고 관리 (Admin)

## 개요
- **목적**: 부적절한 상품/사용자 신고 관리
- **관련 페이지**: 관리자 신고관리 페이지

## 구현 체크리스트

### 컴포넌트
### 컴포넌트
- [x] AdminReportList.tsx (신고 목록 테이블)
- [x] ReportDetailModal.tsx (목록 내 확장 패널로 구현)

### 페이지
- [x] ReportManagePage.tsx (신고 관리 페이지)

### 기능
- [x] 신고 목록 조회
- [x] 상태 필터 (미처리/처리완료)
- [x] 신고 상세 보기 (Expandable Row)
- [x] 신고 처리 (승인/반려)

### 라우팅
- [x] `/admin/reports` 라우트 추가
- [x] AdminSidebar 메뉴 추가

## 컴포넌트 구조

```
pages/admin/
└── ReportManagePage.tsx

components/features/admin/
└── AdminReportList.tsx (상세 보기 통합)
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
> **상태**: 완료
