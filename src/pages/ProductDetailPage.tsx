import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { sanitizeUrlParam, isValidId } from '@/utils/sanitize';
import { formatPrice } from '@/utils/formatPrice';
import { findCategoryPath } from '@/utils/category';
import type { Category } from '@/types/category';
import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useLikeStore } from '@/stores/useLikeStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { productService } from '@/services/productService';
import { commentService } from '@/services/commentService';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { SellerProfileCard } from '@/components/features/product/SellerProfileCard';
import { ProductComments } from '@/components/features/product/ProductComments';
import { ProductActionBar } from '@/components/features/product/ProductActionBar';
import { ShareModal } from '@/components/features/product/ShareModal';
import { ReportModal } from '@/components/features/product/ReportModal';

export default function ProductDetailPage() {
  const { productId: rawProductId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { isLiked: checkIsLiked, toggleLike } = useLikeStore();
  const { clearOrder, setOrderItems } = useOrderStore();
  const { currentProduct: apiProduct, isLoading, error, fetchProductDetail } = useProductStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [comments, setComments] = useState<Array<{
    id: string;
    authorUuid: string;
    authorRole: 'SELLER' | 'BUYER';
    content: string;
    replies?: Array<{
      id: string;
      authorUuid: string;
      authorRole: 'SELLER' | 'BUYER';
      content: string;
    }>;
  }>>([]);

  const productId = sanitizeUrlParam(rawProductId);

  useEffect(() => {
    if (productId && isValidId(productId)) {
      fetchProductDetail(productId);
    }
  }, [productId, fetchProductDetail]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        const buildTree = (parentId: number | null, depth: number): Category[] => data
          .filter((cat) => cat.parentId === parentId)
          .map((cat) => ({
            id: String(cat.id),
            name: cat.name,
            depth: Math.min(Math.max(depth, 1), 3) as 1 | 2 | 3,
            parentId: cat.parentId === null ? null : String(cat.parentId),
            children: buildTree(cat.id, depth + 1),
          }));

        setCategories(buildTree(null, 1));
      } catch (loadError) {
        console.error('Failed to load categories:', loadError);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      if (!productId || !isValidId(productId)) return;
      try {
        const data = await commentService.getProductComments(productId, { page: 0, size: 20 });
        setComments((data.items || []).map((thread) => ({
          id: thread.parent.commentUuid,
          authorUuid: thread.parent.authorUuid,
          authorRole: thread.parent.authorRole,
          content: thread.parent.content,
          replies: (thread.replies || []).map((reply) => ({
            id: reply.commentUuid,
            authorUuid: reply.authorUuid,
            authorRole: reply.authorRole,
            content: reply.content,
          })),
        })));
      } catch (loadError) {
        console.error('Failed to load comments:', loadError);
        setComments([]);
      }
    };

    loadComments();
  }, [productId]);

  const product = useMemo(() => {
    if (!apiProduct) return null;

    return {
      id: apiProduct.productUuid,
      title: apiProduct.title,
      price: apiProduct.price,
      description: apiProduct.description,
      image: apiProduct.imageUrls?.[0] || '',
      images: apiProduct.imageUrls || [],
      categoryId: apiProduct.category?.id || 0,
      saleStatus: apiProduct.saleStatus,
      likeCount: apiProduct.likeCount || 0,
      viewCount: apiProduct.viewCount || 0,
      createdAt: new Date().toISOString(),
      seller: {
        userUuid: apiProduct.seller?.shopUuid || '',
        nickname: apiProduct.seller?.nickname || '알 수 없음',
      },
      comments,
    };
  }, [apiProduct, comments]);

  const categoryPath = findCategoryPath(categories, String(product?.categoryId || '')) || [];
  const isLiked = productId && user ? checkIsLiked(user.id, productId) : false;

  const handleLike = async () => {
    if (!productId || !user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    await toggleLike(user.id, productId);
    showToast(!isLiked ? '찜 목록에 추가했어요.' : '찜을 해제했어요.', !isLiked ? 'success' : 'info');
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const added = await addToCart(product.id);
    showToast(added ? '장바구니에 추가했어요.' : '이미 장바구니에 있어요.', added ? 'success' : 'info');
  };

  const handlePurchase = () => {
    if (!product) return;

    clearOrder();
    setOrderItems([
      {
        cartId: Date.now(),
        productUuid: product.id,
        title: product.title,
        price: product.price,
        saleStatus: product.saleStatus,
        thumbnailUrl: product.images?.[0] || '',
        createdAt: new Date().toISOString(),
        selected: true,
      } as any,
    ]);

    navigate('/order');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || '상품 정보를 불러오지 못했습니다.'}</p>
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
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <ProductImageGallery images={product.images} mainImage={product.image} title={product.title} />

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-neutral-900 md:text-2xl leading-tight mb-2">
              {product.title}
            </h1>
            <div className="text-3xl font-bold text-neutral-900 mb-4">{formatPrice(product.price)}</div>

            <SellerProfileCard
              seller={{
                id: product.seller.userUuid,
                nickname: product.seller.nickname,
                rating: 0,
                salesCount: 0,
                activeListingCount: 0,
              }}
            />

            <div className="py-6 min-h-[140px]">
              <h3 className="text-lg font-bold mb-4">상품 정보</h3>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{product.description}</div>
            </div>

            <ProductComments comments={product.comments} sellerUserId={product.seller.userUuid} />

            <ProductActionBar
              saleStatus={product.saleStatus}
              likeCount={product.likeCount}
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
