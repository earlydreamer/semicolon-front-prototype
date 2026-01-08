/**
 * 장바구니 개별 상품 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../../types/cart';

// 상품 상태 라벨 매핑
const SALE_STATUS_LABELS: Record<string, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-green-100 text-green-700' },
  RESERVED: { text: '예약중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-neutral-200 text-neutral-500' },
  HIDDEN: { text: '숨김', className: 'bg-neutral-200 text-neutral-500' },
  BLOCKED: { text: '차단됨', className: 'bg-red-100 text-red-700' },
};

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onToggleSelect: (productId: string) => void;
}

const CartItem = ({
  item,
  onRemove,
  onToggleSelect,
}: CartItemProps) => {
  const { product, selected } = item;
  const isSoldOut = product.saleStatus === 'SOLD_OUT';
  const statusInfo = SALE_STATUS_LABELS[product.saleStatus] || SALE_STATUS_LABELS.ON_SALE;

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  return (
    <div
      className={`flex gap-4 p-4 rounded-xl bg-white border transition-all
        ${selected ? 'border-primary-300 bg-primary-50/30' : 'border-neutral-200'}
        ${isSoldOut ? 'opacity-60' : ''}`}
    >
      {/* 체크박스 */}
      <div className="flex items-start pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(product.id)}
          disabled={isSoldOut}
          className="w-5 h-5 rounded border-neutral-300 text-primary-500
                     focus:ring-primary-500 focus:ring-offset-0
                     disabled:opacity-50 cursor-pointer"
          aria-label={`${product.title} 선택`}
        />
      </div>

      {/* 상품 이미지 */}
      <Link
        to={`/products/${product.id}`}
        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-neutral-100"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        {/* 상태 뱃지 */}
        {product.saleStatus !== 'ON_SALE' && (
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1 ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        )}

        {/* 상품명 */}
        <Link
          to={`/products/${product.id}`}
          className="block text-sm font-medium text-neutral-900 hover:text-primary-600
                     line-clamp-2 mb-1"
        >
          {product.title}
        </Link>

        {/* 가격 */}
        <p className="text-base font-bold text-neutral-900 mb-2">
          {formatPrice(product.price)}
        </p>

        {/* 배송비 */}
        <p className="text-xs text-neutral-500">
          {product.shippingFee > 0
            ? `배송비 ${formatPrice(product.shippingFee)}`
            : '무료배송'}
        </p>
      </div>

      {/* 삭제 버튼 */}
      <div className="flex flex-col items-start">
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
          aria-label="상품 삭제"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
