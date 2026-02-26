/**
 * 관리자 신고 관리 페이지
 */

import { AdminReportList } from '@/components/features/admin/AdminReportList';

export default function ReportManagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">신고 관리</h1>
        <p className="text-neutral-500 mt-1">상품 및 사용자 신고를 관리합니다.</p>
      </div>
      
      <AdminReportList />
    </div>
  );
}

