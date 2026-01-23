/**
 * 판매자 상품 목록 (탭 포함)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Plus from 'lucide-react/dist/esm/icons/plus';
import type { SaleStatus } from '@/mocks/products';
import { useSellerStore } from '@/stores/useSellerStore';
import SellerProductCard from './SellerProductCard';
import { Button } from '@/components/common/Button';

type TabType = 'all' | SaleStatus;

const TABS: { key: TabType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ON_SALE', label: '판매중' },
  { key: 'RESERVED', label: '예약중' },
  { key: 'SOLD_OUT', label: '판매완료' },
];

const SellerProductList = () => {
  const { getProductsByStatus, getStats } = useSellerStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const stats = getStats();

  const filteredProducts = getProductsByStatus(activeTab);

  // 탭별 카운트
  const counts = {
    all: stats.total,
    ON_SALE: stats.onSale,
    RESERVED: stats.reserved,
    SOLD_OUT: stats.soldOut,
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">내 상품</h2>
        <Link to="/seller/products/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            상품 등록
          </Button>
        </Link>
      </div>

      {/* 탭 */}
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
          <div className="py-12 text-center">
            <p className="text-neutral-500 mb-4">등록된 상품이 없습니다</p>
            <Link to="/seller/products/new">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                첫 상품 등록하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <SellerProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductList;
