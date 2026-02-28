import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import type { SaleStatus } from '@/types/product';
import { useSellerStore } from '@/stores/useSellerStore';
import { useToast } from '@/components/common/Toast';
import { formatPrice } from '@/utils/formatPrice';

interface SellerProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    tags?: string[];
    saleStatus: SaleStatus;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
  };
}

const STATUS_LABELS: Record<SaleStatus, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-green-100 text-green-700' },
  RESERVED: { text: '거래중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-neutral-200 text-neutral-600' },
  BLOCKED: { text: '차단됨', className: 'bg-red-100 text-red-700' },
};

const SellerProductCard = ({ product }: SellerProductCardProps) => {
  const MAX_VISIBLE_TAGS = 1;
  const { deleteProduct } = useSellerStore();
  const { showToast } = useToast();
  const [isActionPending, setIsActionPending] = useState(false);
  const [isTagExpanded, setIsTagExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const hasProductId = Boolean(product.id && product.id !== 'undefined' && product.id !== 'null');
  const tags = product.tags ?? [];
  const visibleTags = isTagExpanded ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = Math.max(tags.length - MAX_VISIBLE_TAGS, 0);
  const statusLabel = STATUS_LABELS[product.saleStatus];

  useEffect(() => {
    if (!showMenu) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    if (!hasProductId) {
      showToast('상품을 먼저 등록해 주세요', 'error');
      return;
    }

    if (!confirm('상품을 삭제할까요?')) {
      setShowMenu(false);
      return;
    }

    try {
      setIsActionPending(true);
      await deleteProduct(product.id);
      showToast('상품이 삭제되었어요', 'success');
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      showToast('삭제하지 못했어요. 잠시 후 다시 시도해 주세요', 'error');
    } finally {
      setIsActionPending(false);
    }
  };

  return (
    <div className="flex min-h-[160px] gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 transition-shadow hover:shadow-md">
      <Link
        to={hasProductId ? `/products/${product.id}` : '/seller'}
        className="h-24 w-24 min-[360px]:h-28 min-[360px]:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100"
      >
        <img
          src={product.image || '/images/placeholder.png'}
          alt={product.title}
          width={112}
          height={112}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={hasProductId ? `/products/${product.id}` : '/seller'} className="block min-w-0 flex-1">
            <h4 className="truncate text-[17px] min-[360px]:text-lg font-semibold text-neutral-900 hover:text-primary-600">
              {product.title}
            </h4>
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              disabled={isActionPending}
              aria-label="상품 액션 메뉴"
              aria-expanded={showMenu}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 active:scale-95 disabled:opacity-50 ${showMenu ? 'bg-neutral-100 text-neutral-700' : ''}`}
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full z-10 mt-1.5 w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                {hasProductId ? (
                  <Link
                    to={`/seller/products/${product.id}/edit`}
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    수정
                  </Link>
                ) : (
                  <span className="block px-4 py-2.5 text-sm text-neutral-400">수정</span>
                )}

                <hr className="border-neutral-100" />

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isActionPending || !hasProductId}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isActionPending ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5">
          <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${statusLabel.className}`}>
            {statusLabel.text}
          </span>
          <span className="text-lg font-bold text-neutral-900">{formatPrice(product.price)}</span>
        </div>

        <div className="mt-3 min-h-[24px]">
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex max-w-[150px] truncate rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-500"
                  title={`#${tag}`}
                >
                  #{tag}
                </span>
              ))}
              {hiddenTagCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsTagExpanded((prev) => !prev)}
                  className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                  {isTagExpanded ? '접기' : `+${hiddenTagCount}개 더보기`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
