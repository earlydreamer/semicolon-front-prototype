import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface ReturnActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actionType: 'approve' | 'reject';
  requireReason?: boolean;
  onSubmit: (reason?: string) => Promise<void>;
}

export const ReturnActionModal = ({
  isOpen,
  onClose,
  title,
  description,
  actionType,
  requireReason = false,
  onSubmit
}: ReturnActionModalProps) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      return; // 폼 검증 처리는 HTML5 required 속성으로도 처리 가능
    }

    try {
      setIsLoading(true);
      await onSubmit(actionType === 'reject' ? reason : undefined);
      setReason('');
      onClose();
    } catch (error) {
      console.error('반품 처리 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {description && (
          <p className="text-sm text-neutral-600 mb-4">{description}</p>
        )}

        {requireReason && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              거절 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="거절 사유를 명확하게 입력해주세요."
              className="w-full h-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              maxLength={500}
              required
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1"
            variant={actionType === 'reject' ? 'danger' : 'primary'}
            isLoading={isLoading}
            disabled={isLoading || (requireReason && !reason.trim())}
          >
            {actionType === 'reject' ? '거절하기' : '승인하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
