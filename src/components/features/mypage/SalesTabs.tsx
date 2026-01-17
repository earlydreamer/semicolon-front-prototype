/**
 * 판매 내역 탭 컴포넌트
 */

import { useState } from 'react';
import type { SaleStatus } from '../../../mocks/products';
import SalesProductCard from './SalesProductCard';

// 탭 타입 (all 추가)
type TabType = 'all' | SaleStatus;

interface SalesTabsProps {
  products: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    saleStatus: SaleStatus;
    viewCount: number;
    likeCount: number;
    createdAt: string;
  }>;
}

const TABS: { key: TabType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ON_SALE', label: '판매중' },
  { key: 'RESERVED', label: '예약중' },
  { key: 'SOLD_OUT', label: '판매완료' },
];

const PAGE_SIZE = 5;

const SalesTabs = ({ products }: SalesTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.saleStatus === activeTab);

  // 현재 노출할 상품들
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  // 탭 변경 핸들러 (페이지 초기화)
  const handleTabChange = (key: TabType) => {
    setActiveTab(key);
    setVisibleCount(PAGE_SIZE);
  };

  // 더보기 클릭
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // 탭별 카운트 (단일 루프로 최적화)
  const counts = (() => {
    const result = { all: 0, ON_SALE: 0, RESERVED: 0, SOLD_OUT: 0 };
    for (const p of products) {
      result.all++;
      if (p.saleStatus === 'ON_SALE') result.ON_SALE++;
      else if (p.saleStatus === 'RESERVED') result.RESERVED++;
      else if (p.saleStatus === 'SOLD_OUT') result.SOLD_OUT++;
    }
    return result;
  })();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative
              ${
                activeTab === tab.key
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            {tab.label}
            <span
              className={`ml-1 text-xs ${
                activeTab === tab.key ? 'text-primary-500' : 'text-neutral-400'
              }`}
            >
              {counts[tab.key as keyof typeof counts]}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            해당 상태의 상품이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {visibleProducts.map((product) => (
              <SalesProductCard key={product.id} product={product} />
            ))}
            
            {/* 더보기 버튼 */}
            {hasMore && (
              <button
                onClick={handleShowMore}
                className="w-full py-3 mt-2 text-sm font-semibold text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                더보기 ({filteredProducts.length - visibleCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTabs;
