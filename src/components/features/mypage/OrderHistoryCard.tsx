/**
 * 주문 내역 카드 컴포넌트
 */

import { Link, useNavigate } from 'react-router-dom';
import type { OrderHistory } from '@/types/user';
import type { OrderListResponse } from '@/types/order';
import { ORDER_STATUS_LABELS, ORDER_ITEM_STATUS_LABELS } from '@/constants/labels';
import { formatTimeAgo } from '@/utils/date';
import { formatPrice } from '@/utils/formatPrice';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { ReviewForm } from '../review/ReviewForm';
import { ReturnRequestModal } from './ReturnRequestModal';
import { ReturnTrackingModal } from './ReturnTrackingModal';
import { orderService } from '@/services/orderService';
import { useOrderStore } from '@/stores/useOrderStore';
import { openNaverTrackingSearch, validateTrackingNumber } from '@/utils/shippingTracking';
import { parseHttpError } from '@/utils/httpError';

interface OrderHistoryCardProps {
  order: OrderHistory | OrderListResponse;
  onUpdate?: () => void;
}

const OrderHistoryCard = ({ order, onUpdate }: OrderHistoryCardProps) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    setOrderUuid,
    setOrderItems,
    setOrderResponseItems,
    setCouponUuid,
    setCouponDiscountAmount,
    setDepositUseAmount,
  } = useOrderStore();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showReturnRequestModal, setShowReturnRequestModal] = useState(false);
  const [showReturnTrackingModal, setShowReturnTrackingModal] = useState(false);
  const [returnRequestUuid, setReturnRequestUuid] = useState<string | null>(
    (order as OrderListResponse).returnRequestUuid ?? null,
  );
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const isApiData = 'orderUuid' in order || 'items' in order;
  const id = isApiData ? (order as OrderListResponse).orderUuid : (order as OrderHistory).id;
  const createdAt = isApiData ? (order as OrderListResponse).orderDate : (order as OrderHistory).createdAt;
  const status = (isApiData
    ? (order as OrderListResponse).status
    : (order as OrderHistory).status) ?? 'PENDING';
  const totalAmount = isApiData
    ? (order as OrderListResponse).totalAmount
    : (order as OrderHistory).totalPrice;

  const firstItem = isApiData ? (order as OrderListResponse).items?.[0] : undefined;
  const productUuid = isApiData ? firstItem?.productUuid : (order as OrderHistory).productUuid;
  const title = isApiData ? firstItem?.productName : (order as OrderHistory).product?.title;
  const image = isApiData ? firstItem?.imageUrl : (order as OrderHistory).product?.image;
  const sellerNickname = isApiData ? '판매자' : (order as OrderHistory).product?.seller?.nickname;

  const statusInfo = ORDER_STATUS_LABELS[status] || {
    text: status,
    className: 'bg-neutral-100 text-neutral-600',
  };

  const itemStatus = isApiData ? firstItem?.itemStatus : undefined;
  const returnStatus = isApiData ? (order as OrderListResponse).returnStatus : undefined;
  const returnCarrierName = isApiData ? (order as OrderListResponse).returnCarrierName : undefined;
  const returnTrackingNumber = isApiData ? (order as OrderListResponse).returnTrackingNumber : undefined;

  const itemStatusInfo = isApiData && itemStatus
    ? (ORDER_ITEM_STATUS_LABELS[itemStatus] ?? { text: itemStatus, className: 'bg-neutral-100 text-neutral-700' })
    : (ORDER_STATUS_LABELS[status] ?? { text: status, className: 'bg-neutral-100 text-neutral-600' });

  const carrierName = isApiData ? firstItem?.carrierName : (order as OrderHistory).deliveryCompany;
  const trackingNumber = isApiData ? firstItem?.trackingNumber : (order as OrderHistory).trackingNumber;

  const deliveryStatusMatch = itemStatus
    ? ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CONFIRMED'].includes(itemStatus)
    : ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CONFIRMED'].includes(status as string);

  const showDelivery = !!trackingNumber && deliveryStatusMatch;
  const trackingValidation = validateTrackingNumber(undefined, carrierName, trackingNumber);
  const showReturnTracking = !!returnTrackingNumber;
  const returnTrackingValidation = validateTrackingNumber(undefined, returnCarrierName, returnTrackingNumber);

  const canConfirm = itemStatus === 'DELIVERED';
  const closedItemStatuses = [
    'CANCELED',
    'CANCEL_REQUESTED',
    'REFUND_REQUESTED',
    'REFUND_IN_PROGRESS',
    'REFUND_COMPLETED',
    'CONFIRMED',
  ] as const;
  const isClosedItem = itemStatus
    ? closedItemStatuses.includes(itemStatus as typeof closedItemStatuses[number])
    : false;
  const nonCancelableItemStatuses = [
    'CANCELED',
    'CANCEL_REQUESTED',
    'SHIPPED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CONFIRMED',
    'REFUND_REQUESTED',
    'REFUND_IN_PROGRESS',
    'REFUND_COMPLETED',
  ] as const;
  const canCancelByItemStatus = itemStatus
    ? !nonCancelableItemStatuses.includes(itemStatus as typeof nonCancelableItemStatuses[number])
    : false;
  const canCancelByOrderStatusFallback = !isClosedItem && (status === 'PENDING' || status === 'PAID');
  // 아이템 상태가 있으면 최우선 사용하고, 없으면 레거시 응답을 위한 주문 상태로 대체 처리한다.
  const canCancel = itemStatus ? canCancelByItemStatus : canCancelByOrderStatusFallback;
  const canReturn = itemStatus === 'DELIVERED';
  const isWaitingSellerFirstApproval = returnStatus
    ? returnStatus === 'RETURN_REQUESTED'
    : itemStatus === 'REFUND_REQUESTED';
  const canRegisterTracking = returnStatus
    ? returnStatus === 'RETURN_SELLER_APPROVED'
    : itemStatus === 'REFUND_IN_PROGRESS';
  const isReturnTrackingRegistered = !!returnStatus && [
    'RETURN_SHIPPED',
    'RETURN_RECEIVED',
    'RETURN_APPROVED',
    'RETURN_COMPLETED',
    'RETURN_REJECTED_AFTER_SHIPMENT',
  ].includes(returnStatus);
  const canResumePayment = status === 'PENDING' && !isClosedItem;

  const orderItemUuid = isApiData ? (order as OrderListResponse).items[0]?.orderItemUuid : undefined;

  const handleConfirm = async () => {
    if (!orderItemUuid) return;

    setIsConfirmLoading(true);
    try {
      await orderService.updateOrderItemStatus(orderItemUuid, 'CONFIRMED');
      showToast('구매 확정이 완료됐어요. 리뷰를 작성해 주세요.', 'success');
      setShowReviewModal(true);
      onUpdate?.();
    } catch (error) {
      showToast(parseHttpError(error, '구매 확정에 실패했어요.'), 'error');
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
  };

  const handleCancel = async () => {
    try {
      setIsCancelLoading(true);
      let targetOrderItemUuid = orderItemUuid;

      // 결제 대기 주문 등 일부 케이스에서 아이템 UUID가 없는 경우 주문 상세를 다시 조회해 보완한다.
      if (!targetOrderItemUuid && id && typeof id === 'string') {
        const orderDetail = await orderService.getOrder(id);
        targetOrderItemUuid = orderDetail.items?.[0]?.orderItemUuid;
      }

      if (!targetOrderItemUuid) {
        showToast('취소할 주문 상품 정보를 찾을 수 없어요.', 'error');
        return;
      }

      await orderService.updateOrderItemStatus(targetOrderItemUuid, 'CANCEL_REQUESTED');
      showToast('주문을 취소했어요.', 'success');
      setShowCancelConfirmModal(false);
      onUpdate?.();
    } catch (error) {
      showToast(
        parseHttpError(
          error,
          '주문 취소에 실패했어요. 잠시 후 다시 시도해 주세요.',
        ),
        'error',
      );
    } finally {
      setIsCancelLoading(false);
    }
  };

  const handleResumePayment = async () => {
    if (!id || typeof id !== 'string') return;

    try {
      setIsResumeLoading(true);
      const orderDetail = await orderService.getOrder(id);

      if (orderDetail.orderStatus !== 'PENDING') {
        showToast('이미 처리된 주문입니다. 상태를 새로고침합니다.', 'info');
        onUpdate?.();
        return;
      }

      if (!orderDetail.items || orderDetail.items.length === 0) {
        showToast('주문 상품 정보를 찾을 수 없어요.', 'error');
        return;
      }

      const restoredOrderItems = orderDetail.items.map((item, index) => ({
        cartId: -(index + 1),
        productUuid: item.productUuid,
        sellerUuid: item.sellerUuid,
        title: item.productName,
        price: item.productPrice,
        saleStatus: 'ON_SALE' as const,
        thumbnailUrl: item.imageUrl ?? null,
        createdAt: orderDetail.orderedAt,
        selected: true,
      }));

      setOrderUuid(orderDetail.orderUuid);
      setOrderItems(restoredOrderItems);
      setOrderResponseItems(orderDetail.items.map((item) => ({
        orderItemUuid: item.orderItemUuid,
        productUuid: item.productUuid,
        sellerUuid: item.sellerUuid,
        productName: item.productName,
        productPrice: item.productPrice,
        imageUrl: item.imageUrl,
      })));
      setCouponUuid(null);
      setCouponDiscountAmount(0);
      setDepositUseAmount(0);

      navigate('/checkout');
    } catch {
      showToast('결제 페이지 진입에 실패했어요.', 'error');
    } finally {
      setIsResumeLoading(false);
    }
  };

  const handleOpenReturnTrackingModal = async () => {
    if (returnRequestUuid) {
      setShowReturnTrackingModal(true);
      return;
    }

    showToast('반품 요청 정보를 찾을 수 없어요. 목록을 새로고침해 주세요.', 'error');
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-100">
          <div className="text-xs text-neutral-500">
            <span>주문번호 {id}</span>
            <span className="mx-2">|</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            to={`/products/${productUuid}`}
            className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
          >
            <img
              src={image || '/images/placeholder.png'}
              alt={title}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="flex-1 min-w-0">
            {itemStatusInfo && (
              <span className={`inline-block mb-1 px-2 py-0.5 text-[10px] font-medium rounded ${itemStatusInfo.className}`}>
                {itemStatusInfo.text}
              </span>
            )}
            <Link
              to={`/products/${productUuid}`}
              className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-xs text-neutral-500 mt-1">판매자 {sellerNickname}</p>
            <p className="text-base font-bold text-neutral-900 mt-2">
              {formatPrice(totalAmount)}
              {!isApiData && (order as OrderHistory).shippingFee > 0 && (
                <span className="text-xs font-normal text-neutral-500 ml-1">(배송비 포함)</span>
              )}
            </p>

            {showDelivery && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium leading-none mb-1">배송정보</p>
                  <p className="text-xs font-semibold text-neutral-700">
                    {carrierName} {trackingNumber}
                  </p>
                  {!trackingValidation.valid && (
                    <p className="mt-1 text-[10px] font-medium text-red-600">
                      유효하지 않은 운송장
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-3 border-neutral-300 text-neutral-600 hover:bg-white"
                  disabled={!trackingValidation.valid}
                  onClick={() => {
                    const result = openNaverTrackingSearch(carrierName, trackingNumber);
                    if (!result.opened) {
                      showToast(result.hint, 'error');
                    }
                  }}
                >
                  배송 조회
                </Button>
              </div>
            )}

            {showReturnTracking && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-600 font-medium leading-none mb-1">반품 운송장</p>
                  <p className="text-xs font-semibold text-amber-900">
                    {returnCarrierName} {returnTrackingNumber}
                  </p>
                  {!returnTrackingValidation.valid && (
                    <p className="mt-1 text-[10px] font-medium text-red-600">
                      유효하지 않은 운송장
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-3 border-amber-200 text-amber-700 hover:bg-amber-100"
                  disabled={!returnTrackingValidation.valid}
                  onClick={() => {
                    const result = openNaverTrackingSearch(returnCarrierName, returnTrackingNumber);
                    if (!result.opened) {
                      showToast(result.hint, 'error');
                    }
                  }}
                >
                  배송 조회
                </Button>
              </div>
            )}
          </div>
        </div>

        {(canConfirm || canCancel || canReturn || canRegisterTracking || canResumePayment || isWaitingSellerFirstApproval) && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100 flex-wrap">
            {canResumePayment && (
              <Button size="sm" onClick={handleResumePayment} disabled={isResumeLoading} className="flex-1 min-w-[120px]">
                {isResumeLoading ? '이동 중...' : '결제 계속하기'}
              </Button>
            )}
            {canConfirm && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isConfirmLoading}
                className="flex-1 min-w-[120px]"
              >
                {isConfirmLoading ? '처리 중...' : '구매 확정 및 리뷰 작성'}
              </Button>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCancelConfirmModal(true)}
                className="flex-1 min-w-[80px]"
              >
                주문 취소
              </Button>
            )}
            {canReturn && (
              <Button size="sm" variant="outline" onClick={() => setShowReturnRequestModal(true)} className="flex-1 min-w-[80px]">
                반품 요청
              </Button>
            )}
            {(canRegisterTracking || isWaitingSellerFirstApproval) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenReturnTrackingModal}
                className="flex-1 min-w-[100px]"
                disabled={isWaitingSellerFirstApproval}
              >
                운송장 등록
              </Button>
            )}
            {isWaitingSellerFirstApproval && (
              <p className="w-full text-center text-xs text-neutral-500">
                판매자 승인 후 운송장을 등록할 수 있어요.
              </p>
            )}
            {isReturnTrackingRegistered && (
              <p className="w-full text-center text-xs text-neutral-500">
                반품 운송장이 등록되었어요.
              </p>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="리뷰 작성"
      >
        <ReviewForm
          orderId={id as string}
          productTitle={title || '상품'}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showCancelConfirmModal}
        onClose={() => {
          if (isCancelLoading) return;
          setShowCancelConfirmModal(false);
        }}
        title="주문 취소 확인"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            주문을 취소하시겠어요? 취소 후에는 결제를 다시 진행해야 합니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirmModal(false)}
              disabled={isCancelLoading}
            >
              닫기
            </Button>
            <Button onClick={handleCancel} disabled={isCancelLoading}>
              {isCancelLoading ? '취소 중...' : '확인'}
            </Button>
          </div>
        </div>
      </Modal>

      <ReturnRequestModal
        isOpen={showReturnRequestModal}
        onClose={() => setShowReturnRequestModal(false)}
        order={order as OrderListResponse}
        onSuccess={(uuid) => {
          setReturnRequestUuid(uuid);
          setShowReturnRequestModal(false);
          onUpdate?.();
        }}
      />

      {returnRequestUuid && (
        <ReturnTrackingModal
          isOpen={showReturnTrackingModal}
          onClose={() => setShowReturnTrackingModal(false)}
          returnRequestUuid={returnRequestUuid}
          onSuccess={() => onUpdate?.()}
        />
      )}
    </>
  );
};

export default OrderHistoryCard;


