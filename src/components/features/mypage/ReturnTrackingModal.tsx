import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { returnService } from '@/services/returnService';
import { useToast } from '@/components/common/Toast';

const CARRIERS = [
  { code: 'kr.cjlogistics', name: 'CJ대한통운' },
  { code: 'kr.lotte', name: '롯데택배' },
  { code: 'kr.hanjin', name: '한진택배' },
  { code: 'kr.epost', name: '우체국택배' },
  { code: 'kr.logen', name: '로젠택배' }
];

interface ReturnTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRequestUuid: string;
  onSuccess?: () => void;
}

export const ReturnTrackingModal = ({ isOpen, onClose, returnRequestUuid, onSuccess }: ReturnTrackingModalProps) => {
  const { showToast } = useToast();
  const [carrierCode, setCarrierCode] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrierCode) {
      showToast('택배사를 선택해 주세요', 'error');
      return;
    }
    if (!trackingNumber.trim()) {
      showToast('운송장 번호를 입력해 주세요', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const carrierName = CARRIERS.find(c => c.code === carrierCode)?.name || '';
      
      await returnService.registerTrackingInfo(returnRequestUuid, {
        carrierCode,
        carrierName,
        trackingNumber: trackingNumber.trim()
      });
      
      showToast('반품 운송장 등록이 완료됐어요', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('운송장 등록 실패:', error);
      showToast('운송장 등록에 실패했어요. 다시 시도해 주세요.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="반품 운송장 등록">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            택배사
          </label>
          <select
            value={carrierCode}
            onChange={(e) => setCarrierCode(e.target.value)}
            className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">택배사 선택</option>
            {CARRIERS.map(carrier => (
              <option key={carrier.code} value={carrier.code}>
                {carrier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            운송장 번호
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value.replace(/[^0-9]/g, ''))} // 숫자만 입력
            placeholder="숫자만 입력해 주세요 (예: 1234567890)"
            className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxLength={20}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || !carrierCode || !trackingNumber.trim()}
          >
            운송장 등록하기
          </Button>
        </div>
      </form>
    </Modal>
  );
};
