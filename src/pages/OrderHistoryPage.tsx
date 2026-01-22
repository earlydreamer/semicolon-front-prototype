/**
 * 구매 내역 페이지
 */

import { Link, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { orderService } from '../services/orderService';
import { useState, useEffect } from 'react';
import type { OrderListResponse } from '../types/order';
import OrderHistoryCard from '../components/features/mypage/OrderHistoryCard';

const OrderHistoryPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      orderService.getMyOrders()
        .then(res => setOrders(res.content))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/mypage"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">구매 내역</h1>
        </div>

        {/* 주문 목록 */}
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500 mb-4">구매 내역이 없습니다</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderHistoryCard key={order.orderUuid} order={order as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
