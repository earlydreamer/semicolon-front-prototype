/**
 * 찜한 상품 페이지
 */

import { Link, Navigate } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import { useAuthStore } from '../stores/useAuthStore';
import { useLikeStore } from '../stores/useLikeStore';
import { useToast } from '../components/common/Toast';
import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { formatPrice } from '@/utils/formatPrice';
import type { LikedProductItem } from '@/services/userService';

const LikedProductsPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { toggleLike, fetchUserLikes } = useLikeStore();
  const { showToast } = useToast();
  
  const [likedProducts, setLikedProducts] = useState<LikedProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLikedProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getLikedProducts();
      setLikedProducts(response.content || []);
      // store의 ID 목록도 동기화
      if (user?.id) {
        fetchUserLikes(user.id);
      }
    } catch (error) {
      console.error('Failed to load liked products:', error);
      showToast('찜한 상품을 불러오는데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserLikes, showToast, user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadLikedProducts();
    }
  }, [isAuthenticated, loadLikedProducts]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleUnlike = async (productId: string, productTitle: string) => {
    if (!user) return;
    try {
      await toggleLike(user.id, productId);
      setLikedProducts((prev) => prev.filter((p) => p.productUuid !== productId));
      showToast(`"${productTitle}" 찜한 상품에서 제거되었습니다`, 'info');
    } catch {
      showToast('처리에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-2xl px-3 min-[360px]:px-4">
        {/* 헤더 */}
        <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
          <Link
            to="/mypage"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </Link>
            <h1 className="text-lg font-bold text-neutral-900 min-[360px]:text-xl">
            찜한 상품
            {!isLoading && (
              <span className="ml-2 text-sm font-normal text-neutral-500">
                {likedProducts.length}
              </span>
            )}
          </h1>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
            <p className="text-neutral-500">불러오는 중...</p>
          </div>
        ) : likedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 mb-4">찜한 상품이 없습니다</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {likedProducts.map((product) => (
              <div key={product.productUuid} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 min-[360px]:gap-4 min-[360px]:p-4">
                {/* 상품 이미지 */}
                <Link
                  to={`/products/${product.productUuid}`}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 min-[360px]:h-24 min-[360px]:w-24"
                >
                  <img
                    src={product.thumbnailUrl || '/images/placeholder.png'}
                    alt={product.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product.productUuid}`}
                    className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-neutral-900 min-[360px]:text-base">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* 찜 해제 버튼 */}
                <button
                  onClick={() => handleUnlike(product.productUuid, product.title)}
                  className="p-2 text-red-500 hover:text-red-600 self-center"
                  title="찜 해제"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedProductsPage;
