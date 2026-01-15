/**
 * 관리자 대시보드 페이지
 * 
 * Mock 데이터에서 실제 통계를 계산하여 표시합니다.
 * 
 * 집계 기준:
 * - 매일 00:00 KST 기준으로 집계
 * - 변화율: 이번 달 vs 이전 달 동일 기간 비교
 */

import { useMemo } from 'react';
import { DollarSign, Users, Package, ShoppingCart, Clock, Calendar, Info } from 'lucide-react';
import StatsCard from '@/components/features/admin/StatsCard';
import { MOCK_ORDER_HISTORY, MOCK_USERS_DATA } from '@/mocks/users';
import { getDashboardStats, STATS_AGGREGATION_INFO } from '@/mocks/stats';

const AdminDashboardPage = () => {
  // Mock 데이터에서 통계 및 변화율 가져오기
  const dashboardStats = useMemo(() => getDashboardStats(), []);
  
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
  
  // 집계 시점 포맷
  const formatAggregationTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 00:00`;
  };
  
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">대시보드</h1>
        <p className="text-neutral-500 mt-1">플랫폼 운영 현황을 확인하세요</p>
      </div>
      
      {/* 집계 정보 배너 */}
      <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-neutral-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">마지막 집계:</span>
            <span>{formatAggregationTime(STATS_AGGREGATION_INFO.lastAggregatedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">집계 주기:</span>
            <span>{STATS_AGGREGATION_INFO.aggregationCycle}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Info className="w-4 h-4" />
            <span className="font-medium">집계 기간:</span>
            <span>{STATS_AGGREGATION_INFO.aggregationPeriod}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          * 변화율은 이번 달과 이전 달({STATS_AGGREGATION_INFO.comparisonPeriod}) 동일 기간을 비교한 값입니다.
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={DollarSign}
          label="총 거래액 (이번 달)"
          value={`${(dashboardStats.totalRevenue / 10000).toLocaleString()}만원`}
          change={dashboardStats.revenueChange}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          icon={Users}
          label="신규 가입자 (이번 달)"
          value={dashboardStats.newUsers.toLocaleString()}
          change={dashboardStats.usersChange}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          icon={Package}
          label="신규 상품 (이번 달)"
          value="8"
          change={dashboardStats.productsChange}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatsCard
          icon={ShoppingCart}
          label="신규 주문 (이번 달)"
          value="18"
          change={dashboardStats.ordersChange}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>
      
      {/* 누적 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-neutral-200 p-4 text-center">
          <p className="text-2xl font-bold text-neutral-900">{dashboardStats.totalProducts}</p>
          <p className="text-sm text-neutral-500">전체 등록 상품</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-4 text-center">
          <p className="text-2xl font-bold text-neutral-900">{dashboardStats.totalOrders}</p>
          <p className="text-sm text-neutral-500">전체 주문</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-4 text-center">
          <p className="text-2xl font-bold text-neutral-900">20</p>
          <p className="text-sm text-neutral-500">전체 회원</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-4 text-center">
          <p className="text-2xl font-bold text-neutral-900">22</p>
          <p className="text-sm text-neutral-500">전체 상점</p>
        </div>
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
