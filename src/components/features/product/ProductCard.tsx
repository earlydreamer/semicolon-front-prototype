import { Link } from 'react-router-dom';
import Heart from 'lucide-react/dist/esm/icons/heart';
import { Card } from '@/components/common/Card';
import type { Product, ProductListItem, SaleStatus } from '@/types/product';
import { formatTimeAgo } from '@/utils/date';
import { SALE_STATUS_LABELS } from '@/constants';
import { useLikeStore } from '@/stores/useLikeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/components/common/Toast';

interface ProductCardProps {
  product: Product | ProductListItem;
}

const getProductId = (product: Product | ProductListItem) =>
  'productUuid' in product ? product.productUuid : product.id;

const getProductImage = (product: Product | ProductListItem) =>
  'thumbnailUrl' in product ? product.thumbnailUrl : product.image;

const getProductSaleStatus = (product: Product | ProductListItem) => product.saleStatus;

const getProductCreatedAt = (product: Product | ProductListItem) => product.createdAt ?? new Date().toISOString();

const getProductTags = (product: Product | ProductListItem) =>
  'tagNames' in product ? (product.tagNames ?? []) : [];

export function ProductCard({ product }: ProductCardProps) {
  // 대응 필드 추출 (API vs Mock)
  const id = getProductId(product);
  const title = product.title;
  const price = product.price;
  const image = getProductImage(product);
  const saleStatus = getProductSaleStatus(product);
  const createdAt = getProductCreatedAt(product);
  const tags = getProductTags(product);
  const visibleTags = tags.slice(0, 2);
  
  const isUnavailable = saleStatus === 'SOLD_OUT' || saleStatus === 'RESERVED';
  const { user } = useAuthStore();
  const { isLiked, toggleLike } = useLikeStore();
  const { showToast } = useToast();
  
  const userId = user?.userUuid ?? user?.id;
  const liked = userId ? isLiked(userId, id) : false;

    const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    try {
      await toggleLike(userId, id);
      showToast(
        liked ? '찜을 해제했어요.' : '찜 목록에 추가했어요.',
        liked ? 'info' : 'success'
      );
    } catch {
      showToast('찜 처리에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  };

  return (
    <Link to={`/products/${id}`} className="group block">
      <Card 
        variant="elevated" 
        className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          <img
            src={image || '/images/placeholder.png'}
            alt={title}
            width={400}
            height={400}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              isUnavailable ? 'brightness-75' : ''
            }`}
            loading="lazy"
          />

          {/* 찜하기 버튼 (우상단) */}
          <button
            onClick={handleLikeClick}
            className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center
              transition-[background-color,color,box-shadow] duration-200 backdrop-blur-sm
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
                ${saleStatus === 'SOLD_OUT' 
                  ? 'bg-neutral-800/80 text-white' 
                  : 'bg-primary-500/90 text-white'
                }
              `}>
                {SALE_STATUS_LABELS[saleStatus as SaleStatus] || saleStatus}
              </span>
            </div>
          )}
        </div>


        {/* Content */}
        <div className="flex flex-col gap-1 p-3">
          <div className="min-h-[1.5rem]">
            {visibleTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visibleTags.map((tag) => (
                  <span
                    key={`${id}-${tag}`}
                    className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h3 className="line-clamp-2 min-h-[2.5rem] text-lg font-medium text-neutral-900">
            {title}
          </h3>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-base min-[320px]:text-lg font-bold text-neutral-900 truncate">
              {price.toLocaleString()}원
            </span>
            <span className="text-xs text-neutral-500 flex-shrink-0">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
          

        </div>
      </Card>
    </Link>
  );
}
