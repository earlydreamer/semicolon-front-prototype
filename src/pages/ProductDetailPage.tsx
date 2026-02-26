import { Link, useNavigate, useParams } from 'react-router-dom';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

import { formatPrice } from '@/utils/formatPrice';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { SellerProfileCard } from '@/components/features/product/SellerProfileCard';
import { ProductComments } from '@/components/features/product/ProductComments';
import { ProductActionBar } from '@/components/features/product/ProductActionBar';
import { ShareModal } from '@/components/features/product/ShareModal';
import { ReportModal } from '@/components/features/product/ReportModal';
import { useProductDetail } from '@/hooks/useProductDetail';

export default function ProductDetailPage() {
  const { productId: rawProductId } = useParams();
  const navigate = useNavigate();

  const {
    product,
    isBootstrapping,
    isLoading,
    error,
    categoryPath,
    isLiked,
    isShareModalOpen,
    setIsShareModalOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    handleLike,
    handleAddToCart,
    handlePurchase,
    isOwnPendingReservation,
  } = useProductDetail(rawProductId);

  if (isBootstrapping || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || '상품 정보를 불러오지 못했어요.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-3 py-5 min-[360px]:px-4 min-[360px]:py-6 md:px-6">
        <div className="mb-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-gray-500 no-scrollbar min-[360px]:text-sm">
          <Link to="/" className="hover:text-neutral-900">홈</Link>
          {categoryPath.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <Link to={`/categories/${cat.id}`} className="hover:text-neutral-900">
                {cat.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 min-[360px]:gap-8 md:grid-cols-2 lg:gap-12">
          <ProductImageGallery images={product.images} mainImage={product.image} title={product.title} />

          <div className="flex flex-col">
            <h1 className="mb-2 text-lg font-bold leading-tight text-neutral-900 min-[360px]:text-xl md:text-2xl">
              {product.title}
            </h1>
            <div className="mb-4 text-2xl font-bold text-neutral-900 min-[360px]:text-3xl">{formatPrice(product.price)}</div>
            {product.tags.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <SellerProfileCard
              seller={{
                sellerUuid: product.seller.sellerUuid,
                sellerUserUuid: product.seller.sellerUserUuid,
                shopUuid: product.seller.shopUuid,
                nickname: product.seller.nickname,
                rating: product.seller.rating,
                reviewCount: product.seller.reviewCount,
                salesCount: 0,
                activeListingCount: 0,
              }}
            />

            <div className="py-6 min-h-[140px]">
              <h3 className="text-lg font-bold mb-4">상품 정보</h3>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{product.description}</div>
            </div>

            <ProductComments comments={product.comments} sellerUserId={product.seller.sellerUserUuid} />

            <ProductActionBar
              saleStatus={product.saleStatus}
              isOwnPendingReservation={isOwnPendingReservation}
              isLiked={isLiked}
              onLike={handleLike}
              onAddToCart={handleAddToCart}
              onPurchase={handlePurchase}
            />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productTitle={product.title}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="PRODUCT"
        targetId={product.id}
        targetName={product.title}
      />
    </div>
  );
}
