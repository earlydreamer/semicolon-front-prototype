/**
 * 관리자 쿠폰 관리 페이지
 */

import { AdminCouponList } from '@/components/features/admin/AdminCouponList';

export default function CouponManagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">쿠폰 관리</h1>
        <p className="text-neutral-500 mt-1">할인 쿠폰을 생성하고 관리합니다.</p>
      </div>
      
      <AdminCouponList />
    </div>
  );
}
