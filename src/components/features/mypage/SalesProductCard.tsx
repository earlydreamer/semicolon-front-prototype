/**
 * 판매 상품 카드 컴포넌트 (마이페이지)
 */

import { Link } from 'react-router-dom';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Heart from 'lucide-react/dist/esm/icons/heart';
import type { SaleStatus } from '@/types/product';
import { formatTimeAgo } from '@/utils/date';
import { formatPrice } from '@/utils/formatPrice';
import { SALE_STATUS_LABELS, SALE_STATUS_COLORS } from '@/constants/labels';

interface SalesProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    saleStatus: SaleStatus;
    viewCount: number;
    likeCount: number;
    createdAt: string;
  };
}

const SalesProductCard = ({ product }: SalesProductCardProps) => {
  const hasProductId = Boolean(product.id && product.id !== 'undefined' && product.id !== 'null');

  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
      <Link
        to={hasProductId ? `/products/${product.id}` : '/mypage'}
        className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
      >
        <img
          src={product.image}
          alt={product.title}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${SALE_STATUS_COLORS[product.saleStatus as SaleStatus] || SALE_STATUS_COLORS.ON_SALE}`}>
            {SALE_STATUS_LABELS[product.saleStatus as SaleStatus] || product.saleStatus}
          </span>
        </div>
        <Link
          to={hasProductId ? `/products/${product.id}` : '/mypage'}
          className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-1"
        >
          {product.title}
        </Link>
        <p className="text-base font-bold text-neutral-900 mt-1">{formatPrice(product.price)}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {product.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {product.likeCount}
          </span>
          <span>{formatTimeAgo(product.createdAt)}</span>
        </div>
      </div>

      {hasProductId ? (
        <Link
          to={`/seller/products/${product.id}/edit`}
          className="self-center px-2 py-1 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-100"
        >
          수정
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="self-center px-2 py-1 text-xs font-medium text-neutral-400 border border-neutral-200 rounded-md cursor-not-allowed"
        >
          수정
        </button>
      )}
    </div>
  );
};

export default SalesProductCard;
