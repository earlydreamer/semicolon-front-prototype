/**
 * 리뷰 목록 컴포넌트
 */

import { ReviewCard, type Review } from './ReviewCard';
import { Star, MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

// Mock 리뷰 데이터
const MOCK_REVIEWS: Review[] = [
  {
    id: 'review_1',
    rating: 5,
    content: '상품 상태가 정말 좋아요! 설명과 100% 일치하고 배송도 빨랐습니다. 판매자분도 친절하셔서 거래가 쾌적했습니다.',
    buyer: { nickname: '캠핑러버' },
    productTitle: '스노우피크 랜드락 텐트 풀세트',
    createdAt: '2026-01-08T14:30:00',
  },
  {
    id: 'review_2',
    rating: 4,
    content: '전반적으로 만족합니다. 작은 스크래치가 있었지만 사전에 설명해주셨고, 가격 대비 상태가 좋았습니다.',
    buyer: { nickname: '기타중독' },
    productTitle: '펜더 스트라토캐스터 (Made in Japan)',
    createdAt: '2026-01-07T10:00:00',
  },
  {
    id: 'review_3',
    rating: 5,
    content: '빠른 답변과 정확한 상품 설명 감사합니다! 다음에도 또 거래하고 싶습니다.',
    buyer: { nickname: '취미부자' },
    productTitle: '캐논 EOS R5 바디',
    createdAt: '2026-01-05T18:00:00',
  },
];

interface ReviewListProps {
  sellerId?: string;
  reviews?: Review[];
}

export function ReviewList({ reviews = MOCK_REVIEWS }: ReviewListProps) {
  // 평균 별점 계산
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-4">
      {/* 리뷰 요약 */}
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

      {/* 리뷰 목록 */}
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
