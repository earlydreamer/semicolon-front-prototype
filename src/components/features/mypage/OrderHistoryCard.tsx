/**
 * 주문 내역 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { OrderHistory } from '../../../mocks/users';
import { ORDER_STATUS_LABELS } from '../../../mocks/users';
import { formatTimeAgo } from '../../../utils/date';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';

interface OrderHistoryCardProps {
  order: OrderHistory;
}

const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
  const { showToast } = useToast();
  const statusInfo = ORDER_STATUS_LABELS[order.status];

  // 구매 확정 가능 여부
  const canConfirm = order.status === 'DELIVERED';
  // 취소 가능 여부
  const canCancel = order.status === 'PENDING' || order.status === 'PAID';

  const handleConfirm = () => {
    showToast('구매 확정 기능은 준비 중입니다', 'info');
  };

  const handleCancel = () => {
    showToast('주문 취소 기능은 준비 중입니다', 'info');
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      {/* 상단: 주문 정보 */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-100">
        <div className="text-xs text-neutral-500">
          <span>주문번호 {order.id}</span>
          <span className="mx-2">•</span>
          <span>{formatTimeAgo(order.createdAt)}</span>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="flex gap-4">
        <Link
          to={`/products/${order.productId}`}
          className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
        >
          <img
            src={order.product.image}
            alt={order.product.title}
            className="w-full h-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${order.productId}`}
            className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
          >
            {order.product.title}
          </Link>
          <p className="text-xs text-neutral-500 mt-1">
            판매자: {order.product.seller.nickname}
          </p>
          <p className="text-base font-bold text-neutral-900 mt-2">
            {order.totalPrice.toLocaleString('ko-KR')}원
            {order.shippingFee > 0 && (
              <span className="text-xs font-normal text-neutral-500 ml-1">
                (배송비 포함)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      {(canConfirm || canCancel) && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100">
          {canConfirm && (
            <Button size="sm" onClick={handleConfirm} className="flex-1">
              구매 확정
            </Button>
          )}
          {canCancel && (
            <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1">
              주문 취소
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
