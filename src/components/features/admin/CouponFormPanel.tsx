/**
 * 쿠폰 생성/수정 폼 패널 컴포넌트
 * 
 * AdminCouponList에서 분리된 쿠폰 폼 컴포넌트
 */

import { Button } from '@/components/common/Button';

type DiscountType = 'FIXED' | 'PERCENT';

export interface CouponFormData {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  maxUsage: number;
}

interface CouponFormPanelProps {
  isEditing: boolean;
  formData: CouponFormData;
  onFormChange: (data: CouponFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CouponFormPanel = ({
  isEditing,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
}: CouponFormPanelProps) => {
  const updateForm = (updates: Partial<CouponFormData>) => {
    onFormChange({ ...formData, ...updates });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? '쿠폰 수정' : '새 쿠폰 생성'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => updateForm({ name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">쿠폰 코드</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => updateForm({ code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">할인 타입</label>
            <select
              value={formData.discountType}
              onChange={e => updateForm({ discountType: e.target.value as DiscountType })}
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
              onChange={e => updateForm({ discountValue: Number(e.target.value) })}
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
              onChange={e => updateForm({ minOrderAmount: Number(e.target.value) })}
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
                onChange={e => updateForm({ maxDiscount: Number(e.target.value) })}
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
              onChange={e => updateForm({ validFrom: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">종료일</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={e => updateForm({ validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">최대 사용 횟수 (0=무제한)</label>
            <input
              type="number"
              value={formData.maxUsage}
              onChange={e => updateForm({ maxUsage: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              min={0}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{isEditing ? '수정' : '생성'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
        </div>
      </form>
    </div>
  );
};
