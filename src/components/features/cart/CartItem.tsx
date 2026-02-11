/**
 * 장바구니 개별 상품 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../../types/cart';
import type { SaleStatus } from '../../../types/product';
import { formatPrice } from '../../../utils/formatPrice';

// 상품 상태 라벨 매핑
const SALE_STATUS_LABELS: Record<string, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-green-100 text-green-700' },
  RESERVED: { text: '예약중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-neutral-200 text-neutral-500' },
};

interface CartItemProps {
  item: CartItemType;
  onRemove: (cartId: number) => void;
  onToggleSelect: (productUuid: string) => void;
}

const CartItem = ({
  item,
  onRemove,
  onToggleSelect,
}: CartItemProps) => {
  const isSoldOut = item.saleStatus === 'SOLD_OUT';
  const statusInfo = SALE_STATUS_LABELS[item.saleStatus as SaleStatus] || SALE_STATUS_LABELS.ON_SALE;

  return (
    <div
      className={`flex gap-4 p-4 rounded-xl bg-white border transition-all
        ${item.selected ? 'border-primary-300 bg-primary-50/30' : 'border-neutral-200'}
        ${isSoldOut ? 'opacity-60' : ''}`}
    >
      {/* 체크박스 */}
      <div className="flex items-start pt-1">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggleSelect(item.productUuid)}
          disabled={isSoldOut}
          className="w-5 h-5 rounded border-neutral-300 text-primary-500
                     focus:ring-primary-500 focus:ring-offset-0
                     disabled:opacity-50 cursor-pointer"
          aria-label={`${item.title} 선택`}
        />
      </div>

      {/* 상품 이미지 제작 */}
      <Link
        to={`/products/${item.productUuid}`}
        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-neutral-100"
      >
        <img
          src={item.thumbnailUrl || ''}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        {/* 상태 뱃지 */}
        {item.saleStatus !== 'ON_SALE' && (
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1 ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        )}

        {/* 상품명 */}
        <Link
          to={`/products/${item.productUuid}`}
          className="block text-sm font-medium text-neutral-900 hover:text-primary-600
                     line-clamp-2 mb-1"
        >
          {item.title}
        </Link>

        {/* 가격 */}
        <p className="text-base font-bold text-neutral-900 mb-2">
          {formatPrice(item.price)}
        </p>

        {/* 배송비 (실데이터 대응) */}
        <p className="text-xs text-neutral-500">
          무료배송
        </p>
      </div>

      {/* 삭제 버튼 */}
      <div className="flex flex-col items-start">
        <button
          type="button"
          onClick={() => onRemove(item.cartId)}
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
