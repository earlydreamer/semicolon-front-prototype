/**
 * 판매자 프로필 컴포넌트
 */

import Star from 'lucide-react/dist/esm/icons/star';

interface Seller {
  id: string;
  nickname: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  activeListingCount: number;
  salesCount: number;
  intro?: string;
}

interface SellerProfileCardProps {
  seller: Seller;
}

export const SellerProfileCard = ({ seller }: SellerProfileCardProps) => {
  const hasReviews = seller.reviewCount > 0;

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
            <img
              src={seller.avatar || `https://ui-avatars.com/api/?name=${seller.nickname}&background=random`}
              alt={seller.nickname}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-gray-900">{seller.nickname}</div>
            <div className="text-sm text-gray-500">
              상품 {seller.activeListingCount}개 · 판매 {seller.salesCount}회
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star className="h-4 w-4 fill-current" />
              {hasReviews ? `${seller.rating.toFixed(1)} / 5.0` : '정보 없음'}
            </div>
            <div className="text-xs text-gray-400">리뷰 {seller.reviewCount}개</div>
          </div>
        </div>
      </div>
      {seller.intro && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{seller.intro}</div>}
    </div>
  );
};
