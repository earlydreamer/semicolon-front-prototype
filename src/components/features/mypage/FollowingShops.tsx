/**
 * 팔로우한 상점 목록 컴포넌트
 */

import { Link } from 'react-router-dom';
import Star from 'lucide-react/dist/esm/icons/star';
import Store from 'lucide-react/dist/esm/icons/store';
import UserMinus from 'lucide-react/dist/esm/icons/user-minus';
import { useFollowStore } from '@/stores/useFollowStore';
import { MOCK_SHOPS } from '@/mocks/users';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

interface FollowingShopsProps {
  userId: string;
}

export function FollowingShops({ userId }: FollowingShopsProps) {
  const { userFollowing, removeFollow } = useFollowStore();
  
  const followingShopIds = userFollowing[userId] || [];

  // 팔로우한 상점 정보 조회
  const followingShops = MOCK_SHOPS.filter((shop) => 
    followingShopIds.includes(shop.id)
  );

  if (followingShops.length === 0) {
    return (
      <EmptyState
        title="팔로우한 상점이 없습니다"
        description="관심있는 상점을 팔로우해보세요!"
        icon={Store}
      />
    );
  }

  const handleUnfollow = (shopId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFollow(userId, shopId);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {followingShops.map((shop) => (
        <Link
          key={shop.id}
          to={`/shop/${shop.id}`}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 
                     hover:border-primary-200 hover:shadow-sm transition-all group"
        >
          {/* 상점 아바타 */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
            <img
              src={shop.avatar || `https://ui-avatars.com/api/?name=${shop.name}&background=random`}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 상점 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 truncate group-hover:text-primary-600">
                {shop.name}
              </h3>
              <div className="flex items-center gap-0.5 text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium">{shop.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 truncate">
              {shop.intro || `상품 ${shop.activeListingCount}개 · 판매 ${shop.salesCount}회`}
            </p>
          </div>

          {/* 언팔로우 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleUnfollow(shop.id, e)}
            className="flex-shrink-0 text-neutral-400 hover:text-red-500 hover:bg-red-50"
          >
            <UserMinus className="w-4 h-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
