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

const SalesTabs = ({ products }: SalesTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.saleStatus === activeTab);

  // 탭별 카운트
  const counts = {
    all: products.length,
    ON_SALE: products.filter((p) => p.saleStatus === 'ON_SALE').length,
    RESERVED: products.filter((p) => p.saleStatus === 'RESERVED').length,
    SOLD_OUT: products.filter((p) => p.saleStatus === 'SOLD_OUT').length,
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
            {filteredProducts.map((product) => (
              <SalesProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTabs;
