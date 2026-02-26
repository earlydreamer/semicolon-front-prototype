/**
 * 관리자 정산 관리 페이지
 */

import { AdminSettlementList } from '@/components/features/admin/AdminSettlementList';

export default function SettlementManagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">정산 관리</h1>
        <p className="text-neutral-500 mt-1">판매 대금 정산을 관리합니다.</p>
      </div>
      
      <AdminSettlementList />
    </div>
  );
}

