/**
 * 판매자 프로필 컴포넌트
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Star from 'lucide-react/dist/esm/icons/star';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import UserMinus from 'lucide-react/dist/esm/icons/user-minus';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFollowStore } from '@/stores/useFollowStore';
import { useToast } from '@/components/common/Toast';

interface Seller {
  sellerUuid: string;
  sellerUserUuid: string;
  shopUuid: string;
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
  const { user } = useAuthStore();
  const { isFollowing, toggleFollow, initFollowing } = useFollowStore();
  const { showToast } = useToast();

  const hasReviews = seller.reviewCount > 0;
  const isMySellerProfile = user?.id === seller.sellerUserUuid;
  const following = user ? isFollowing(user.id, seller.sellerUuid) : false;

  useEffect(() => {
    if (!user) {
      return;
    }
    initFollowing(user.id);
  }, [user, initFollowing]);

  const handleToggleFollow = async () => {
    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    try {
      const nextFollowing = await toggleFollow(user.id, seller.sellerUuid);
      showToast(nextFollowing ? '판매자를 팔로우했어요.' : '팔로우를 취소했어요.', nextFollowing ? 'success' : 'info');
    } catch {
      showToast('팔로우 처리에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="mb-4 flex items-center justify-between">
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
            <div className="flex items-center gap-1 font-bold text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              {hasReviews ? `${seller.rating.toFixed(1)} / 5.0` : '정보 없음'}
            </div>
            <div className="text-xs text-gray-400">리뷰 {seller.reviewCount}개</div>
          </div>

          {!isMySellerProfile && (
            <div className="flex items-center gap-2">
              <Link
                to={`/shop/${seller.shopUuid}`}
                className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                상점 보기
              </Link>

              {following && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  <UserCheck className="h-3 w-3" />
                  팔로우 중
                </span>
              )}

              <button
                type="button"
                onClick={handleToggleFollow}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  following
                    ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {following ? <UserMinus className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                {following ? '언팔로우' : '팔로우'}
              </button>
            </div>
          )}
        </div>
      </div>
      {seller.intro && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{seller.intro}</div>}
    </div>
  );
};
