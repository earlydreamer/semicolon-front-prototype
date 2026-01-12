/**
 * 찜한 상품 페이지
 */

import { Link, Navigate } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useLikeStore } from '../stores/useLikeStore';
import { MOCK_PRODUCTS } from '../mocks/products';
import { useToast } from '../components/common/Toast';

const LikedProductsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { likedProductIds, removeLike } = useLikeStore();
  const { showToast } = useToast();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 좋아요한 상품 필터링
  const likedProducts = MOCK_PRODUCTS.filter((p) =>
    likedProductIds.includes(p.id)
  );

  const handleUnlike = (productId: string, productTitle: string) => {
    removeLike(productId);
    showToast(`"${productTitle}" 찜한 상품에서 제거되었습니다`, 'info');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/mypage"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">
            찜한 상품
            <span className="ml-2 text-sm font-normal text-neutral-500">
              {likedProducts.length}
            </span>
          </h1>
        </div>

        {/* 상품 목록 */}
        {likedProducts.length === 0 ? (
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
              <div
                key={product.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-neutral-200"
              >
                {/* 상품 이미지 */}
                <Link
                  to={`/products/${product.id}`}
                  className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${product.id}`}
                    className="block text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2"
                  >
                    {product.title}
                  </Link>
                  <p className="text-base font-bold text-neutral-900 mt-1">
                    {product.price.toLocaleString('ko-KR')}원
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {product.location}
                  </p>
                </div>

                {/* 찜 해제 버튼 */}
                <button
                  onClick={() => handleUnlike(product.id, product.title)}
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
