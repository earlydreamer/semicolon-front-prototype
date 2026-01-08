/**
 * 판매 상품 카드 컴포넌트 (마이페이지용)
 */

import { Link } from 'react-router-dom';
import { Eye, Heart, MoreVertical } from 'lucide-react';
import type { SaleStatus } from '../../../mocks/products';
import { formatTimeAgo } from '../../../utils/date';

// 판매 상태 라벨 매핑
const SALE_STATUS_LABELS: Record<string, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-green-100 text-green-700' },
  RESERVED: { text: '예약중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-neutral-200 text-neutral-500' },
};

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
  const statusInfo = SALE_STATUS_LABELS[product.saleStatus] || SALE_STATUS_LABELS.ON_SALE;

  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
      {/* 상품 이미지 */}
      <Link
        to={`/products/${product.id}`}
        className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>
        <Link
          to={`/products/${product.id}`}
          className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-1"
        >
          {product.title}
        </Link>
        <p className="text-base font-bold text-neutral-900 mt-1">
          {product.price.toLocaleString('ko-KR')}원
        </p>
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

      {/* 더보기 버튼 */}
      <button
        className="p-2 text-neutral-400 hover:text-neutral-600 self-center"
        title="더보기"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SalesProductCard;
