/**
 * 마이페이지 메인
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useLikeStore } from '../stores/useLikeStore';
import { MOCK_USER, MOCK_ORDER_HISTORY, MOCK_SALES_PRODUCTS } from '../mocks/users';

import ProfileCard from '../components/features/mypage/ProfileCard';
import ProfileStats from '../components/features/mypage/ProfileStats';
import AccountInfoCard from '../components/features/mypage/AccountInfoCard';
import SalesTabs from '../components/features/mypage/SalesTabs';
import MyPageNav from '../components/features/mypage/MyPageNav';

const MyPage = () => {
  const { isAuthenticated } = useAuthStore();
  const likeCount = useLikeStore((state) => state.getLikedCount());

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 통계 데이터
  const salesCount = MOCK_SALES_PRODUCTS.length;
  const purchaseCount = MOCK_ORDER_HISTORY.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* 프로필 카드 */}
        <ProfileCard user={MOCK_USER} />

        {/* 통계 */}
        <ProfileStats
          salesCount={salesCount}
          purchaseCount={purchaseCount}
          point={MOCK_USER.point}
        />

        {/* 정산 계좌 정보 */}
        <AccountInfoCard user={MOCK_USER} />

        {/* 빠른 메뉴 */}
        <MyPageNav likeCount={likeCount} orderCount={purchaseCount} />

        {/* 판매 내역 */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">내 판매 상품</h2>
          <SalesTabs products={MOCK_SALES_PRODUCTS as any} />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
