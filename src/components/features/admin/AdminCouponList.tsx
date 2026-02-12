import { useEffect, useMemo, useState, useCallback } from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Play from 'lucide-react/dist/esm/icons/play';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Gift from 'lucide-react/dist/esm/icons/gift';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';
import { CouponFormPanel, type CouponFormData } from '@/components/features/admin/CouponFormPanel';
import { couponService } from '@/services/couponService';
import type { CouponResponse, CouponStatus } from '@/types/coupon';

const STATUS_LABELS: Record<CouponStatus, { text: string; color: string }> = {
  DRAFT: { text: '초안', color: 'bg-neutral-100 text-neutral-700' },
  ACTIVE: { text: '활성', color: 'bg-green-100 text-green-800' },
  INACTIVE: { text: '비활성', color: 'bg-amber-100 text-amber-800' },
  EXPIRED: { text: '만료', color: 'bg-red-100 text-red-700' },
};

const EMPTY_FORM: CouponFormData = {
  couponName: '',
  discountAmount: 0,
  minimumOrderAmount: 0,
  validFrom: '',
  totalQuantity: 1,
};

const toLocalDateTimeInput = (isoString: string) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoString = (localDateTime: string) => new Date(localDateTime).toISOString();

export function AdminCouponList() {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponResponse | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const loadCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await couponService.getAdminCoupons();
      setCoupons(list);
    } catch (error) {
      console.error('Failed to load admin coupons:', error);
      showToast('쿠폰 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingCoupon(null);
    setShowForm(false);
  };

  const filteredCoupons = useMemo(() => {
    if (statusFilter === 'all') return coupons;
    return coupons.filter((coupon) => coupon.status === statusFilter);
  }, [coupons, statusFilter]);

  const handleEdit = (coupon: CouponResponse) => {
    setEditingCoupon(coupon);
    setFormData({
      couponName: coupon.couponName,
      discountAmount: coupon.discountAmount,
      minimumOrderAmount: coupon.minimumOrderAmount,
      validFrom: toLocalDateTimeInput(coupon.validFrom),
      totalQuantity: coupon.totalQuantity,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.validFrom) {
      showToast('시작 일시를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateAdminCouponDraft(editingCoupon.uuid, {
          couponName: formData.couponName,
          discountAmount: formData.discountAmount,
          minimumOrderAmount: formData.minimumOrderAmount,
          validFrom: toIsoString(formData.validFrom),
        });
        showToast('쿠폰 초안이 수정되었습니다.', 'success');
      } else {
        await couponService.createAdminCoupon({
          couponName: formData.couponName,
          discountAmount: formData.discountAmount,
          minimumOrderAmount: formData.minimumOrderAmount,
          validFrom: toIsoString(formData.validFrom),
          totalQuantity: formData.totalQuantity,
        });
        showToast('새 쿠폰이 생성되었습니다.', 'success');
      }

      await loadCoupons();
      resetForm();
    } catch (error) {
      console.error('Failed to submit coupon:', error);
      showToast('쿠폰 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (couponUuid: string) => {
    try {
      await couponService.activateAdminCoupon(couponUuid);
      showToast('쿠폰이 활성화되었습니다.', 'success');
      await loadCoupons();
    } catch (error) {
      console.error('Failed to activate coupon:', error);
      showToast('활성화 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString('ko-KR');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        비활성화/삭제 기능은 백엔드 미지원으로 준비중입니다.
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">쿠폰 목록</h2>
        <Button onClick={() => setShowForm(true)} disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-1" />
          쿠폰 추가
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-neutral-600">상태 필터</label>
        <select
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CouponStatus | 'all')}
        >
          <option value="all">전체</option>
          <option value="DRAFT">초안</option>
          <option value="ACTIVE">활성</option>
          <option value="INACTIVE">비활성</option>
          <option value="EXPIRED">만료</option>
        </select>
      </div>

      {showForm && (
        <CouponFormPanel
          isEditing={!!editingCoupon}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">쿠폰 목록을 불러오는 중입니다.</div>
        ) : filteredCoupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">쿠폰명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">할인</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">조건</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">시작일</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">발급량</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.uuid} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[coupon.status].color}`}
                      >
                        {STATUS_LABELS[coupon.status].text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary-500" />
                        <span className="font-medium text-neutral-900">{coupon.couponName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-neutral-700">
                        <DollarSign className="w-4 h-4" />
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
                          onClick={() => handleEdit(coupon)}
                          disabled={coupon.status !== 'DRAFT'}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-40"
                          title={coupon.status === 'DRAFT' ? '수정' : '초안 상태에서만 수정 가능'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleActivate(coupon.uuid)}
                          disabled={coupon.status !== 'DRAFT'}
                          className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded disabled:opacity-40"
                          title={coupon.status === 'DRAFT' ? '활성화' : '초안 상태에서만 활성화 가능'}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => showToast('준비중입니다.', 'info')}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="삭제 (준비중)"
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
          <EmptyState icon={Gift} description="등록된 쿠폰이 없습니다." />
        )}
      </div>
    </div>
  );
}
