/**
 * 상점 페이지
 */

import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_SHOPS } from '../mocks/users';
import { MOCK_PRODUCTS } from '../mocks/products';

import ShopHeader from '../components/features/shop/ShopHeader';
import ShopStats from '../components/features/shop/ShopStats';
import ShopProductList from '../components/features/shop/ShopProductList';
import { ReviewList } from '../components/features/review/ReviewList';

type TabType = 'all' | 'ON_SALE' | 'RESERVED' | 'SOLD_OUT';

const TABS: { key: TabType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ON_SALE', label: '판매중' },
  { key: 'RESERVED', label: '예약중' },
  { key: 'SOLD_OUT', label: '판매완료' },
];

const ShopPage = () => {
  const { shopId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // 상점 정보 조회
  const shop = MOCK_SHOPS.find((s) => s.id === shopId);
  
  // 상점의 판매 상품 조회
  const shopProducts = useMemo(() => 
    MOCK_PRODUCTS.filter((p) => p.seller.id === shopId),
    [shopId]
  );

  // 상태별 상품 카운트
  const statusCounts = useMemo(() => ({
    all: shopProducts.length,
    ON_SALE: shopProducts.filter(p => p.saleStatus === 'ON_SALE').length,
    RESERVED: shopProducts.filter(p => p.saleStatus === 'RESERVED').length,
    SOLD_OUT: shopProducts.filter(p => p.saleStatus === 'SOLD_OUT').length,
  }), [shopProducts]);

  // 현재 탭에 해당하는 상품만 필터링
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return shopProducts;
    return shopProducts.filter(p => p.saleStatus === activeTab);
  }, [shopProducts, activeTab]);

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

        {/* 상점 통계 - 실제 데이터 기반 */}
        <ShopStats
          salesCount={statusCounts.SOLD_OUT}
          activeListingCount={statusCounts.ON_SALE}
          followerCount={shop.followerCount}
          rating={shop.rating}
        />

        {/* 상품 섹션 */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* 탭 네비게이션 - 배경색 추가 */}
          <div className="flex border-b border-neutral-200 bg-neutral-50">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-primary-600 bg-white'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
                <span className={`ml-1 text-xs ${
                  activeTab === tab.key ? 'text-primary-500' : 'text-neutral-400'
                }`}>
                  {statusCounts[tab.key]}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
            ))}
          </div>

          {/* 상품 리스트 */}
          <div className="p-4">
            <ShopProductList 
              products={filteredProducts} 
              shopName={shop.name} 
              statusFilter={activeTab === 'all' ? 'ON_SALE' : activeTab}
            />
          </div>
        </div>

        {/* 거래 후기 섹션 - 별도 분리 */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-lg font-semibold text-neutral-900">거래 후기</h2>
          </div>
          <div className="p-4">
            <ReviewList sellerId={shopId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

