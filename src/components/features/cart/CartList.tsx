/**
 * 장바구니 상품 목록 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../../types/cart';
import CartItem from './CartItem';

interface CartListProps {
  items: CartItemType[];
  onRemove: (cartId: number) => void;
  onToggleSelect: (productUuid: string) => void;
  onSelectAll: (selected: boolean) => void;
  allSelected: boolean;
}

const CartList = ({
  items,
  onRemove,
  onToggleSelect,
  onSelectAll,
  allSelected,
}: CartListProps) => {
  // 빈 장바구니
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* 빈 장바구니 아이콘 */}
        <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          장바구니가 비어있어요
        </h3>
        <p className="text-neutral-500 mb-6">
          관심있는 상품을 담아보세요!
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl
                     hover:bg-primary-600 transition-colors"
        >
          상품 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 전체 선택 헤더 */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-5 h-5 rounded border-neutral-300 text-primary-500
                       focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm font-medium text-neutral-700">
            전체 선택 ({items.filter((i) => i.selected).length}/{items.length})
          </span>
        </label>
      </div>

      {/* 상품 목록 */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.cartId}
            item={item}
            onRemove={onRemove}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;
