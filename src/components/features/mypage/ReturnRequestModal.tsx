import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { returnService } from '@/services/returnService';
import { useToast } from '@/components/common/Toast';
import type { OrderListResponse } from '@/types/order';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderListResponse;
  onSuccess?: (returnRequestUuid: string) => void;
}

export const ReturnRequestModal = ({ isOpen, onClose, order, onSuccess }: ReturnRequestModalProps) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // orderItemUuid 기준으로 반품 대상 선택 (백엔드 ReturnRequestCreateDto.orderItemUuids)
  const [selectedItems, setSelectedItems] = useState<string[]>(
    (order.items || []).map(item => item.orderItemUuid).filter(Boolean) as string[]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('반품 사유를 입력해주세요', 'error');
      return;
    }
    if (selectedItems.length === 0) {
      showToast('반품할 상품을 1개 이상 선택해주세요', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const result = await returnService.requestReturn(order.orderUuid, {
        reason,
        orderItemUuids: selectedItems,
      });
      showToast('반품 신청이 완료되었습니다. 반품 송장을 등록해주세요.', 'success');
      onSuccess?.(result.returnRequestUuid);
      onClose();
    } catch (error) {
      console.error('반품 신청 실패:', error);
      showToast('반품 신청에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (uuid: string) => {
    setSelectedItems(prev =>
      prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="반품 신청">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">반품할 상품</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {(order.items || []).map(item => (
              <label key={item.orderItemUuid} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.orderItemUuid)}
                  onChange={() => toggleItem(item.orderItemUuid)}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                <img src={item.imageUrl || '/images/placeholder.png'} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                <span className="text-sm text-neutral-900 flex-1 truncate">{item.productName}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            증빙 사진 (선택)
          </label>
          {/* Mock UI */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-neutral-500">클릭하여 사진 첨부 (준비중)</p>
              </div>
              <input type="file" className="hidden" disabled />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            반품 사유
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="반품하시려는 사유를 상세하게 적어주세요."
            className="w-full h-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            maxLength={500}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || !reason.trim() || selectedItems.length === 0}
          >
            반품 신청하기
          </Button>
        </div>
      </form>
    </Modal>
  );
};
