import { useEffect, useState } from 'react';
import Heart from 'lucide-react/dist/esm/icons/heart';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import type { SaleStatus } from '@/types/product';

interface ProductActionBarProps {
  saleStatus: SaleStatus;
  isOwnPendingReservation?: boolean;
  isLiked: boolean;
  onLike: () => void;
  onAddToCart: () => void;
  onPurchase: () => void;
}

export const ProductActionBar = ({
  saleStatus,
  isOwnPendingReservation = false,
  isLiked,
  onLike,
  onAddToCart,
  onPurchase,
}: ProductActionBarProps) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const isDisabled =
    saleStatus === 'SOLD_OUT' ||
    (saleStatus === 'RESERVED' && !isOwnPendingReservation);
  const desktopLikeButtonClass = isLiked
    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-200'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const mobileLikeToneClass = isLiked ? 'text-rose-600' : 'text-gray-500';
  const mobileLikeChipClass = isLiked
    ? 'bg-rose-100 border border-rose-200'
    : 'bg-gray-100 border border-gray-200';
  const mobileLikeLabelClass = isLiked ? 'text-rose-600' : 'text-gray-500';

  const getPurchaseButtonText = () => {
    if (saleStatus === 'SOLD_OUT') return '품절된 상품';
    if (saleStatus === 'RESERVED') {
      return isOwnPendingReservation ? '결제 계속하기' : '거래중';
    }
    return '구매하기';
  };

  const getMobilePurchaseText = () => {
    if (saleStatus === 'SOLD_OUT') return '품절';
    if (saleStatus === 'RESERVED') {
      return isOwnPendingReservation ? '결제 계속' : '거래중';
    }
    return '구매하기';
  };

  const handleLikeClick = () => {
    setIsLikeAnimating(false);
    requestAnimationFrame(() => setIsLikeAnimating(true));
    onLike();
  };

  useEffect(() => {
    if (!isLikeAnimating) return;

    const timeoutId = window.setTimeout(() => {
      setIsLikeAnimating(false);
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [isLikeAnimating]);

  return (
    <>
      <div className="hidden md:flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleLikeClick}
          className={`relative flex-1 overflow-hidden rounded-lg py-3 font-semibold transition-[background-color,color,transform] active:scale-95 ${desktopLikeButtonClass}`}
          aria-pressed={isLiked}
        >
          {isLikeAnimating && (
            <span className="pointer-events-none absolute inset-0 bg-white/15 animate-pulse" />
          )}
          <span className="relative flex items-center justify-center gap-2">
            <Heart
              className={`h-5 w-5 transition-transform duration-200 ${isLiked ? 'fill-current' : ''} ${
                isLikeAnimating ? 'scale-125' : 'scale-100'
              }`}
            />
            <span>{isLiked ? '찜했어요' : '찜하기'}</span>
          </span>
        </button>

        <button
          onClick={onAddToCart}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-[background-color,color,transform] active:scale-95 ${
            isDisabled
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          장바구니
        </button>

        <button
          onClick={onPurchase}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition-[background-color,color,transform] active:scale-95 ${
            isDisabled
              ? 'bg-neutral-300 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {getPurchaseButtonText()}
        </button>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-3 min-[360px]:px-4 py-2.5 min-[360px]:py-3 md:hidden"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-2 min-[360px]:gap-4">
          <button
            onClick={handleLikeClick}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 min-w-[40px] ${mobileLikeToneClass}`}
            aria-label={isLiked ? '찜 해제' : '찜하기'}
            aria-pressed={isLiked}
          >
            <span className={`grid place-items-center h-8 w-8 rounded-full transition-colors ${mobileLikeChipClass}`}>
              <Heart
                className={`h-5 min-[360px]:h-6 w-5 min-[360px]:w-6 transition-transform duration-200 ${
                  isLiked ? 'fill-current' : ''
                } ${isLikeAnimating ? 'scale-125' : 'scale-100'}`}
              />
            </span>
            <span className={`text-[10px] mt-1 ${mobileLikeLabelClass}`}>{isLiked ? '찜했어요' : '찜'}</span>
          </button>
        </div>

        <div className="flex flex-1 gap-1.5 min-[360px]:gap-2 ml-2 min-[360px]:ml-4">
          <button
            onClick={onAddToCart}
            disabled={isDisabled}
            className={`flex-1 rounded-md py-2 min-[360px]:py-2.5 text-xs min-[360px]:text-sm font-bold shadow-sm transition-transform active:scale-95 ${
              isDisabled
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-orange-100 text-orange-600'
            }`}
          >
            장바구니
          </button>
          <button
            onClick={onPurchase}
            disabled={isDisabled}
            className={`flex-1 rounded-md py-2 min-[360px]:py-2.5 text-xs min-[360px]:text-sm font-bold text-white shadow-sm transition-transform active:scale-95 ${
              isDisabled
                ? 'bg-neutral-300 cursor-not-allowed'
                : 'bg-primary-500'
            }`}
          >
            {getMobilePurchaseText()}
          </button>
        </div>
      </div>
    </>
  );
};
