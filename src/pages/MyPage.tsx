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

import ProfileCard from '../components/features/mypage/ProfileCard';
import ProfileStats from '../components/features/mypage/ProfileStats';
import SettlementCard from '../components/features/mypage/SettlementCard';
import SalesTabs from '../components/features/mypage/SalesTabs';
import MyPageNav from '../components/features/mypage/MyPageNav';
import { FollowingShops } from '../components/features/mypage/FollowingShops';

const MyPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const balance = useUserStore((state) => state.balance);
  const fetchBalance = useUserStore((state) => state.fetchBalance);
  
  const [purchaseCount, setPurchaseCount] = useState(0);

  const likeCount = useLikeStore((state) => state.getLikedCount(user?.id || ''));
  const followingCount = useFollowStore((state) => state.getFollowingCount(user?.id || ''));
  const mySalesProducts = useSellerStore((state) => state.products);
  const initSellerProducts = useSellerStore((state) => state.initSellerProducts);
  const fetchUserLikes = useLikeStore((state) => state.fetchUserLikes);
  const initFollowing = useFollowStore((state) => state.initFollowing);

  useEffect(() => {
    if (user?.id) {
      if (mySalesProducts.length === 0) {
        initSellerProducts(user.id);
      }
      fetchUserLikes(user.id);
      initFollowing(user.id);
      fetchBalance();

      // 주문 내역 개수 조회
      orderService.getMyOrders(0, 1).then(res => {
        setPurchaseCount(res.totalElements);
      }).catch(console.error);
    }
  }, [user?.id, initSellerProducts, fetchUserLikes, initFollowing, mySalesProducts.length, fetchBalance]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 통계 데이터 - 현재 유저 기반 동적 계산
  // mySalesProducts는 store에서 가져옴
  
  const salesCount = mySalesProducts.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* 프로필 카드 */}
        <ProfileCard user={user as any} />

        {/* 통계 */}
        <ProfileStats
          salesCount={salesCount}
          purchaseCount={purchaseCount}
          point={balance?.balance || 0}
        />

        {/* 정산 계좌 */}
        <SettlementCard user={user as any} />

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
