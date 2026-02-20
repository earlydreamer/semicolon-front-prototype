import { useCallback, useEffect, useMemo, useState } from 'react';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import CircleOff from 'lucide-react/dist/esm/icons/circle-off';
import Info from 'lucide-react/dist/esm/icons/info';
import Clock from 'lucide-react/dist/esm/icons/clock';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import UserRound from 'lucide-react/dist/esm/icons/user-round';
import { Button } from '@/components/common/Button';
import StatsCard from '@/components/features/admin/StatsCard';
import { adminService } from '@/services/adminService';
import { couponService } from '@/services/couponService';
import type { AdminSettlementStatisticsResponse } from '@/types/admin';
import type { OrderListResponse } from '@/types/order';

interface DashboardData {
  orders: OrderListResponse[];
  totalOrders: number;
  settlementStats: AdminSettlementStatisticsResponse;
  couponCount: number;
  loadedAt: string;
}

const BACKEND_MISSING_ITEMS = [
  '관리자 회원 목록/검색 API',
  '신고 목록/처리 API',
  '배너 CRUD 및 순서 저장 API',
  '카테고리 관리자 CRUD API',
  '상품 정지/삭제 관리자 API',
];

const formatCurrency = (value: number) => `${new Intl.NumberFormat('ko-KR').format(value)}원`;
const parseDate = (value: string) => {
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const formatDateTime = (value: string) => parseDate(value)?.toLocaleString('ko-KR') ?? '-';

const AdminDashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [ordersPage, settlementStats, coupons] = await Promise.all([
        adminService.getAdminOrders({ page: 0, size: 20 }),
        adminService.getAdminSettlementStatistics(),
        couponService.getAdminCoupons(),
      ]);

      setData({
        orders: ordersPage.content,
        totalOrders: ordersPage.totalElements,
        settlementStats,
        couponCount: coupons.length,
        loadedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
      setErrorMessage('대시보드 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const recentOrders = useMemo(() => data?.orders.slice(0, 5) ?? [], [data?.orders]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">대시보드</h1>
        <p className="text-neutral-500 mt-1">실데이터 기반 관리자 지표를 확인합니다.</p>
      </div>

      <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-neutral-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">마지막 로드:</span>
            <span>{data ? new Date(data.loadedAt).toLocaleString('ko-KR') : '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Info className="w-4 h-4" />
            <span className="font-medium">통계 기준:</span>
            <span>정산/주문/쿠폰 API 실시간 조회</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-neutral-500" role="status" aria-live="polite">
          대시보드를 불러오는 중입니다…
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <Button variant="outline" onClick={() => void loadDashboard()}>
            다시 시도
          </Button>
        </div>
      ) : data ? (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 min-[360px]:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={DollarSign}
              label="누적 정산금액"
              value={formatCurrency(data.settlementStats.totalSettlementAmount)}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatsCard
              icon={ShoppingCart}
              label="전체 주문 수"
              value={`${new Intl.NumberFormat('ko-KR').format(data.totalOrders)}건`}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatsCard
              icon={Ticket}
              label="관리 쿠폰 수"
              value={`${new Intl.NumberFormat('ko-KR').format(data.couponCount)}개`}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <StatsCard
              icon={CircleOff}
              label="정산 실패 건수"
              value={`${new Intl.NumberFormat('ko-KR').format(data.settlementStats.failedCount)}건`}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">최근 주문</h2>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const firstItem = order.items[0];
                    return (
                      <div key={order.orderUuid} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          {firstItem?.imageUrl ? (
                            <img
                              src={firstItem.imageUrl}
                              alt={firstItem.productName}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-100" aria-hidden="true" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {firstItem?.productName ?? '주문 상품'}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatDateTime(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-neutral-900">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">최근 주문 데이터가 없습니다.</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">백엔드 미구현 항목</h2>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-4">
                <div className="flex items-start gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
                  <p className="text-sm">
                    아래 항목은 관리자 실데이터 전환을 위해 백엔드 API 구현이 추가로 필요합니다.
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {BACKEND_MISSING_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                    <UserRound className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;
