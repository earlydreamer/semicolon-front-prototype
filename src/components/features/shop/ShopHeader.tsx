/**
 * 상점 헤더 컴포넌트
 */

import type { Shop } from '../../../mocks/users';
import { useAuthStore } from '../../../stores/useAuthStore';
import FollowButton from './FollowButton';
import Store from 'lucide-react/dist/esm/icons/store';

interface ShopHeaderProps {
  shop: Shop;
}

const ShopHeader = ({ shop }: ShopHeaderProps) => {
  const { user: currentUser } = useAuthStore();
  const isMyShop = currentUser?.id === shop.userId;

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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-neutral-900 truncate">
              {shop.name}
            </h1>
            {isMyShop && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-bold rounded-full border border-primary-100">
                <Store className="w-3 h-3" />
                내 상점
              </span>
            )}
          </div>
          {shop.intro && (
            <p className="text-sm text-neutral-600 line-clamp-2">{shop.intro}</p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex-shrink-0">
          {!isMyShop && <FollowButton shopId={shop.id} />}
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
