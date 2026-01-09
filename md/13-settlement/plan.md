# 정산 관리 (Admin)

## 개요
- **목적**: 판매 대금 정산 내역 조회 및 관리
- **관련 페이지**: 관리자 정산관리 페이지

## 구현 체크리스트

### 컴포넌트
- [ ] AdminSettlementList.tsx (정산 내역 테이블)
- [ ] SettlementDetailModal.tsx (정산 상세 모달)

### 페이지
- [ ] SettlementManagePage.tsx (정산 관리 페이지)

### 기능
- [ ] 정산 내역 조회
- [ ] 정산 상태 필터 (대기/완료)
- [ ] 정산 상세 보기
- [ ] 정산 승인/반려

### 라우팅
- [ ] `/admin/settlements` 라우트 추가
- [ ] AdminSidebar 메뉴 추가

## 컴포넌트 구조

```
pages/admin/
└── SettlementManagePage.tsx

components/features/admin/
├── AdminSettlementList.tsx
└── SettlementDetailModal.tsx
```

## Mock 데이터 구조

```typescript
type SettlementStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

interface Settlement {
  id: string;
  sellerId: string;
  seller: {
    nickname: string;
  };
  orderId: string;
  amount: number;        // 정산 금액
  fee: number;           // 수수료
  netAmount: number;     // 실수령액
  status: SettlementStatus;
  requestedAt: string;
  processedAt?: string;
}
```

---

> **작성일**: 2026-01-09  
> **상태**: 대기
