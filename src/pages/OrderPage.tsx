/**
 * 주문서 작성 페이지
 */

import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';

import OrderItemList from '../components/features/order/OrderItemList';
import ShippingInfoForm from '../components/features/order/ShippingInfoForm';
import OrderSummary from '../components/features/order/OrderSummary';
import DepositUseForm from '../components/features/order/DepositUseForm';
import { CouponSelector, calculateCouponDiscount, type UserCoupon } from '../components/features/order/CouponSelector';
import { useToast } from '../components/common/Toast';

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  
  const { 
    orderItems, 
    shippingInfo, 
    depositUseAmount,
    setShippingInfo,
    setOrderUuid,
    setOrderResponseItems,
    setCouponUuid,
    setCouponDiscountAmount,
    setDepositUseAmount,
    getOrderSummary
  } = useOrderStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);

  useEffect(() => {
    setCouponUuid(null);
    setCouponDiscountAmount(0);
  }, [setCouponUuid, setCouponDiscountAmount]);

  // 주문할 상품이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (orderItems.length === 0) {
      showToast('주문할 상품이 없습니다.', 'error');
      navigate('/', { replace: true });
    }
  }, [orderItems, navigate, showToast]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (orderItems.length === 0) {
    return null; // useEffect에서 처리됨
  }

  const { totalProductPrice, totalShippingFee, finalPrice } = getOrderSummary();
  
  // 쿠폰 할인 계산
  const couponDiscount = calculateCouponDiscount(selectedCoupon, totalProductPrice);
  const finalPriceWithCoupon = finalPrice;
  
  // 배송지 유효성 검사 (MVP: 직접 입력 시 필수 필드 체크)
  const isFormValid = !!(
    shippingInfo?.recipient &&
    shippingInfo?.phone &&
    shippingInfo?.zipCode &&
    shippingInfo?.address &&
    shippingInfo?.detailAddress
  );

  const handlePayment = async () => {
    if (!isFormValid || !shippingInfo) return;

    setIsLoading(true);
    
    try {
      // 실데이터 연동: 백엔드 주문 생성 API 호출
      const orderRequest = {
        address: `${shippingInfo.address} ${shippingInfo.detailAddress}`,
        recipient: shippingInfo.recipient,
        contactNumber: shippingInfo.phone,
        items: orderItems.map(item => ({
          productUuid: item.productUuid,
          sellerUuid: '00000000-0000-0000-0000-000000000000', // FIXME: 백엔드 CartDto에 sellerUuid 부재로 임시 처리
          productName: item.title,
          productPrice: item.price,
          imageUrl: item.thumbnailUrl || ''
        }))
      };

      const orderService = (await import('../services/orderService')).orderService;
      const response = await orderService.createOrder(orderRequest);
      
      setOrderUuid(response.orderUuid);
      setOrderResponseItems(response.items); // 주문 응답의 items 저장 (결제 요청에 사용)
      setCouponUuid(selectedCoupon?.uuid || null);
      
      // 토스 결제 위젯 페이지로 이동
      navigate('/checkout');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      showToast(error.response?.data?.message || '주문 생성에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">주문서 작성</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 배송지 정보 (직접 입력) */}
            <ShippingInfoForm 
              shippingInfo={shippingInfo} 
              onUpdate={setShippingInfo} 
            />

            {/* 주문 상품 */}
            <OrderItemList items={orderItems} />

            <CouponSelector
              orderAmount={totalProductPrice}
              selectedCoupon={selectedCoupon}
              onSelectCoupon={(coupon) => {
                setSelectedCoupon(coupon);
                setCouponUuid(coupon?.uuid ?? null);
                setCouponDiscountAmount(coupon ? calculateCouponDiscount(coupon, totalProductPrice) : 0);
              }}
            />

            {/* 예치금 사용 */}
            <DepositUseForm
              balance={(user as any)?.deposit || 0}
              useAmount={depositUseAmount}
              onUseAmountChange={setDepositUseAmount}
              maxUseAmount={finalPriceWithCoupon}
            />
          </div>

          {/* 오른쪽: 결제 요약 (Sticky) */}
          <div className="lg:col-span-1">
            <OrderSummary
              productPrice={totalProductPrice}
              shippingFee={totalShippingFee}
              couponDiscount={couponDiscount}
              depositUseAmount={depositUseAmount}
              finalPrice={Math.max(0, finalPriceWithCoupon - depositUseAmount)}
              disabled={!isFormValid}
              onPayment={handlePayment}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

