# 정산 관리 (Admin)

## 개요
- **목적**: 판매 대금 정산 내역 조회 및 관리
- **관련 페이지**: 관리자 정산관리 페이지

## 구현 체크리스트

### 컴포넌트
### 컴포넌트
- [x] AdminSettlementList.tsx (정산 내역 테이블 및 상세 보기 통합)
- [x] SettlementDetailModal.tsx (목록 내 확장 패널로 구현)

### 페이지
- [x] SettlementManagePage.tsx (정산 관리 페이지)

### 기능
- [x] 정산 내역 조회
- [x] 정산 상태 필터 (대기/완료)
- [x] 정산 상세 보기 (Expandable Row)
- [x] 정산 승인/반려

### 라우팅
- [x] `/admin/settlements` 라우트 추가
- [x] AdminSidebar 메뉴 추가

## 컴포넌트 구조

```
pages/admin/
└── SettlementManagePage.tsx

components/features/admin/
└── AdminSettlementList.tsx (상세 보기 통합)
```

## Mock 데이터 구조

```typescript
type SettlementStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

interface Settlement {
  id: string;
  seller: {
    id: string;
    nickname: string;
    bankName: string;
    accountNumber: string;
  };
  orderId: string;
  productTitle: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: SettlementStatus;
  requestedAt: string;
  processedAt?: string;
}
```

---

> **작성일**: 2026-01-09  
> **상태**: 완료
