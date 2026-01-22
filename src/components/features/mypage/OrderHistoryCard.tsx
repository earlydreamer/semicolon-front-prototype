/**
 * 주문 내역 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { OrderHistory } from '@/types/user';
import type { OrderListResponse } from '@/types/order';
import { ORDER_STATUS_LABELS } from '@/constants/labels';
import { formatTimeAgo } from '@/utils/date';
import { formatPrice } from '@/utils/formatPrice';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { ReviewForm } from '../review/ReviewForm';

interface OrderHistoryCardProps {
  order: OrderHistory | OrderListResponse;
}

const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
  const { showToast } = useToast();
  const [showReviewModal, setShowReviewModal] = useState(false);

  // API 데이터 여부 확인 및 통합 매핑
  const isApiData = 'orderUuid' in order;
  const id = isApiData ? (order as OrderListResponse).orderUuid : (order as OrderHistory).id;
  const createdAt = isApiData ? (order as OrderListResponse).orderDate : (order as OrderHistory).createdAt;
  const status = isApiData ? (order as OrderListResponse).status : (order as OrderHistory).status;
  const totalAmount = isApiData ? (order as OrderListResponse).totalAmount : (order as OrderHistory).totalPrice;
  
  // 첫 번째 아이템 정보를 대표로 사용 (API의 경우)
  const productId = isApiData 
    ? (order as OrderListResponse).items[0]?.productUuid 
    : (order as OrderHistory).productId;

  const title = isApiData ? (order as OrderListResponse).items[0]?.productName : (order as OrderHistory).product.title;
  const image = isApiData ? (order as OrderListResponse).items[0]?.imageUrl : (order as OrderHistory).product.image;
  const sellerNickname = isApiData ? '판매자' : (order as OrderHistory).product.seller.nickname;

  const statusInfo = ORDER_STATUS_LABELS[status] || { text: status, className: 'bg-neutral-100 text-neutral-600' };

  // 구매 확정 가능 여부
  const canConfirm = status === 'DELIVERED';
  // 취소 가능 여부
  const canCancel = status === 'PENDING' || status === 'PAID';

  const handleConfirm = () => {
    setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
  };

  const handleCancel = () => {
    showToast('주문 취소 기능은 준비 중입니다', 'info');
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        {/* 상단: 주문 정보 */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-100">
          <div className="text-xs text-neutral-500">
            <span>주문번호 {id}</span>
            <span className="mx-2">•</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* 상품 정보 */}
        <div className="flex gap-4">
          <Link
            to={`/products/${productId}`}
            className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
          >
            <img
              src={image || '/images/placeholder.png'}
              alt={title}
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              to={`/products/${productId}`}
              className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-xs text-neutral-500 mt-1">
              판매자: {sellerNickname}
            </p>
            <p className="text-base font-bold text-neutral-900 mt-2">
              {formatPrice(totalAmount)}
              {!isApiData && (order as OrderHistory).shippingFee > 0 && (
                <span className="text-xs font-normal text-neutral-500 ml-1">
                  (배송비 포함)
                </span>
              )}
            </p>
            
            {/* 운송장 정보 (배송중/배송완료/구매확정 시 노출) */}
            {(!isApiData && (order as OrderHistory).trackingNumber && (['SHIPPING', 'DELIVERED', 'CONFIRMED'].includes(status))) && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium leading-none mb-1">배송정보</p>
                  <p className="text-xs font-semibold text-neutral-700">
                    {(order as OrderHistory).deliveryCompany} {(order as OrderHistory).trackingNumber}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-[11px] px-3 border-neutral-300 text-neutral-600 hover:bg-white"
                  onClick={() => window.open(`https://search.naver.com/search.naver?query=${(order as OrderHistory).deliveryCompany}+${(order as OrderHistory).trackingNumber}`, '_blank')}
                >
                  배송 조회
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        {(canConfirm || canCancel) && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100">
            {canConfirm && (
              <Button size="sm" onClick={handleConfirm} className="flex-1">
                구매 확정 및 리뷰 작성
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

      {/* 리뷰 작성 모달 */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="리뷰 작성"
      >
        <ReviewForm
          orderId={id}
          productTitle={title}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewModal(false)}
        />
      </Modal>
    </>
  );
};

export default OrderHistoryCard;
