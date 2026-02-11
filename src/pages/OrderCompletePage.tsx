/**
 * 주문 완료 페이지
 */

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Home from 'lucide-react/dist/esm/icons/home';
import { useOrderStore } from '../stores/useOrderStore';
import { useCartStore } from '../stores/useCartStore';
import { Button } from '../components/common/Button';

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { orderItems, clearOrder, getOrderSummary } = useOrderStore();
  const { removeSelectedItems } = useCartStore(); // 장바구니에서 구매한 상품 제거

  const { finalPrice } = getOrderSummary();
  const orderNumber = `ORD-${Date.now()}`;

  // 컴포넌트 마운트 시 장바구니 정리 (구매한 상품만) 및 주문 Store 초기화는 나갈 때
  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/', { replace: true });
      return;
    }

    // 장바구니에서 구매한 상품들 제거
    // 실제로는 백엔드에서 처리되겠지만 클라이언트 상태 동기화를 위해 수행
    // 현재 CartStore의 removeSelectedItems는 '선택된' 상품을 지우는 것이므로
    // 주문 시 장바구니에서 선택된 상태로 넘어왔다고 가정.
    // 더 정확히는 orderItems에 있는 productId들을 장바구니에서 제거해야 함.
    // 하지만 MVP에서는 removeSelectedItems() 호출로 충분할 수 있음 (주문 시 선택해서 넘어오므로)
    removeSelectedItems();

    // 컴포넌트 언마운트 시 주문 Store 정리
    return () => {
      clearOrder();
    };
  }, [orderItems, navigate, removeSelectedItems, clearOrder]);

  if (orderItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-neutral-100">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">주문이 완료되었습니다!</h1>
        <p className="text-neutral-500 mb-8">
          고객님의 주문이 성공적으로 접수되었습니다.<br />
          판매자가 확인 후 발송할 예정입니다.
        </p>

        <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-500">주문번호</span>
            <span className="font-medium text-neutral-900">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">결제금액</span>
            <span className="font-bold text-primary-600">{finalPrice.toLocaleString('ko-KR')}원</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between">
            <span className="text-neutral-500">배송지</span>
            <span className="font-medium text-neutral-900 text-right text-sm">
              서울시 강남구... (집)
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/mypage/orders">
            <Button variant="outline" className="w-full h-12 text-base">
              <ShoppingBag className="w-4 h-4 mr-2" />
              주문 상세보기
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full h-12 text-base">
              <Home className="w-4 h-4 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
