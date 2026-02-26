/**
 * 신고하기 모달 컴포넌트
 */

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'PRODUCT' | 'USER';
  targetId: string;
  targetName: string;
}

const REPORT_REASONS = [
  { value: 'FAKE_PRODUCT', label: '허위 상품 정보' },
  { value: 'FRAUD', label: '사기 의심' },
  { value: 'INAPPROPRIATE', label: '부적절한 콘텐츠' },
  { value: 'DUPLICATE', label: '중복 게시' },
  { value: 'OTHER', label: '기타' },
];

export function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      showToast('신고 사유를 선택해주세요.', 'info');
      return;
    }

    setIsSubmitting(true);
    
    // TODO: 실제 API 연동
    console.log('Report submitted:', {
      targetType,
      targetId,
      targetName,
      reason,
      description,
    });

    // 모의 딜레이
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    showToast('신고가 접수되었습니다. 검토 후 처리해드리겠습니다.', 'success');
    setIsSubmitting(false);
    setReason('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">신고하기</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 신고 대상 정보 */}
          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="text-xs text-neutral-500 mb-1">
              {targetType === 'PRODUCT' ? '신고 상품' : '신고 사용자'}
            </div>
            <div className="text-sm font-medium text-neutral-900 truncate">
              {targetName}
            </div>
          </div>

          {/* 신고 사유 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              신고 사유 <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">선택해주세요</option>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 상세 내용 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              신고 내용 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상세 내용을 입력해주세요"
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* 안내 문구 */}
          <p className="text-xs text-neutral-500">
            허위 신고 시 서비스 이용이 제한될 수 있습니다. 신고 내용은 관리자가 검토 후 처리됩니다.
          </p>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '신고하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
