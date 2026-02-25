/**
 * 구매 내역 페이지
 */

import { Link, Navigate } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import { useAuthStore } from '../stores/useAuthStore';
import { orderService } from '../services/orderService';
import { useState, useEffect } from 'react';
import type { OrderListResponse } from '../types/order';
import OrderHistoryCard from '../components/features/mypage/OrderHistoryCard';

const OrderHistoryPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchOrders = () => {
    const timeoutId = setTimeout(() => {
      setIsError(true);
      setIsLoading(false);
    }, 10000);

    orderService.getMyOrders()
      .then((res) => setOrders(res.content))
      .catch(() => setIsError(true))
      .finally(() => {
        clearTimeout(timeoutId);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isError) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <p className="text-neutral-500">주문 내역을 불러오는데 실패했습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-2xl px-3 min-[360px]:px-4">
        <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
          <Link
            to="/mypage"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">구매 내역</h1>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-neutral-500 mb-4">구매 내역이 없습니다</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
            >
              상품 보러가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderHistoryCard key={order.orderUuid} order={order} onUpdate={fetchOrders} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
