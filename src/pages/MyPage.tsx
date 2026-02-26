/**
 * 마이페이지 메인
 */

import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useLikeStore } from '../stores/useLikeStore';
import { useFollowStore } from '../stores/useFollowStore';
import { useSellerStore } from '../stores/useSellerStore';
import { MOCK_ORDER_HISTORY } from '../mocks/users';

import ProfileCard from '../components/features/mypage/ProfileCard';
import ProfileStats from '../components/features/mypage/ProfileStats';
import SettlementCard from '../components/features/mypage/SettlementCard';
import SalesTabs from '../components/features/mypage/SalesTabs';
import MyPageNav from '../components/features/mypage/MyPageNav';
import { FollowingShops } from '../components/features/mypage/FollowingShops';

const MyPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const likeCount = useLikeStore((state) => state.getLikedCount(user?.id || ''));
  const followingCount = useFollowStore((state) => state.getFollowingCount(user?.id || ''));
  const mySalesProducts = useSellerStore((state) => state.products);
  const initSellerProducts = useSellerStore((state) => state.initSellerProducts);
  const initUserLikes = useLikeStore((state) => state.initUserLikes);
  const initFollowing = useFollowStore((state) => state.initFollowing);

  useEffect(() => {
    if (user?.id) {
      // 이미 로드된 데이터가 없을 경우에만 초기화하거나, 
      // 앱 요구사항에 따라 항상 최신 Mock 데이터를 로드하도록 할 수 있음
      if (mySalesProducts.length === 0) {
        initSellerProducts(user.id);
      }
      initUserLikes(user.id);
      initFollowing(user.id);
    }
  }, [user?.id, initSellerProducts, initUserLikes, initFollowing, mySalesProducts.length]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 통계 데이터 - 현재 유저 기반 동적 계산
  // mySalesProducts는 store에서 가져옴
  const myPurchases = MOCK_ORDER_HISTORY.filter((o) => o.buyerId === user.id);
  
  const salesCount = mySalesProducts.length;
  const purchaseCount = myPurchases.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* 프로필 카드 */}
        <ProfileCard user={user} />

        {/* 통계 */}
        <ProfileStats
          salesCount={salesCount}
          purchaseCount={purchaseCount}
          point={user.point}
        />

        {/* 정산 계좌 */}
        <SettlementCard user={user} />

        {/* 빠른 메뉴 */}
        <MyPageNav likeCount={likeCount} orderCount={purchaseCount} />

        {/* 판매 내역 */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">내 판매 상품</h2>
          <SalesTabs products={mySalesProducts as any} />
        </div>

        {/* 팔로우한 상점 */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">
            팔로우한 상점 <span className="text-primary-600">{followingCount}</span>
          </h2>
          <FollowingShops userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
