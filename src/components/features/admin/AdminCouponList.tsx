/**
 * 관리자 쿠폰 관리 컴포넌트
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, Gift, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/common/Button';

type DiscountType = 'FIXED' | 'PERCENT';
type CouponStatus = 'ACTIVE' | 'EXPIRED' | 'DISABLED';

interface Coupon {
  id: string;
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageCount: number;
  maxUsage?: number;
  status: CouponStatus;
}

// Mock 데이터
const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coupon_1',
    name: '신규가입 환영 쿠폰',
    code: 'WELCOME2026',
    discountType: 'FIXED',
    discountValue: 5000,
    minOrderAmount: 30000,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageCount: 152,
    maxUsage: 1000,
    status: 'ACTIVE',
  },
  {
    id: 'coupon_2',
    name: '봄맞이 10% 할인',
    code: 'SPRING10',
    discountType: 'PERCENT',
    discountValue: 10,
    minOrderAmount: 50000,
    maxDiscount: 10000,
    validFrom: '2026-03-01',
    validUntil: '2026-03-31',
    usageCount: 0,
    status: 'ACTIVE',
  },
  {
    id: 'coupon_3',
    name: '구정 특가 할인',
    code: 'LUNAR2026',
    discountType: 'FIXED',
    discountValue: 10000,
    minOrderAmount: 100000,
    validFrom: '2026-01-20',
    validUntil: '2026-02-05',
    usageCount: 89,
    status: 'EXPIRED',
  },
];

const STATUS_LABELS: Record<CouponStatus, { text: string; color: string }> = {
  ACTIVE: { text: '활성', color: 'bg-green-100 text-green-800' },
  EXPIRED: { text: '만료', color: 'bg-neutral-100 text-neutral-600' },
  DISABLED: { text: '비활성', color: 'bg-red-100 text-red-800' },
};

import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';

// ... existing imports ...

export function AdminCouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { showToast } = useToast();

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discountType: 'FIXED' as DiscountType,
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    validFrom: '',
    validUntil: '',
    maxUsage: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      discountType: 'FIXED',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      validFrom: '',
      validUntil: '',
      maxUsage: 0,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      name: coupon.name,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || 0,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      maxUsage: coupon.maxUsage || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCoupon) {
      // 수정
      setCoupons(prev =>
        prev.map(c =>
          c.id === editingCoupon.id
            ? {
                ...c,
                ...formData,
                maxDiscount: formData.maxDiscount || undefined,
                maxUsage: formData.maxUsage || undefined,
              }
            : c
        )
      );
      showToast('쿠폰이 수정되었습니다.', 'success');
    } else {
      // 생성
      const newCoupon: Coupon = {
        id: `coupon_${Date.now()}`,
        ...formData,
        maxDiscount: formData.maxDiscount || undefined,
        maxUsage: formData.maxUsage || undefined,
        usageCount: 0,
        status: 'ACTIVE',
      };
      setCoupons(prev => [newCoupon, ...prev]);
      showToast('새 쿠폰이 생성되었습니다.', 'success');
    }
    
    resetForm();
  };

  const handleDelete = (couponId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      showToast('쿠폰이 삭제되었습니다.', 'success');
    }
  };

  const handleToggleStatus = (couponId: string) => {
    setCoupons(prev =>
      prev.map(c =>
        c.id === couponId
          ? { ...c, status: c.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }
          : c
      )
    );
     // Note: 토글 메시지는 너무 빈번할 수 있어 생략하거나 짧게 추가
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">쿠폰 목록</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          쿠폰 추가
        </Button>
      </div>

      {/* 쿠폰 생성/수정 폼 */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCoupon ? '쿠폰 수정' : '새 쿠폰 생성'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">쿠폰명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">쿠폰 코드</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">할인 타입</label>
                <select
                  value={formData.discountType}
                  onChange={e => setFormData(prev => ({ ...prev, discountType: e.target.value as DiscountType }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="FIXED">정액 할인</option>
                  <option value="PERCENT">정률 할인 (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  할인 {formData.discountType === 'FIXED' ? '금액 (원)' : '비율 (%)'}
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={e => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  min={0}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">최소 주문 금액 (원)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={e => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  min={0}
                />
              </div>
              {formData.discountType === 'PERCENT' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">최대 할인 금액 (원)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={e => setFormData(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    min={0}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={e => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">종료일</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={e => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">최대 사용 횟수 (0=무제한)</label>
                <input
                  type="number"
                  value={formData.maxUsage}
                  onChange={e => setFormData(prev => ({ ...prev, maxUsage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  min={0}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingCoupon ? '수정' : '생성'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>취소</Button>
            </div>
          </form>
        </div>
      )}

      {/* 쿠폰 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">쿠폰명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">코드</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">할인</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">조건</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">기간</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">사용</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_LABELS[coupon.status].color
                        }`}
                      >
                        {STATUS_LABELS[coupon.status].text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary-500" />
                        <span className="font-medium text-neutral-900">{coupon.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="px-2 py-1 bg-neutral-100 rounded text-sm">{coupon.code}</code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {coupon.discountType === 'FIXED' ? (
                          <>
                            <DollarSign className="w-4 h-4 text-neutral-400" />
                            <span>{formatCurrency(coupon.discountValue)}</span>
                          </>
                        ) : (
                          <>
                            <Percent className="w-4 h-4 text-neutral-400" />
                            <span>{coupon.discountValue}%</span>
                            {coupon.maxDiscount && (
                              <span className="text-xs text-neutral-500">
                                (최대 {formatCurrency(coupon.maxDiscount)})
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatCurrency(coupon.minOrderAmount)} 이상
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {coupon.validFrom} ~ {coupon.validUntil}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {coupon.usageCount}
                      {coupon.maxUsage ? `/${coupon.maxUsage}` : ''}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`p-1.5 rounded ${
                            coupon.status === 'ACTIVE'
                              ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-green-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={coupon.status === 'ACTIVE' ? '비활성화' : '활성화'}
                        >
                          {coupon.status === 'ACTIVE' ? '비활성화' : '활성화'}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Gift}
            description="등록된 쿠폰이 없습니다."
          />
        )}
      </div>
    </div>
  );
}
