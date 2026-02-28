import Gift from 'lucide-react/dist/esm/icons/gift';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import type { CouponResponse, CouponStatus } from '@/types/coupon';


const STATUS_LABELS: Record<CouponStatus, { text: string; color: string }> = {
  DRAFT: { text: '초안', color: 'bg-neutral-100 text-neutral-700' },
  ACTIVE: { text: '활성', color: 'bg-green-100 text-green-800' },
  INACTIVE: { text: '비활성', color: 'bg-amber-100 text-amber-800' },
  EXPIRED: { text: '만료', color: 'bg-red-100 text-red-700' },
};

interface CouponTableProps {
  coupons: CouponResponse[];
  onEdit: (coupon: CouponResponse) => void;
  onActivate: (uuid: string) => void;
  onDeactivate: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export const CouponTable = ({ coupons, onEdit, onActivate, onDeactivate, onDelete }: CouponTableProps) => {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString('ko-KR');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-24">상태</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">쿠폰명</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-32">할인</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-32">조건</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-48">시작일</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 w-28">발급량</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 w-24">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {coupons.map((coupon) => (
            <tr key={coupon.uuid} className="hover:bg-neutral-50 transition-colors">
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[coupon.status].color}`}
                >
                  {STATUS_LABELS[coupon.status].text}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary-500" aria-hidden="true" />
                  <span className="font-medium text-neutral-900 truncate max-w-[200px]">{coupon.couponName}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-neutral-700">
                  <DollarSign className="w-4 h-4" aria-hidden="true" />
                  <span>{formatCurrency(coupon.discountAmount)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600">{formatCurrency(coupon.minimumOrderAmount)} 이상</td>
              <td className="px-4 py-3 text-sm text-neutral-600">{formatDateTime(coupon.validFrom)}</td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                {coupon.issuedQuantity}/{coupon.totalQuantity}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(coupon)}
                    disabled={coupon.status !== 'DRAFT'}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-40 transition-colors"
                    title={coupon.status === 'DRAFT' ? '수정' : '초안 상태에서만 수정 가능'}
                    aria-label={`${coupon.couponName} 수정`}
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onActivate(coupon.uuid)}
                    disabled={coupon.status !== 'DRAFT'}
                    className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-40 transition-colors"
                    title={coupon.status === 'DRAFT' ? '활성화' : '초안 상태에서만 활성화 가능'}
                    aria-label={`${coupon.couponName} 활성화`}
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeactivate(coupon.uuid)}
                    disabled={coupon.status !== 'ACTIVE'}
                    className="p-1.5 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded disabled:opacity-40 transition-colors"
                    title={coupon.status === 'ACTIVE' ? '비활성화' : '활성 상태에서만 비활성화 가능'}
                    aria-label={`${coupon.couponName} 비활성화`}
                  >
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(coupon.uuid)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="삭제"
                    aria-label={`${coupon.couponName} 삭제`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
