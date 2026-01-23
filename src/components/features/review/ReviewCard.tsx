/**
 * 리뷰 카드 컴포넌트
 */

import { StarRating } from './StarRating';
import UserIcon from 'lucide-react/dist/esm/icons/user';

interface Review {
  id: string;
  rating: number;
  content: string;
  buyer: {
    nickname: string;
    avatar?: string;
  };
  productTitle: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-neutral-200">
      <div className="flex items-start gap-3">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {review.buyer.avatar ? (
            <img src={review.buyer.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-5 h-5 text-neutral-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 닉네임 + 별점 */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-neutral-900">{review.buyer.nickname}</span>
            <StarRating value={review.rating} size="sm" readonly />
          </div>
          
          {/* 상품명 */}
          <p className="text-xs text-neutral-500 mb-2 truncate">
            {review.productTitle}
          </p>
          
          {/* 리뷰 내용 */}
          <p className="text-sm text-neutral-700 leading-relaxed">
            {review.content}
          </p>
          
          {/* 작성일 */}
          <p className="mt-2 text-xs text-neutral-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export type { Review };
