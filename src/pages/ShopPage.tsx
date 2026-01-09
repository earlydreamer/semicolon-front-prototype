/**
 * 상점 페이지
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_SHOPS } from '../mocks/users';
import { MOCK_PRODUCTS } from '../mocks/products';

import ShopHeader from '../components/features/shop/ShopHeader';
import ShopStats from '../components/features/shop/ShopStats';
import ShopProductList from '../components/features/shop/ShopProductList';
import { ReviewList } from '../components/features/review/ReviewList';

type Tab = 'products' | 'reviews';

const ShopPage = () => {
  const { shopId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  
  // 상점 정보 조회
  const shop = MOCK_SHOPS.find((s) => s.id === shopId);
  
  // 상점의 판매 상품 조회
  const shopProducts = MOCK_PRODUCTS.filter((p) => p.seller.id === shopId);

  // 상점을 찾을 수 없는 경우
  if (!shop) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-16">
        <p className="text-lg text-neutral-500 mb-4">상점을 찾을 수 없습니다</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* 뒤로가기 */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft className="w-4 h-4" />
          돌아가기
        </Link>

        {/* 상점 헤더 */}
        <ShopHeader shop={shop} />

        {/* 상점 통계 */}
        <ShopStats
          salesCount={shop.salesCount}
          activeListingCount={shop.activeListingCount}
          followerCount={shop.followerCount}
          rating={shop.rating}
        />

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            판매 상품
            <span className="ml-1 text-neutral-400">
              {shopProducts.filter((p) => p.saleStatus === 'ON_SALE').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            거래 후기
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'products' && (
          <ShopProductList products={shopProducts} shopName={shop.name} />
        )}
        
        {activeTab === 'reviews' && (
          <ReviewList sellerId={shopId} />
        )}
      </div>
    </div>
  );
};

export default ShopPage;

