/**
 * 관리자 대시보드 페이지
 * 
 * Mock 데이터에서 실제 통계를 계산하여 표시합니다.
 */

import { useMemo } from 'react';
import { DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import StatsCard from '@/components/features/admin/StatsCard';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_USERS_DATA, MOCK_ORDER_HISTORY } from '@/mocks/users';

const AdminDashboardPage = () => {
  // Mock 데이터에서 실제 통계 계산
  const stats = useMemo(() => {
    // 총 거래액: 구매확정(CONFIRMED) 주문의 합계
    const confirmedOrders = MOCK_ORDER_HISTORY.filter(o => o.status === 'CONFIRMED');
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalPrice + o.shippingFee, 0);
    
    // 신규 가입자: 최근 30일 내 가입한 사용자
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = MOCK_USERS_DATA.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;
    
    // 등록 상품: 전체 상품 수
    const totalProducts = MOCK_PRODUCTS.length;
    
    // 총 주문: 전체 주문 수
    const totalOrders = MOCK_ORDER_HISTORY.length;
    
    return { totalRevenue, newUsers, totalProducts, totalOrders };
  }, []);
  
  // 최근 주문 5개 (최신순)
  const recentOrders = useMemo(() => {
    return [...MOCK_ORDER_HISTORY]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);
  
  // 최근 가입자 5명 (최신순)
  const recentUsers = useMemo(() => {
    return [...MOCK_USERS_DATA]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);
  
  // 시간 포맷 함수
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 30) return `${diffDays}일 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };
  
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">대시보드</h1>
        <p className="text-neutral-500 mt-1">플랫폼 운영 현황을 확인하세요</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={DollarSign}
          label="총 거래액"
          value={`${(stats.totalRevenue / 10000).toLocaleString()}만원`}
          change={{ value: 12.5, isPositive: true }}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          icon={Users}
          label="신규 가입자 (이번 달)"
          value={stats.newUsers.toLocaleString()}
          change={{ value: 8.2, isPositive: true }}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          icon={Package}
          label="등록 상품"
          value={stats.totalProducts.toLocaleString()}
          change={{ value: 3.1, isPositive: true }}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatsCard
          icon={ShoppingCart}
          label="총 주문"
          value={stats.totalOrders.toLocaleString()}
          change={{ value: 5.4, isPositive: true }}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* 최근 활동 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 주문 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">최근 주문</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  <img 
                    src={order.product.image} 
                    alt={order.product.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 truncate max-w-[150px]">
                      {order.product.title}
                    </p>
                    <p className="text-xs text-neutral-500">{formatTimeAgo(order.createdAt)}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-900">
                  {(order.totalPrice + order.shippingFee).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 가입자 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">최근 가입자</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {user.nickname.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{user.nickname}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-500">{formatTimeAgo(user.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
