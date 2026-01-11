/**
 * 검색 결과 페이지
 * 카테고리 페이지와 동일한 레이아웃 구조 사용
 */

import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { MOCK_PRODUCTS, type SaleStatus } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { CategorySidebar } from '@/components/features/category/CategorySidebar';
import { sanitizeUrlParam } from '@/utils/sanitize';

const SALE_STATUS_OPTIONS: { value: SaleStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ON_SALE', label: '판매중' },
  { value: 'RESERVED', label: '예약중' },
  { value: 'SOLD_OUT', label: '판매완료' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // URL 파라미터에서 검색 조건 읽기 (XSS 방지를 위해 sanitize 적용)
  const query = sanitizeUrlParam(searchParams.get('q'));
  const categoryId = sanitizeUrlParam(searchParams.get('category'));
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0');
  const status = (searchParams.get('status') || 'all') as SaleStatus | 'all';
  const sortParam = searchParams.get('sort') || 'latest';
  
  // SortOption 타입 매핑
  const sort: SortOption = sortParam === 'price_asc' ? 'price-asc' : 
                           sortParam === 'price_desc' ? 'price-desc' : 
                           sortParam as SortOption;

  // 현재 카테고리 이름 찾기
  const getCategoryName = (catId: string): string => {
    const findInTree = (cats: typeof MOCK_CATEGORIES): string | null => {
      for (const cat of cats) {
        if (cat.id === catId) return cat.name;
        if (cat.children) {
          const found = findInTree(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(MOCK_CATEGORIES) || '';
  };

  const currentCategoryName = categoryId ? getCategoryName(categoryId) : '';

  // 필터링 및 정렬
  const filteredProducts = useMemo(() => {
    let results = [...MOCK_PRODUCTS];

    // 키워드 검색
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // 카테고리 필터
    if (categoryId) {
      // 해당 카테고리 및 하위 카테고리 모두 포함
      const targetIds = new Set<string>();
      targetIds.add(categoryId);

      const collectChildIds = (cats: typeof MOCK_CATEGORIES) => {
        for (const cat of cats) {
          if (cat.id === categoryId || targetIds.has(cat.id)) {
            targetIds.add(cat.id);
            if (cat.children) {
              const addChildren = (children: typeof MOCK_CATEGORIES) => {
                for (const child of children) {
                  targetIds.add(child.id);
                  if (child.children) addChildren(child.children);
                }
              };
              addChildren(cat.children);
            }
          } else if (cat.children) {
            collectChildIds(cat.children);
          }
        }
      };
      collectChildIds(MOCK_CATEGORIES);

      results = results.filter((p) => p.categoryId && targetIds.has(p.categoryId));
    }

    // 가격 필터
    if (minPrice > 0) {
      results = results.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      results = results.filter((p) => p.price <= maxPrice);
    }

    // 상태 필터
    if (status !== 'all') {
      results = results.filter((p) => p.saleStatus === status);
    }

    // 정렬
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [query, categoryId, minPrice, maxPrice, status, sort]);

  // 정렬 변경
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    const sortValue = newSort === 'price-asc' ? 'price_asc' : 
                      newSort === 'price-desc' ? 'price_desc' : newSort;
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  // 필터 변경
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '0') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  // 필터 초기화
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  // 활성 필터 개수
  const activeFilterCount = [categoryId, minPrice > 0, maxPrice > 0, status !== 'all'].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
          <Link to="/" className="hover:text-neutral-900">홈</Link>
          <ChevronRight className="h-3 w-3" />
          <span>검색</span>
          {currentCategoryName && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{currentCategoryName}</span>
            </>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900">
          {query ? `"${query}" 검색 결과` : '전체 상품'}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - 카테고리 + 필터 */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* 카테고리 사이드바 (기존 컴포넌트 재사용) */}
            <CategorySidebar />
            
            {/* 추가 필터 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">필터</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
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
                    value={minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
                  />
                  <span className="text-neutral-400">~</span>
                  <input
                    type="number"
                    placeholder="최대"
                    value={maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
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
                        checked={status === opt.value}
                        onChange={() => updateFilter('status', opt.value)}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-600">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500">
                총 <strong className="text-neutral-900">{filteredProducts.length}</strong>개
              </span>
              
              {/* 모바일 필터 버튼 */}
              <button
                onClick={() => setShowMobileFilters(true)}
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
            </div>
            
            <ProductSortDropdown currentSort={sort} onSortChange={handleSortChange} />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="py-20 text-center text-neutral-500 bg-neutral-50 rounded-lg">
              <Search className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="mb-2">검색 결과가 없습니다.</p>
              {(query || activeFilterCount > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:underline text-sm"
                >
                  필터 초기화
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 모바일 필터 모달 */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">필터</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* 카테고리 */}
              <div>
                <h3 className="font-semibold mb-3">카테고리</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      !categoryId ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
                    }`}
                  >
                    전체
                  </button>
                  {MOCK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        categoryId === cat.id ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 가격대 */}
              <div>
                <h3 className="font-semibold mb-3">가격대</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="최소"
                    value={minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                  />
                  <span className="text-neutral-400">~</span>
                  <input
                    type="number"
                    placeholder="최대"
                    value={maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
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
                      onClick={() => updateFilter('status', opt.value)}
                      className={`px-4 py-2 rounded-full text-sm border ${
                        status === opt.value
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
                onClick={clearFilters}
                className="flex-1 py-3 border border-neutral-300 rounded-lg font-medium"
              >
                초기화
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
