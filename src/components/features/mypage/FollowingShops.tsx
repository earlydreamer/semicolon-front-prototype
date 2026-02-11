import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Star from 'lucide-react/dist/esm/icons/star';
import Store from 'lucide-react/dist/esm/icons/store';
import UserMinus from 'lucide-react/dist/esm/icons/user-minus';
import { useFollowStore } from '@/stores/useFollowStore';
import { followService, type FollowedSellerCardResponse } from '@/services/followService';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

interface FollowingShopsProps {
  userId: string;
}

export function FollowingShops({ userId }: FollowingShopsProps) {
  const { removeFollow, initFollowing } = useFollowStore();
  const [followingShops, setFollowingShops] = useState<FollowedSellerCardResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      await initFollowing(userId);
      try {
        const list = await followService.getMyFollowing();
        setFollowingShops(list);
      } catch (error) {
        console.error('Failed to load following shops:', error);
        setFollowingShops([]);
      }
    };

    load();
  }, [initFollowing, userId]);

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
    await removeFollow(userId, shopId);
    setFollowingShops((prev) => prev.filter((shop) => shop.sellerUuid !== shopId));
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {followingShops.map((shop) => (
        <Link
          key={shop.sellerUuid}
          to={`/shop/${shop.sellerUuid}`}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 
                     hover:border-primary-200 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            <Store className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 truncate group-hover:text-primary-600">
                {shop.nickname}
              </h3>
              <div className="flex items-center gap-0.5 text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium">{Number(shop.averageRating || 0).toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 truncate">
              {shop.intro || `리뷰 ${shop.reviewCount} · 팔로워 ${shop.followerCount}`}
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
      ))}
    </div>
  );
}
