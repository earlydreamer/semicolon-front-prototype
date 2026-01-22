import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ChevronRight, ShoppingBag, Clock, EllipsisVertical, Flag, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { formatTimeAgo } from '@/utils/date';
import { findCategoryPath } from '@/utils/category';
import { sanitizeUrlParam, isValidId } from '@/utils/sanitize';
import { formatPrice } from '@/utils/formatPrice';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useLikeStore } from '@/stores/useLikeStore';
import { ShareModal } from '@/components/features/product/ShareModal';
import { 
  TOAST_MESSAGES, 
  ERROR_MESSAGES, 
  CONDITION_STATUS_LABELS 
} from '@/constants';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import { ReportModal } from '@/components/features/product/ReportModal';

// 분할된 서브 컴포넌트
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { SellerProfileCard } from '@/components/features/product/SellerProfileCard';
import { ProductComments } from '@/components/features/product/ProductComments';
import { ProductActionBar } from '@/components/features/product/ProductActionBar';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';

export default function ProductDetailPage() {
  const { productId: rawProductId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const { isLiked: checkIsLiked, toggleLike } = useLikeStore();
  const { currentProduct: apiProduct, isLoading, error, fetchProductDetail } = useProductStore();
  
  // URL 파라미터 검증 (XSS 방지)
  const productId = sanitizeUrlParam(rawProductId);

  useEffect(() => {
    if (productId && isValidId(productId)) {
      fetchProductDetail(productId);
    }
  }, [productId, fetchProductDetail]);

  // Mapping API response to the format used in this component
  const product = apiProduct ? {
    id: apiProduct.productUuid,
    title: apiProduct.title,
    price: apiProduct.price,
    description: apiProduct.description,
    image: apiProduct.imageUrls?.[0] || '',
    images: apiProduct.imageUrls || [],
    category: apiProduct.category?.name || '기타',
    categoryId: apiProduct.category?.id || 0,
    createdAt: new Date().toISOString(), // DTO에 createdAt 누락되어 현재 시간으로 임시 처리
    conditionStatus: apiProduct.conditionStatus || 'NO_WEAR',
    saleStatus: apiProduct.saleStatus || 'ON_SALE',
    viewCount: apiProduct.viewCount || 0,
    likeCount: apiProduct.likeCount || 0,
    seller: {
      userUuid: '00000000-0000-0000-0000-000000000000', // DTO에 seller 정보 누락
      nickname: 'Semicolon Seller',
      profileImageUrl: '',
      trustScore: 36.5,
      dealCount: 0,
      reviewCount: 0
    },
    // Mock fields for UI layout
    purchaseDate: '2023-10-01',
    usePeriod: '6개월',
    detailedCondition: '생활 기스 외 깨끗함',
    comments: []
  } : null;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // 좋아요 상태는 Store에서 관리
  const isLiked = productId && user ? checkIsLiked(user.id, productId) : false;

  const handleLike = () => {
    if (!productId || !user) {
      if (!user) showToast('로그인이 필요합니다.', 'error');
      return;
    }
    
    toggleLike(user.id, productId);
    const nextLiked = !isLiked;
    showToast(
      nextLiked ? TOAST_MESSAGES.ADDED_TO_LIKES : TOAST_MESSAGES.REMOVED_FROM_LIKES,
      nextLiked ? 'success' : 'info'
    );
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const added = await addToCart((product as any).id || product.productUuid);
    if (added) {
      showToast(TOAST_MESSAGES.ADDED_TO_CART, 'success');
    } else {
      showToast(TOAST_MESSAGES.ALREADY_IN_CART, 'info');
    }
  };

  const setOrderItems = useOrderStore((state) => state.setOrderItems);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  const handlePurchase = () => {
    if (!product) return;
    
    // 1. 기존 주문 정보 초기화
    clearOrder();
    
    // 2. 현재 상품을 주문 목록에 설정 (CartItem 형식)
    const orderItem: any = {
      cartId: Date.now(),
      productUuid: product.productUuid || (product as any).id,
      title: product.title,
      price: product.price,
      saleStatus: product.saleStatus || 'ON_SALE',
      thumbnailUrl: (product as any).thumbnailUrl || product.imageUrls?.[0] || '',
      createdAt: new Date().toISOString(),
      selected: true
    };
    
    setOrderItems([orderItem]);

    // 3. 주문 페이지로 이동
    showToast(TOAST_MESSAGES.MOVING_TO_PAYMENT, 'info');
    navigate('/order');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || ERROR_MESSAGES.PRODUCT_NOT_FOUND}</p>
        <button 
          onClick={() => navigate(-1)}
          className="rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  const { 
    title, price, description, images, seller, 
    viewCount, likeCount, createdAt, conditionStatus, categoryId,
    purchaseDate, usePeriod, detailedCondition,
    comments 
  } = product;

  // Calculate category path for breadcrumbs
  const categoryPath = findCategoryPath(MOCK_CATEGORIES, categoryId) || [];

  return (
    <div className="pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Breadcrumb */}
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
          {/* Left: Images - 분할된 컴포넌트 사용 */}
          <ProductImageGallery 
            images={images} 
            mainImage={product.image} 
            title={title} 
          />

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* 섹션 1: 상품 기본 정보 */}
            <div className="pb-6">
              {/* 태그 영역 */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  conditionStatus === 'SEALED' ? 'bg-emerald-100 text-emerald-700' :
                  conditionStatus === 'NO_WEAR' ? 'bg-blue-100 text-blue-700' :
                  conditionStatus === 'MINOR_WEAR' ? 'bg-yellow-100 text-yellow-800' :
                  conditionStatus === 'VISIBLE_WEAR' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {CONDITION_STATUS_LABELS[conditionStatus]}
                </span>
                <HelpTooltip 
                  title="상품 상태란?"
                  content={
                    <ul className="space-y-1.5">
                      <li><strong>미개봉:</strong> 포장이 개봉되지 않은 새 제품</li>
                      <li><strong>사용감 없음:</strong> 사용 흔적이 없는 깨끗한 상태</li>
                      <li><strong>사용감 적음:</strong> 약간의 사용감, 기능 문제 없음</li>
                      <li><strong>사용감 많음:</strong> 눈에 띄는 사용 흔적</li>
                      <li><strong>하자 있음:</strong> 부분적 파손이나 기능 이상</li>
                    </ul>
                  }
                />
              </div>

              {/* 상품 타이틀 + 더보기 메뉴 */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl font-bold text-neutral-900 md:text-2xl leading-tight">
                  {title}
                </h1>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100"
                    title="공유하기"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100"
                      title="더보기"
                    >
                      <EllipsisVertical className="h-5 w-5" />
                    </button>
                    {/* 더보기 드롭다운 메뉴 */}
                    {isMoreMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMoreMenuOpen(false)} 
                        />
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              showToast('URL이 복사되었습니다.', 'success');
                              setIsMoreMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            <Link2 className="h-4 w-4" />
                            URL 복사
                          </button>
                          <button
                            onClick={() => {
                              setIsReportModalOpen(true);
                              setIsMoreMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Flag className="h-4 w-4" />
                            신고하기
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 메타 정보 (등록일, 조회, 찜) */}
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>{formatTimeAgo(createdAt)}</span>
                <span>•</span>
                <span>조회 {viewCount}</span>
                <span>•</span>
                <span>찜 {likeCount}</span>
              </div>
            </div>

            {/* 섹션 2: 가격 정보 (별도 배경으로 강조) */}
            <div className="bg-neutral-50 rounded-xl p-5 mb-6 border border-neutral-100">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-neutral-500 mb-1">판매가</div>
                  <div className="text-3xl font-bold text-neutral-900">
                    {formatPrice(price)}
                  </div>
                </div>
                <div className="text-right">
                  {product.shippingFee === 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      무료배송
                    </span>
                  ) : (
                    <div className="text-sm text-neutral-500">
                      배송비 <span className="font-semibold text-neutral-700">{formatPrice(product.shippingFee)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
              
            {/* 품절/예약중 안내 배너 */}
            {product.saleStatus === 'SOLD_OUT' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">판매 완료</div>
                  <div className="text-xs text-red-500">이 상품은 이미 판매되었습니다.</div>
                </div>
                <HelpTooltip 
                  title="판매완료란?"
                  content="이미 다른 구매자에게 판매가 완료된 상품입니다. 더 이상 구매할 수 없습니다."
                />
              </div>
            )}
            
            {product.saleStatus === 'RESERVED' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center gap-3 text-yellow-700">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">예약중</div>
                  <div className="text-xs text-yellow-600">다른 구매자가 결제를 진행 중입니다.</div>
                </div>
                <HelpTooltip 
                  title="예약중이란?"
                  content="다른 구매자가 결제를 진행 중인 상품입니다. 구매 확정 전까지는 거래가 취소될 수 있으니, 관심이 있다면 찜을 해두세요!"
                />
              </div>
            )}

            {/* Seller Profile - 분할된 컴포넌트 사용 */}
            <SellerProfileCard seller={seller} />

            {/* Content - 상품 정보 (상세 필드 추가) */}
            <div className="py-6 min-h-[200px]">
              <h3 className="text-lg font-bold mb-4">상품 정보</h3>
              
              {/* 상세 정보 테이블 스타일 (구매 시기, 사용 기간, 상세 상태) */}
              {(purchaseDate || usePeriod || detailedCondition) && (
                <div className="mb-6 grid grid-cols-1 gap-y-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-sm">
                  {purchaseDate && (
                    <div className="flex">
                      <span className="w-24 font-medium text-gray-500">구매 시기</span>
                      <span className="text-gray-900">{purchaseDate}</span>
                    </div>
                  )}
                  {usePeriod && (
                    <div className="flex">
                      <span className="w-24 font-medium text-gray-500">사용 기간</span>
                      <span className="text-gray-900">{usePeriod}</span>
                    </div>
                  )}
                  {detailedCondition && (
                    <div className="flex">
                      <span className="w-24 font-medium text-gray-500">상세 상태</span>
                      <span className="text-gray-900">{detailedCondition}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {description}
              </div>
            </div>

            {/* Comments Section - 분할된 컴포넌트 사용 */}
            <ProductComments 
              comments={comments} 
              sellerUserId={seller.userId} 
            />

            {/* Desktop Actions - 분할된 컴포넌트 사용 */}
            <ProductActionBar
              saleStatus={product.saleStatus}
              likeCount={likeCount}
              isLiked={isLiked}
              onLike={handleLike}
              onAddToCart={handleAddToCart}
              onPurchase={handlePurchase}
            />
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
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
