/**
 * 관리자 대시보드 페이지
 */

import { DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import StatsCard from '@/components/features/admin/StatsCard';

// Mock 통계 데이터
const MOCK_STATS = {
  totalRevenue: 15280000,
  newUsers: 128,
  totalProducts: 3542,
  totalOrders: 892,
};

const AdminDashboardPage = () => {
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
          value={`${(MOCK_STATS.totalRevenue / 10000).toLocaleString()}만원`}
          change={{ value: 12.5, isPositive: true }}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          icon={Users}
          label="신규 가입자 (이번 달)"
          value={MOCK_STATS.newUsers.toLocaleString()}
          change={{ value: 8.2, isPositive: true }}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          icon={Package}
          label="등록 상품"
          value={MOCK_STATS.totalProducts.toLocaleString()}
          change={{ value: 3.1, isPositive: true }}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatsCard
          icon={ShoppingCart}
          label="총 주문"
          value={MOCK_STATS.totalOrders.toLocaleString()}
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">주문 #{1000 + i}</p>
                    <p className="text-xs text-neutral-500">2분 전</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-900">
                  {(50000 + i * 10000).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 가입자 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">최근 가입자</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">U{i}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">사용자{i}</p>
                    <p className="text-xs text-neutral-500">user{i}@example.com</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-500">{i * 5}분 전</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
