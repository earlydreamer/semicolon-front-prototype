import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Star from 'lucide-react/dist/esm/icons/star';
import Store from 'lucide-react/dist/esm/icons/store';
import UserMinus from 'lucide-react/dist/esm/icons/user-minus';
import { useFollowStore } from '@/stores/useFollowStore';
import { followService, type FollowedSellerCardResponse } from '@/services/followService';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/components/common/Toast';

interface FollowingShopsProps {
  userId: string;
  refreshKey?: number;
}

export function FollowingShops({ userId, refreshKey = 0 }: FollowingShopsProps) {
  const { removeFollow, initFollowing } = useFollowStore();
  const followingIds = useFollowStore((state) => state.userFollowing[userId] || []);
  const { showToast } = useToast();
  const [followingShops, setFollowingShops] = useState<FollowedSellerCardResponse[]>([]);
  const followingIdsKey = followingIds.join(',');

  useEffect(() => {
    const load = async () => {
      try {
        await initFollowing(userId);
        const list = await followService.getMyFollowing();
        setFollowingShops(list);
      } catch (error) {
        console.error('Failed to load following shops:', error);
        setFollowingShops([]);
      }
    };

    load();
  }, [initFollowing, userId, followingIdsKey, refreshKey]);

  if (followingShops.length === 0) {
    return (
      <EmptyState
        title="팔로우한 상점이 없습니다"
        description="관심있는 상점을 팔로우해보세요"
        icon={Store}
      />
    );
  }

  const handleUnfollow = async (shopId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFollow(userId, shopId);
      setFollowingShops((prev) => prev.filter((shop) => shop.sellerUuid !== shopId));
      showToast('팔로우를 취소했어요.', 'info');
    } catch (error) {
      console.error('Failed to unfollow shop:', error);
      showToast('팔로우 취소에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {followingShops.map((shop) => {
        const hasReviews = Number(shop.reviewCount || 0) > 0;

        return (
          <Link
            key={shop.sellerUuid}
            to={`/shop/${shop.shopUuid}`}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 
                     hover:border-primary-200 hover:shadow-sm transition-[box-shadow,border-color] group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
              <Store className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-neutral-900 truncate group-hover:text-primary-600">
                  {shop.nickname}
                </h3>
                {hasReviews ? (
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">{Number(shop.averageRating || 0).toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400">평점 정보 없음</span>
                )}
              </div>
              <p className="text-sm text-neutral-500 truncate">
                {shop.intro || `리뷰 ${shop.reviewCount}개 · 팔로워 ${shop.followerCount}`}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleUnfollow(shop.sellerUuid, e)}
              className="flex-shrink-0 text-neutral-400 hover:text-red-500 hover:bg-red-50"
            >
              <UserMinus className="w-4 h-4" />
            </Button>
          </Link>
        );
      })}
    </div>
  );
}