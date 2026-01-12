import { Modal } from '@/components/common/Modal';
import { Copy, Twitter } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export const ShareModal = ({ isOpen, onClose, productTitle }: ShareModalProps) => {
  const { showToast } = useToast();
  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast('링크가 복사되었습니다.', 'success');
    } catch (err) {
      showToast('링크 복사에 실패했습니다.', 'error');
    }
  };

  const handleShareTwitter = () => {
    const text = `[세미콜론] ${productTitle}\n${currentUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="공유하기" size="sm">
      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-8 py-4">
          {/* 링크 복사 버튼 */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
              <Copy className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-neutral-600">링크 복사</span>
          </button>

          {/* Twitter(X) 공유 버튼 */}
          <button
            onClick={handleShareTwitter}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-neutral-600">Twitter (X)</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-neutral-900">상품 링크</p>
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="flex-1 text-xs text-neutral-500 truncate select-all">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-xs font-bold text-primary-500 hover:text-primary-600"
            >
              복사
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
