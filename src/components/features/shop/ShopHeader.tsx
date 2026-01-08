/**
 * 상점 헤더 컴포넌트
 */

import type { Shop } from '../../../mocks/users';
import FollowButton from './FollowButton';

interface ShopHeaderProps {
  shop: Shop;
}

const ShopHeader = ({ shop }: ShopHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200">
      <div className="flex items-start gap-4">
        {/* 상점 아바타 */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
          {shop.avatar ? (
            <img
              src={shop.avatar}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-neutral-400">
              {shop.name.charAt(0)}
            </div>
          )}
        </div>

        {/* 상점 정보 */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-neutral-900 mb-1">{shop.name}</h1>
          {shop.intro && (
            <p className="text-sm text-neutral-600 line-clamp-2">{shop.intro}</p>
          )}
        </div>

        {/* 팔로우 버튼 */}
        <div className="flex-shrink-0">
          <FollowButton shopId={shop.id} />
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
