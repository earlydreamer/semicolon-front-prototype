/**
 * 상점 페이지
 */

import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_SHOPS } from '../mocks/users';
import { MOCK_PRODUCTS } from '../mocks/products';

import ShopHeader from '../components/features/shop/ShopHeader';
import ShopStats from '../components/features/shop/ShopStats';
import ShopProductList from '../components/features/shop/ShopProductList';

const ShopPage = () => {
  const { shopId } = useParams();
  
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

        {/* 판매 상품 */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            판매 상품
            <span className="ml-2 text-sm font-normal text-neutral-500">
              {shopProducts.filter((p) => p.saleStatus === 'ON_SALE').length}
            </span>
          </h2>
          <ShopProductList products={shopProducts} shopName={shop.name} />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
