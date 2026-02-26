import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Product } from '@/mocks/products';
import { formatTimeAgo } from '@/utils/date';
import { SALE_STATUS_LABELS } from '@/constants';
import { useLikeStore } from '@/stores/useLikeStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = product.saleStatus === 'SOLD_OUT' || product.saleStatus === 'RESERVED';
  const { user } = useAuthStore();
  const { isLiked, toggleLike } = useLikeStore();
  const liked = user ? isLiked(user.id, product.id) : false;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation();
    if (!user) return;
    toggleLike(user.id, product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <Card 
        variant="elevated" 
        className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          <img
            src={product.image}
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              isUnavailable ? 'brightness-75' : ''
            }`}
            loading="lazy"
          />

          {/* 찜하기 버튼 (우상단) */}
          <button
            onClick={handleLikeClick}
            className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200 backdrop-blur-sm
              ${liked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-neutral-400 hover:text-red-500 hover:bg-white shadow-md'
              }
            `}
            aria-label={liked ? '찜 해제' : '찜하기'}
          >
            <Heart 
              className={`h-4 w-4 transition-transform ${liked ? 'fill-current scale-110' : ''}`} 
            />
          </button>

          {/* Status Overlay - 서비스 톤앤매너에 맞는 한국어 태그 */}
          {isUnavailable && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className={`
                rounded-full px-4 py-1.5 text-sm font-bold shadow-lg
                backdrop-blur-sm
                ${product.saleStatus === 'SOLD_OUT' 
                  ? 'bg-neutral-800/80 text-white' 
                  : 'bg-primary-500/90 text-white'
                }
              `}>
                {SALE_STATUS_LABELS[product.saleStatus]}
              </span>
            </div>
          )}
        </div>


        {/* Content */}
        <div className="flex flex-col gap-1 p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-neutral-900">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-base min-[320px]:text-lg font-bold text-neutral-900 truncate">
              {product.price.toLocaleString()}원
            </span>
            <span className="text-xs text-neutral-500 flex-shrink-0">
              {formatTimeAgo(product.createdAt)}
            </span>
          </div>
          

        </div>
      </Card>
    </Link>
  );
}
