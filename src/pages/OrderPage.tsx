/**
 * 주문서 작성 페이지
 */

import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { ChevronLeft } from 'lucide-react';

import OrderItemList from '../components/features/order/OrderItemList';
import AddressSelector from '../components/features/order/AddressSelector';
import PaymentMethodSelector from '../components/features/order/PaymentMethodSelector';
import OrderSummary from '../components/features/order/OrderSummary';
import { CouponSelector, calculateCouponDiscount, type UserCoupon } from '../components/features/order/CouponSelector';
import { useToast } from '../components/common/Toast';

const OrderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  
  const { 
    orderItems, 
    shippingInfo, 
    paymentMethod,
    setShippingInfo,
    setPaymentMethod,
    setOrderUuid,
    setCouponUuid,
    setDepositUseAmount,
    getOrderSummary
  } = useOrderStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);

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
  const finalPriceWithCoupon = finalPrice - couponDiscount;
  
  const isFormValid = shippingInfo !== null && paymentMethod !== null;

  const handlePayment = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    
    // [STEP] 백엔드 주문 생성 시뮬레이션
    // 실제로는 여기서 API를 호출하여 DB에 주문을 넣고 orderUuid를 받아와야 함
    setTimeout(() => {
      const dummyOrderUuid = self.crypto.randomUUID();
      
      setOrderUuid(dummyOrderUuid);
      setCouponUuid(selectedCoupon?.id || null);
      setDepositUseAmount(0); // 예치금 사용 로직은 추후 확장
      
      setIsLoading(false);
      
      // 토스 결제 위젯 페이지로 이동
      navigate('/checkout');
    }, 1000);
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
            {/* 배송지 정보 */}
            <AddressSelector 
              selectedAddress={shippingInfo} 
              onSelect={setShippingInfo} 
            />

            {/* 주문 상품 */}
            <OrderItemList items={orderItems} />

            {/* 쿠폰 적용 */}
            <CouponSelector
              orderAmount={totalProductPrice}
              selectedCoupon={selectedCoupon}
              onSelectCoupon={setSelectedCoupon}
            />

            {/* 결제 수단 */}
            <PaymentMethodSelector 
              selectedMethod={paymentMethod} 
              onSelect={setPaymentMethod} 
            />
          </div>

          {/* 오른쪽: 결제 요약 (Sticky) */}
          <div className="lg:col-span-1">
            <OrderSummary
              productPrice={totalProductPrice}
              shippingFee={totalShippingFee}
              couponDiscount={couponDiscount}
              finalPrice={finalPriceWithCoupon}
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

