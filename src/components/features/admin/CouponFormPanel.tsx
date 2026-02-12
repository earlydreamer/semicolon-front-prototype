import { Button } from '@/components/common/Button';

export interface CouponFormData {
  couponName: string;
  discountAmount: number;
  minimumOrderAmount: number;
  validFrom: string;
  totalQuantity: number;
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
      <h3 className="text-lg font-semibold mb-4">{isEditing ? '쿠폰 초안 수정' : '새 쿠폰 생성'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={formData.couponName}
              onChange={(e) => updateForm({ couponName: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">할인 금액 (원)</label>
            <input
              type="number"
              value={formData.discountAmount}
              onChange={(e) => updateForm({ discountAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              min={1}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">최소 주문 금액 (원)</label>
            <input
              type="number"
              value={formData.minimumOrderAmount}
              onChange={(e) => updateForm({ minimumOrderAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              min={0}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">시작 일시</label>
            <input
              type="datetime-local"
              value={formData.validFrom}
              onChange={(e) => updateForm({ validFrom: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">총 발급 수량</label>
              <input
                type="number"
                value={formData.totalQuantity}
                onChange={(e) => updateForm({ totalQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                min={1}
                required
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          비활성화/삭제 기능은 준비중입니다.
        </div>

        <div className="flex gap-2">
          <Button type="submit">{isEditing ? '수정 저장' : '생성'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};
