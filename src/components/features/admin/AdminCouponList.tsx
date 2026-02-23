import Plus from 'lucide-react/dist/esm/icons/plus';
import Gift from 'lucide-react/dist/esm/icons/gift';

import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { CouponFormPanel } from '@/components/features/admin/CouponFormPanel';
import { CouponTable } from '@/components/features/admin/CouponTable';
import { useAdminCoupons } from '@/hooks/admin/useAdminCoupons';
import type { CouponStatus } from '@/types/coupon';

export function AdminCouponList() {
  const {
    coupons,
    showForm,
    editingCoupon,
    formData,
    isSubmitting,
    statusFilter,
    isLoading,
    setShowForm,
    setFormData,
    setStatusFilter,
    resetForm,
    handleEdit,
    handleSubmit,
    handleActivate,
  } = useAdminCoupons();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 animate-in fade-in slide-in-from-top-1">
        비활성화/삭제 기능은 백엔드 미지원으로 준비중입니다.
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">쿠폰 목록</h2>
        <Button onClick={() => setShowForm(true)} disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
          쿠폰 추가
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="admin-coupon-status-filter" className="text-sm font-medium text-neutral-600">
          상태 필터
        </label>
        <select
          id="admin-coupon-status-filter"
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CouponStatus | 'all')}
        >
          <option value="all">전체 쿠폰</option>
          <option value="DRAFT">초안(DRAFT)</option>
          <option value="ACTIVE">활성(ACTIVE)</option>
          <option value="INACTIVE">비활성(INACTIVE)</option>
          <option value="EXPIRED">만료(EXPIRED)</option>
        </select>
      </div>

      {showForm ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <CouponFormPanel
            isEditing={!!editingCoupon}
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>
      ) : null}

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-neutral-500" role="status" aria-live="polite">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent mb-2" />
            <p>쿠폰 목록을 불러오는 중입니다...</p>
          </div>
        ) : coupons.length > 0 ? (
          <CouponTable
            coupons={coupons}
            onEdit={handleEdit}
            onActivate={handleActivate}
          />
        ) : (
          <EmptyState icon={Gift} description="등록된 쿠폰이 없습니다." />
        )}
      </div>
    </div>
  );
}
