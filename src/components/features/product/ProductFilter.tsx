/**
 * 상품 필터 컴포넌트
 * 가격대 및 판매 상태 필터 제공 (Desktop/Mobile 모두 지원)
 */

import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal';
import X from 'lucide-react/dist/esm/icons/x';
import type { SaleStatus } from '@/types/product';
import type { Category } from '@/types/category';

export const SALE_STATUS_OPTIONS: { value: SaleStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ON_SALE', label: '판매중' },
  { value: 'RESERVED', label: '예약중' },
  { value: 'SOLD_OUT', label: '판매완료' },
];

export interface ProductFilterState {
  minPrice: number;
  maxPrice: number;
  status: SaleStatus | 'all';
  categoryId?: string;
}

interface ProductFilterProps {
  filters: ProductFilterState;
  onFilterChange: (key: keyof ProductFilterState, value: string) => void;
  onClearFilters: () => void;
  showCategoryFilter?: boolean;
  categories?: Category[];
}

/**
 * 활성 필터 개수 계산
 */
export const getActiveFilterCount = (filters: ProductFilterState, showCategory = false): number => {
  return [
    showCategory && filters.categoryId,
    filters.minPrice > 0,
    filters.maxPrice > 0,
    filters.status !== 'all',
  ].filter(Boolean).length;
};

/**
 * Desktop 사이드바 필터
 */
export const DesktopProductFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  showCategoryFilter = false,
}: ProductFilterProps) => {
  const activeFilterCount = getActiveFilterCount(filters, showCategoryFilter);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">필터</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-primary-600 hover:underline"
          >
            초기화
          </button>
        )}
      </div>

      {/* 가격대 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">가격대</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="최소"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
          />
          <span className="text-neutral-400">~</span>
          <input
            type="number"
            placeholder="최대"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
          />
        </div>
      </div>

      {/* 판매 상태 */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 mb-2">판매 상태</h4>
        <div className="space-y-1">
          {SALE_STATUS_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={filters.status === opt.value}
                onChange={() => onFilterChange('status', opt.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MobileFilterButtonProps {
  activeFilterCount: number;
  onClick: () => void;
}

/**
 * 모바일 필터 버튼
 */
export const MobileFilterButton = ({ activeFilterCount, onClick }: MobileFilterButtonProps) => (
  <button
    onClick={onClick}
    className="md:hidden flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
  >
    <SlidersHorizontal className="w-4 h-4" />
    필터
    {activeFilterCount > 0 && (
      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-500 text-white rounded-full">
        {activeFilterCount}
      </span>
    )}
  </button>
);

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilterState;
  onFilterChange: (key: keyof ProductFilterState, value: string) => void;
  onClearFilters: () => void;
  showCategoryFilter?: boolean;
  categories?: Category[];
}

/**
 * 모바일 필터 모달 (바텀시트)
 */
export const MobileFilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  showCategoryFilter = false,
  categories = [],
}: MobileFilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">필터</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* 카테고리 - 옵션 */}
          {showCategoryFilter && (
            <div>
              <h3 className="font-semibold mb-3">카테고리</h3>
              <div className="space-y-1">
                <button
                  onClick={() => onFilterChange('categoryId', '')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    !filters.categoryId ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
                  }`}
                >
                  전체
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onFilterChange('categoryId', cat.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      filters.categoryId === cat.id ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 가격대 */}
          <div>
            <h3 className="font-semibold mb-3">가격대</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="최소"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
              />
              <span className="text-neutral-400">~</span>
              <input
                type="number"
                placeholder="최대"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
              />
            </div>
          </div>

          {/* 판매 상태 */}
          <div>
            <h3 className="font-semibold mb-3">판매 상태</h3>
            <div className="flex flex-wrap gap-2">
              {SALE_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange('status', opt.value)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    filters.status === opt.value
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-neutral-300 hover:border-primary-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t flex gap-2">
          <button
            onClick={onClearFilters}
            className="flex-1 py-3 border border-neutral-300 rounded-lg font-medium"
          >
            초기화
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};
