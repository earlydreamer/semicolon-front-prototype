import { ReviewCard, type Review } from './ReviewCard';
import Star from 'lucide-react/dist/esm/icons/star';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import { EmptyState } from '@/components/common/EmptyState';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold text-neutral-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <MessageSquare className="w-4 h-4" />
          <span>리뷰 {reviews.length}개</span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          description="아직 작성된 리뷰가 없습니다."
        />
      )}
    </div>
  );
}
