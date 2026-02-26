/**
 * 주문 상품 목록 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { CartItem } from '../../../types/cart';

interface OrderItemListProps {
  items: CartItem[];
}

const OrderItemList = ({ items }: OrderItemListProps) => {
  if (items.length === 0) {
    return <div className="p-4 text-center text-neutral-500">주문할 상품이 없습니다.</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
        <h3 className="font-bold text-neutral-900">주문 상품 {items.length}개</h3>
      </div>
      <div className="divide-y divide-neutral-100">
        {items.map((item) => (
          <div key={item.product.id} className="p-5 flex gap-4">
            {/* 상품 이미지 */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 상품 정보 */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                className="text-sm font-medium text-neutral-900 line-clamp-2 hover:underline"
              >
                {item.product.title}
              </Link>
              <div className="mt-1 text-xs text-neutral-500">
                {item.product.conditionStatus === 'SEALED' ? '미개봉' : '중고'}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-neutral-900">
                  {item.product.price.toLocaleString('ko-KR')}원
                </span>
                <span className="text-xs text-neutral-500">
                  {item.product.shippingFee > 0
                    ? `배송비 ${item.product.shippingFee.toLocaleString('ko-KR')}원`
                    : '무료배송'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemList;
