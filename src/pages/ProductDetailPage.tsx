import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { Heart, Share2, MapPin, ShieldCheck, Star, User, ChevronRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatTimeAgo } from '@/utils/date';
import { findCategoryPath } from '@/utils/category';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useCartStore } from '@/stores/useCartStore';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const addToCart = useCartStore((state) => state.addItem);
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    showToast(
      isLiked ? '관심 상품에서 제거되었습니다.' : '관심 상품에 추가되었습니다.',
      isLiked ? 'info' : 'success'
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    const added = addToCart(product);
    if (added) {
      showToast('장바구니에 담았습니다.', 'success');
    } else {
      showToast('이미 장바구니에 담긴 상품입니다.', 'info');
    }
  };

  const handlePurchase = () => {
    showToast('안전결제 페이지로 이동합니다.', 'info');
  };

  if (!product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">상품을 찾을 수 없습니다.</p>
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
    title, price, location, description, images, seller, 
    viewCount, likeCount, createdAt, conditionStatus, isSafe, categoryId,
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
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
              <img
                src={images[activeImageIndex] || product.image}
                alt={title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      activeImageIndex === idx ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="border-b border-gray-200 pb-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                   <div className="flex gap-2 mb-2">
                    {isSafe && (
                        <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <ShieldCheck className="h-3 w-3" />
                        안전결제
                        </span>
                    )}
                    <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {conditionStatus === 'SEALED' ? '미개봉' : 
                         conditionStatus === 'NO_WEAR' ? '사용감 없음' : '중고'}
                    </span>
                   </div>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-3xl font-bold text-gray-900">
                {price.toLocaleString()}원
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {location}
                </span>
                <span>•</span>
                <span>{formatTimeAgo(createdAt)}</span>
                <span>•</span>
                <span>조회 {viewCount}</span>
                <span>•</span>
                <span>관심 {likeCount}</span>
              </div>
            </div>

            {/* Seller Profile (Refactored) */}
            <div className="flex items-center justify-between border-b border-gray-200 py-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                   <img src={seller.avatar || `https://ui-avatars.com/api/?name=${seller.nickname}&background=random`} alt={seller.nickname} className="h-full w-full object-cover" />
                </div>
                <div>
                  <Link to={`/shop/${seller.id}`} className="font-bold text-gray-900 hover:underline">
                    {seller.nickname}
                  </Link>
                  <div className="text-sm text-gray-500">
                    상품 {seller.activeListingCount} • 판매 {seller.salesCount}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    {seller.rating.toFixed(1)} / 5.0
                    </div>
                    <div className="text-xs text-gray-400">판매자 신뢰지수</div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                    상점 보기
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="py-6 min-h-[200px]">
              <h3 className="text-lg font-bold mb-4">상품 정보</h3>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-8">
                {description}
              </div>
              
               {/* Seller Intro */}
              {seller.intro && (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                    <p className="font-semibold mb-1">판매자 소개</p>
                    {seller.intro}
                </div>
              )}
            </div>

             {/* Comments Section (New) */}
             <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold mb-4">상품 문의 ({comments?.length || 0})</h3>
                
                {/* Comment Input */}
                <div className="flex gap-2 mb-6">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        <User className="h-full w-full p-1 text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <textarea 
                            placeholder="상품에 대해 문의해보세요." 
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none h-20"
                        />
                        <div className="flex justify-end mt-2">
                            <button className="rounded px-3 py-1.5 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800">
                                등록
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comment List */}
                <div className="space-y-6">
                    {comments && comments.map((comment) => (
                        <div key={comment.id} className="group">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                                     <img src={comment.user.avatar} alt={comment.user.nickname} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-gray-900">{comment.user.nickname}</span>
                                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
                                    <button className="text-xs text-gray-400 font-medium mt-1 hover:text-gray-600">답글 달기</button>
                                </div>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-3">
                                             <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={reply.user.avatar} alt={reply.user.nickname} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm text-gray-900">{reply.user.nickname}</span>
                                                    {reply.userId === seller.userId && (
                                                        <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                                                            판매자
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-0.5">{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
             </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-semibold text-gray-900 transition-all active:scale-95 hover:bg-gray-200 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                찜 {likeCount + (isLiked ? 1 : 0)}
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-100 py-3 font-semibold text-orange-600 transition-all active:scale-95 hover:bg-orange-200"
              >
                <ShoppingBag className="h-5 w-5" />
                장바구니
              </button>
              {isSafe && (
                <button 
                  onClick={handlePurchase}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary-500 py-3 font-semibold text-white transition-all active:scale-95 hover:bg-primary-600"
                >
                  안전결제
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white p-4 md:hidden pb-[safe-area-inset-bottom]">
        <div className="flex gap-4">
          <button 
            onClick={handleLike}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[10px] mt-0.5">{likeCount + (isLiked ? 1 : 0)}</span>
          </button>
        </div>
        <div className="flex flex-1 gap-2 ml-4">
          <button 
            onClick={handleAddToCart}
            className="flex-1 rounded-md bg-orange-100 py-2.5 text-sm font-bold text-orange-600 shadow-sm transition-transform active:scale-95"
          >
            장바구니
          </button>
          {isSafe && (
            <button 
              onClick={handlePurchase}
              className="flex-1 rounded-md bg-primary-500 py-2.5 text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
            >
              안전결제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
