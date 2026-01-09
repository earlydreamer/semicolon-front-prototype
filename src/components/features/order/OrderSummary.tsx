/**
 * 주문 요약 및 결제 버튼 컴포넌트
 */

import { Button } from '../../common/Button';

interface OrderSummaryProps {
  productPrice: number;
  shippingFee: number;
  couponDiscount?: number;
  finalPrice: number;
  disabled?: boolean;
  onPayment: () => void;
  isLoading?: boolean;
}

const OrderSummary = ({ 
  productPrice, 
  shippingFee, 
  couponDiscount = 0,
  finalPrice, 
  disabled = false, 
  onPayment,
  isLoading = false
}: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden sticky top-24">
      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
        <h3 className="font-bold text-neutral-900">결제 금액</h3>
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between text-neutral-600">
          <span>총 상품 금액</span>
          <span>{productPrice.toLocaleString('ko-KR')}원</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>배송비</span>
          <span>+{shippingFee.toLocaleString('ko-KR')}원</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-primary-600">
            <span>쿠폰 할인</span>
            <span>-{couponDiscount.toLocaleString('ko-KR')}원</span>
          </div>
        )}
        <div className="pt-3 border-t border-dashed border-neutral-200 flex justify-between items-center">
          <span className="font-bold text-neutral-900">최종 결제 금액</span>
          <span className="text-xl font-bold text-primary-600">
            {finalPrice.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>
      
      <div className="p-5 pt-0">
        <Button
          size="lg"
          onClick={onPayment}
          disabled={disabled || isLoading}
          className="w-full font-bold text-lg"
        >
          {isLoading ? '결제 진행 중...' : `${finalPrice.toLocaleString('ko-KR')}원 결제하기`}
        </Button>
        <p className="mt-3 text-xs text-center text-neutral-400">
          주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

