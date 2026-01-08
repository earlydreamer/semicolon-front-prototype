/**
 * 장바구니 주문 요약 컴포넌트
 */

import type { CartSummary as CartSummaryType } from '../../../types/cart';
import { useToast } from '../../common/Toast';

interface CartSummaryProps {
  summary: CartSummaryType;
  onOrder: () => void;
}

const CartSummary = ({ summary, onOrder }: CartSummaryProps) => {
  const { showToast } = useToast();

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const handleOrder = () => {
    if (summary.selectedCount === 0) {
      showToast('주문할 상품을 선택해주세요', 'error');
      return;
    }
    
    // TODO: 주문 페이지 구현 후 연결
    showToast('주문 기능은 준비 중입니다', 'info');
    onOrder();
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 sticky top-24">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">주문 요약</h3>

      {/* 가격 상세 */}
      <div className="space-y-3 pb-4 border-b border-neutral-200">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">선택 상품 ({summary.selectedCount}개)</span>
          <span className="text-neutral-900 font-medium">
            {formatPrice(summary.productTotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">배송비</span>
          <span className="text-neutral-900 font-medium">
            {summary.shippingTotal > 0 ? formatPrice(summary.shippingTotal) : '무료'}
          </span>
        </div>
      </div>

      {/* 총 금액 */}
      <div className="flex justify-between items-center py-4 border-b border-neutral-200">
        <span className="text-base font-semibold text-neutral-900">총 결제 예정</span>
        <span className="text-xl font-bold text-primary-600">
          {formatPrice(summary.grandTotal)}
        </span>
      </div>

      {/* 주문 버튼 */}
      <button
        type="button"
        onClick={handleOrder}
        disabled={summary.selectedCount === 0}
        className="w-full mt-4 py-4 bg-primary-500 text-white font-semibold rounded-xl
                   hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed
                   transition-colors active:scale-[0.98]"
      >
        {summary.selectedCount > 0
          ? `${summary.selectedCount}개 상품 주문하기`
          : '상품을 선택해주세요'}
      </button>

      {/* 안내 문구 */}
      <p className="mt-3 text-xs text-neutral-500 text-center">
        주문 시 결제 정보 입력 페이지로 이동합니다
      </p>
    </div>
  );
};

export default CartSummary;
