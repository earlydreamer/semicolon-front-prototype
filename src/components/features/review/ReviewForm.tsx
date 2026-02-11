/**
 * 리뷰 작성 폼 컴포넌트
 */

import { useState } from 'react';
import { useToast } from '../../common/Toast';
import { Button } from '../../common/Button';
import { StarRating } from './StarRating';
import ImagePlus from 'lucide-react/dist/esm/icons/image-plus';
import X from 'lucide-react/dist/esm/icons/x';

interface ReviewFormProps {
  orderId: string;
  productTitle: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ReviewForm = ({ orderId, productTitle, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length < 10) {
      showToast('리뷰 내용은 10자 이상 작성해주세요.', 'error');
      return;
    }

    // TODO: 실제 서버로 리뷰 데이터 전송
    console.log('[MOCK] Submitting review:', { orderId, rating, content, images });
    
    showToast('리뷰가 등록되었습니다.', 'success');
    onSubmit();
  };

  const handleImageUpload = () => {
    // 이미지 업로드 시뮬레이션
    if (images.length >= 3) {
      showToast('이미지는 최대 3장까지 첨부 가능합니다.', 'error');
      return;
    }
    // 더미 이미지 추가
    setImages([...images, 'https://placehold.co/100x100?text=Review+Image']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-1">리뷰 작성</h3>
        <p className="text-sm text-neutral-500">{productTitle}</p>
      </div>

      {/* 별점 */}
      <div className="flex flex-col items-center py-4 bg-neutral-50 rounded-lg">
        <p className="text-sm font-medium mb-2 text-neutral-600">상품은 만족스러우셨나요?</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* 내용 입력 */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상품에 대한 솔직한 리뷰를 남겨주세요. (10자 이상)"
          className="w-full h-32 p-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* 이미지 첨부 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-neutral-700">사진 첨부</span>
          <span className="text-xs text-neutral-500">({images.length}/3)</span>
        </div>
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 border border-neutral-200 rounded-lg overflow-hidden">
              <img src={img} alt={`review-${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-20 h-20 flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-lg text-neutral-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            >
              <ImagePlus className="w-6 h-6 mb-1" />
              <span className="text-xs">추가</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" className="flex-1">
          등록하기
        </Button>
      </div>
    </form>
  );
};
