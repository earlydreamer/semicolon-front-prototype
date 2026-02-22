/**
 * 二쇰Ц ?댁뿭 移대뱶 而댄룷?뚰듃
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
import { ReturnRequestModal } from './ReturnRequestModal';
import { ReturnTrackingModal } from './ReturnTrackingModal';
import { orderService } from '@/services/orderService';

interface OrderHistoryCardProps {
  order: OrderHistory | OrderListResponse;
  onUpdate?: () => void;
}

const OrderHistoryCard = ({ order, onUpdate }: OrderHistoryCardProps) => {
  const { showToast } = useToast();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReturnRequestModal, setShowReturnRequestModal] = useState(false);
  const [showReturnTrackingModal, setShowReturnTrackingModal] = useState(false);

  // API ?곗씠???щ? ?뺤씤 諛??듯빀 留ㅽ븨
  const isApiData = 'orderUuid' in order;
  const id = isApiData ? (order as OrderListResponse).orderUuid : (order as OrderHistory).id;
  const createdAt = isApiData ? (order as OrderListResponse).orderDate : (order as OrderHistory).createdAt;
  const status = isApiData ? (order as OrderListResponse).status : (order as OrderHistory).status;
  const totalAmount = isApiData ? (order as OrderListResponse).totalAmount : (order as OrderHistory).totalPrice;
  
  // 泥?踰덉㎏ ?꾩씠???뺣낫瑜???쒕줈 ?ъ슜 (API??寃쎌슦)
  const productId = isApiData 
    ? (order as OrderListResponse).items[0]?.productUuid 
    : (order as OrderHistory).productId;

  const title = isApiData ? (order as OrderListResponse).items[0]?.productName : (order as OrderHistory).product.title;
  const image = isApiData ? (order as OrderListResponse).items[0]?.imageUrl : (order as OrderHistory).product.image;
  const sellerNickname = isApiData ? '?먮ℓ?? : (order as OrderHistory).product.seller.nickname;

  const statusInfo = ORDER_STATUS_LABELS[status] || { text: status, className: 'bg-neutral-100 text-neutral-600' };

  // 媛쒕퀎 ?꾩씠???곹깭 ?뺤씤 (API ?곗씠?곗씤 寃쎌슦)
  const itemStatus = isApiData ? (order as OrderListResponse).items[0]?.itemStatus : undefined;

  // 諛곗넚 ?뺣낫 (API / 濡쒖뺄 怨듯넻)
  const carrierName = isApiData
    ? (order as OrderListResponse).items[0]?.carrierName
    : (order as OrderHistory).deliveryCompany;
  const trackingNumber = isApiData
    ? (order as OrderListResponse).items[0]?.trackingNumber
    : (order as OrderHistory).trackingNumber;
  const showDelivery = !!trackingNumber && ['SHIPPED', 'DELIVERED', 'CONFIRMED', 'CONFIRM_PENDING', 'SHIPPING'].includes(itemStatus ?? status);
  
  // 援щℓ ?뺤젙 媛???щ? - ?꾩씠???곹깭 湲곗?
  const canConfirm = itemStatus === 'DELIVERED' || itemStatus === 'CONFIRM_PENDING';
  // 痍⑥냼 媛???щ? - 二쇰Ц ?곹깭 湲곗?
  const canCancel = status === 'PENDING' || status === 'PAID';
  // 諛섑뭹 ?좎껌 媛???щ?
  const canReturn = itemStatus === 'DELIVERED';
  // ?댁넚???깅줉 媛???щ? (UI ?곕え??Mock 議곌굔: REFUND_REQUESTED ?대㈃ ?몄텧)
  const canRegisterTracking = itemStatus === 'REFUND_REQUESTED' || itemStatus === 'REFUND_IN_PROGRESS';

  const orderItemUuid = isApiData ? (order as OrderListResponse).items[0]?.orderItemUuid : undefined;

  const handleConfirm = async () => {
    if (!orderItemUuid) return;
    try {
      await orderService.updateOrderItemStatus(orderItemUuid, 'CONFIRMED');
      showToast('援щℓ媛 ?뺤젙?섏뿀?듬땲?? 由щ럭瑜??묒꽦?댁＜?몄슂.', 'success');
      setShowReviewModal(true);
      onUpdate?.();
    } catch {
      showToast('援щℓ ?뺤젙???ㅽ뙣?덉뒿?덈떎.', 'error');
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
  };

  const handleCancel = async () => {
    if (!orderItemUuid) return;
    try {
      await orderService.updateOrderItemStatus(orderItemUuid, 'CANCELED');
      showToast('二쇰Ц??痍⑥냼?섏뿀?듬땲??', 'success');
      onUpdate?.();
    } catch {
      showToast('二쇰Ц 痍⑥냼???ㅽ뙣?덉뒿?덈떎.', 'error');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        {/* ?곷떒: 二쇰Ц ?뺣낫 */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-100">
          <div className="text-xs text-neutral-500">
            <span>二쇰Ц踰덊샇 {id}</span>
            <span className="mx-2">??/span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* ?곹뭹 ?뺣낫 */}
        <div className="flex gap-4">
          <Link
            to={`/products/${productId}`}
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
            <Link
              to={`/products/${productId}`}
              className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-xs text-neutral-500 mt-1">
              ?먮ℓ?? {sellerNickname}
            </p>
            <p className="text-base font-bold text-neutral-900 mt-2">
              {formatPrice(totalAmount)}
              {!isApiData && (order as OrderHistory).shippingFee > 0 && (
                <span className="text-xs font-normal text-neutral-500 ml-1">
                  (諛곗넚鍮??ы븿)
                </span>
              )}
            </p>
            
            {/* ?댁넚???뺣낫 (諛곗넚以?諛곗넚?꾨즺/援щℓ?뺤젙 ???몄텧) */}
            {showDelivery && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium leading-none mb-1">諛곗넚?뺣낫</p>
                  <p className="text-xs font-semibold text-neutral-700">
                    {carrierName} {trackingNumber}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-3 border-neutral-300 text-neutral-600 hover:bg-white"
                  onClick={() => window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(carrierName ?? '')}+${encodeURIComponent(trackingNumber ?? '')}`, '_blank')}
                >
                  諛곗넚 議고쉶
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ?≪뀡 踰꾪듉 */}
        {(canConfirm || canCancel || canReturn || canRegisterTracking) && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100 flex-wrap">
            {canConfirm && (
              <Button size="sm" onClick={handleConfirm} className="flex-1 min-w-[120px]">
                援щℓ ?뺤젙 諛?由щ럭 ?묒꽦
              </Button>
            )}
            {canCancel && (
              <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1 min-w-[80px]">
                二쇰Ц 痍⑥냼
              </Button>
            )}
            {canReturn && (
              <Button size="sm" variant="outline" onClick={() => setShowReturnRequestModal(true)} className="flex-1 min-w-[80px]">
                諛섑뭹 ?좎껌
              </Button>
            )}
            {canRegisterTracking && (
              <Button size="sm" variant="outline" onClick={() => setShowReturnTrackingModal(true)} className="flex-1 min-w-[100px]">
                ?댁넚???깅줉
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 由щ럭 ?묒꽦 紐⑤떖 */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="由щ럭 ?묒꽦"
      >
        <ReviewForm
          orderId={id}
          productTitle={title}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewModal(false)}
        />
      </Modal>

      {/* 諛섑뭹 ?좎껌 紐⑤떖 */}
      {isApiData && (
        <ReturnRequestModal
          isOpen={showReturnRequestModal}
          onClose={() => setShowReturnRequestModal(false)}
          order={order as OrderListResponse}`r`n        />
      )}

      {/* 諛섑뭹 ?댁넚???깅줉 紐⑤떖 */}
      {isApiData && (
        <ReturnTrackingModal
          isOpen={showReturnTrackingModal}
          onClose={() => setShowReturnTrackingModal(false)}
          returnRequestUuid="mock-return-uuid"
        />
      )}
    </>
  );
};

export default OrderHistoryCard;

