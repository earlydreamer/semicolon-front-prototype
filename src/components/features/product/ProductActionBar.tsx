/**
 * 상품 액션 바 컴포넌트
 * 
 * ProductDetailPage에서 분리된 하단 고정 액션 바 컴포넌트
 * 데스크톱/모바일 레이아웃 모두 포함
 */

import Heart from 'lucide-react/dist/esm/icons/heart';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import type { SaleStatus } from '@/types/product';

interface ProductActionBarProps {
  // 상품 정보
  saleStatus: SaleStatus;
  likeCount: number;
  // 상태
  isLiked: boolean;
  // 핸들러
  onLike: () => void;
  onAddToCart: () => void;
  onPurchase: () => void;
}

export const ProductActionBar = ({
  saleStatus,
  likeCount,
  isLiked,
  onLike,
  onAddToCart,
  onPurchase,
}: ProductActionBarProps) => {
  const isDisabled = saleStatus === 'SOLD_OUT' || saleStatus === 'RESERVED';
  const displayLikeCount = likeCount + (isLiked ? 1 : 0);

  const getPurchaseButtonText = () => {
    if (saleStatus === 'SOLD_OUT') return '품절된 상품';
    if (saleStatus === 'RESERVED') return '예약중';
    return '구매하기';
  };

  const getMobilePurchaseText = () => {
    if (saleStatus === 'SOLD_OUT') return '품절';
    if (saleStatus === 'RESERVED') return '예약중';
    return '구매하기';
  };

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden md:flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button 
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-semibold text-gray-900 transition-all active:scale-95 hover:bg-neutral-200 ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          찜 {displayLikeCount}
        </button>
        <button 
          onClick={onAddToCart}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all active:scale-95 ${
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
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition-all active:scale-95 ${
            isDisabled
            ? 'bg-neutral-300 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {getPurchaseButtonText()}
        </button>
      </div>

      {/* Mobile Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-3 min-[360px]:px-4 py-2.5 min-[360px]:py-3 md:hidden" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2 min-[360px]:gap-4">
          <button 
            onClick={onLike}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 min-w-[40px] ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`h-5 min-[360px]:h-6 w-5 min-[360px]:w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[10px] mt-0.5">{displayLikeCount}</span>
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
