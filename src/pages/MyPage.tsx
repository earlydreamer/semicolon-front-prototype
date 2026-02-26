/**
 * 마이페이지 메인
 */

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useLikeStore } from '../stores/useLikeStore';
import { useFollowStore } from '../stores/useFollowStore';
import { useSellerStore } from '../stores/useSellerStore';
import { useUserStore } from '../stores/useUserStore';
import { orderService } from '../services/orderService';
import { shopService } from '../services/shopService';

import ProfileCard from '../components/features/mypage/ProfileCard';
import ProfileStats from '../components/features/mypage/ProfileStats';
import SalesTabs from '../components/features/mypage/SalesTabs';
import MyPageNav from '../components/features/mypage/MyPageNav';
import { FollowingShops } from '../components/features/mypage/FollowingShops';

const MyPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const balance = useUserStore((state) => state.balance);
  const fetchBalance = useUserStore((state) => state.fetchBalance);

  const [purchaseCount, setPurchaseCount] = useState(0);
  const [myShopIntro, setMyShopIntro] = useState('');

  const likeCount = useLikeStore((state) => state.getLikedCount(user?.id || ''));
  const followingCount = useFollowStore((state) => state.getFollowingCount(user?.id || ''));
  const mySalesProducts = useSellerStore((state) => state.products);
  const initSellerProducts = useSellerStore((state) => state.initSellerProducts);
  const fetchUserLikes = useLikeStore((state) => state.fetchUserLikes);
  const initFollowing = useFollowStore((state) => state.initFollowing);

  useEffect(() => {
    if (user?.id) {
      initSellerProducts();
      fetchUserLikes(user.id);
      initFollowing(user.id).catch(console.error);
      fetchBalance();
      shopService
        .getMyShop()
        .then((shop) => setMyShopIntro(shop.intro || ''))
        .catch(() => setMyShopIntro(''));

      // 주문 내역 개수 조회
      orderService
        .getMyOrders(0, 1)
        .then((res) => {
          setPurchaseCount(res.totalElements);
        })
        .catch(console.error);
    }
  }, [user?.id, initSellerProducts, fetchUserLikes, initFollowing, fetchBalance]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const salesCount = mySalesProducts.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-2xl space-y-5 px-3 min-[360px]:space-y-6 min-[360px]:px-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">내 프로필</h2>
          <ProfileCard user={{ ...user, intro: user.intro || myShopIntro }} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">활동 요약</h2>
          <ProfileStats
            salesCount={salesCount}
            purchaseCount={purchaseCount}
            deposit={balance?.balance || 0}
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">바로가기</h2>
          <MyPageNav likeCount={likeCount} orderCount={purchaseCount} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">내 판매 상품</h2>
          <SalesTabs products={mySalesProducts} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">
            팔로우한 상점 <span className="text-primary-600">{followingCount}</span>
          </h2>
          <FollowingShops userId={user.id} refreshKey={followingCount} />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
