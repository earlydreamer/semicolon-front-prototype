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
    getOrderSummary
  } = useOrderStore();

  const [isLoading, setIsLoading] = useState(false);

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
  const isFormValid = shippingInfo !== null && paymentMethod !== null;

  const handlePayment = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    
    // 결제 처리 시뮬레이션 (1.5초)
    setTimeout(() => {
      setIsLoading(false);
      
      // 여기서 실제로는 API 호출로 주문 생성
      
      // 주문 성공 처리
      navigate('/order/complete');
      // 주문 완료 후 Store 정리는 OrderCompletePage 마운트 시 하거나 여기서 해도 됨
      // 여기서는 성공 페이지에서 정보를 보여줘야 하므로 아직 정리하지 않음
    }, 1500);
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
              finalPrice={finalPrice}
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
