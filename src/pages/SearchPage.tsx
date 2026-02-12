/**
 * 검색 결과 페이지입니다.
 * 카테고리 사이드바와 필터를 함께 제공합니다.
 */

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal';
import X from 'lucide-react/dist/esm/icons/x';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { type SaleStatus, type ProductListItem } from '@/types/product';
import type { Category } from '@/types/category';
import { CategorySidebar } from '@/components/features/category/CategorySidebar';
import { sanitizeUrlParam } from '@/utils/sanitize';
import { productService } from '@/services/productService';
import { transformCategories } from '@/utils/category';

const SALE_STATUS_OPTIONS: { value: SaleStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ON_SALE', label: '판매중' },
  { value: 'RESERVED', label: '예약중' },
  { value: 'SOLD_OUT', label: '판매완료' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);

  // URL 파라미터는 sanitize 후 사용합니다.
  const query = sanitizeUrlParam(searchParams.get('q'));
  const categoryId = sanitizeUrlParam(searchParams.get('category'));
  const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0', 10);
  const status = (searchParams.get('status') || 'all') as SaleStatus | 'all';
  const sortParam = searchParams.get('sort') || 'latest';

  // URL 정렬값을 드롭다운 정렬값으로 매핑합니다.
  const sort: SortOption =
    sortParam === 'price_asc'
      ? 'price-asc'
      : sortParam === 'price_desc'
        ? 'price-desc'
        : (sortParam as SortOption);

  // 카테고리 목록을 불러옵니다.
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(transformCategories(data));
      } catch (error) {
        console.error('카테고리를 불러오지 못했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 상품 목록을 불러옵니다.
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const sortMap: Record<SortOption, string> = {
          latest: 'recent',
          'price-asc': 'price_asc',
          'price-desc': 'price_desc',
          popular: 'popular',
        };

        const response = await productService.getProducts({
          categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
          sort: sortMap[sort],
          page: 0,
          size: 100,
        });

        setProducts(response.items || response.content || []);
      } catch (error) {
        console.error('상품을 불러오지 못했습니다.', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, sort]);

  // 현재 카테고리 이름을 트리에서 찾습니다.
  const getCategoryName = (catId: string): string => {
    const findInTree = (cats: Category[]): string | null => {
      for (const cat of cats) {
        if (String(cat.id) === catId) return cat.name;
        if (cat.children) {
          const found = findInTree(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(categories) || '';
  };

  const currentCategoryName = categoryId ? getCategoryName(categoryId) : '';

  // 화면 표시용 필터링입니다.
  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (query) {
      const lowerQuery = query.toLowerCase();
      if (query.startsWith('@')) {
        const targetShopName = query.slice(1).toLowerCase();
        results = results.filter((p) => String(p.title).toLowerCase().includes(targetShopName));
      } else {
        results = results.filter((p) => p.title.toLowerCase().includes(lowerQuery));
      }
    }

    if (minPrice > 0) {
      results = results.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      results = results.filter((p) => p.price <= maxPrice);
    }

    if (status !== 'all') {
      results = results.filter((p) => p.saleStatus === status);
    }

    return results;
  }, [products, query, minPrice, maxPrice, status]);

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    const sortValue =
      newSort === 'price-asc' ? 'price_asc' : newSort === 'price-desc' ? 'price_desc' : newSort;
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '0') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  const activeFilterCount = [categoryId, minPrice > 0, maxPrice > 0, status !== 'all'].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼/제목 */}
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
        {/* 사이드바 */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <CategorySidebar />

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">필터</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">
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

        {/* 메인 영역 */}
        <main className="flex-1">
          {/* 툴바 */}
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

          {/* 상품 목록 */}
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="py-20 text-center text-neutral-500 bg-neutral-50 rounded-lg">
              <Search className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="mb-2">검색 결과가 없습니다.</p>
              {(query || activeFilterCount > 0) && (
                <button onClick={clearFilters} className="text-primary-600 hover:underline text-sm">
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
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', String(cat.id))}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        categoryId === String(cat.id) ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
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
