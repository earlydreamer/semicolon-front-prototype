/**
 * 카테고리 페이지
 * 필터 기능 포함 (가격대, 판매상태)
 */

import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { 
  DesktopProductFilter, 
  MobileFilterButton, 
  MobileFilterModal,
  getActiveFilterCount,
  type ProductFilterState 
} from '@/components/features/product/ProductFilter';
import { MOCK_PRODUCTS, type SaleStatus } from '@/mocks/products';
import { MOCK_CATEGORIES, type Category } from '@/mocks/categories';
import { CategorySidebar } from '@/components/features/category/CategorySidebar';
import { findCategoryPath, getCategoryChildren } from '@/utils/category';
import { cn } from '@/utils/cn';
import { sanitizeUrlParam } from '@/utils/sanitize';

export default function CategoryPage() {
  const { categoryId: rawCategoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // URL 파라미터 검증 (XSS 방지)
  const categoryId = sanitizeUrlParam(rawCategoryId);
  
  // URL 파라미터에서 필터 조건 읽기
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0');
  const status = (searchParams.get('status') || 'all') as SaleStatus | 'all';
  const sortParam = searchParams.get('sort') || 'latest';
  
  // SortOption 타입 매핑
  const sort: SortOption = sortParam === 'price_asc' ? 'price-asc' : 
                           sortParam === 'price_desc' ? 'price-desc' : 
                           sortParam as SortOption;

  // 필터 상태
  const filters: ProductFilterState = {
    minPrice,
    maxPrice,
    status,
  };

  // Find current category path
  const categoryPath = useMemo(() => {
    if (!categoryId) return [];
    return findCategoryPath(MOCK_CATEGORIES, categoryId) || [];
  }, [categoryId]);

  const currentCategoryName = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1].name : '전체 상품';

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    if (categoryId) {
      // Find all descendant category IDs
      const targetIds = new Set<string>();
      targetIds.add(categoryId);

      // Helper to find node and collect descendants
      const queue = [...MOCK_CATEGORIES];
      let targetNode = null;

      // 1. Find the target node
      while (queue.length > 0) {
        const node = queue.shift();
        if (node?.id === categoryId) {
          targetNode = node;
          break;
        }
        if (node?.children) queue.push(...node.children);
      }

      // 2. If found, collect all children IDs
      if (targetNode) {
        const childQueue = [targetNode];
        while (childQueue.length > 0) {
          const node = childQueue.shift();
          if (node) {
            targetIds.add(node.id);
            if (node.children) {
              childQueue.push(...node.children);
            }
          }
        }
      }

      products = products.filter(p => p.categoryId && targetIds.has(p.categoryId));
    }

    // 가격 필터
    if (minPrice > 0) {
      products = products.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      products = products.filter((p) => p.price <= maxPrice);
    }

    // 상태 필터
    if (status !== 'all') {
      products = products.filter((p) => p.saleStatus === status);
    }

    // 정렬
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return products;
  }, [categoryId, minPrice, maxPrice, status, sort]);

  // 정렬 변경
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    const sortValue = newSort === 'price-asc' ? 'price_asc' : 
                      newSort === 'price-desc' ? 'price_desc' : newSort;
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  // 필터 변경
  const updateFilter = (key: keyof ProductFilterState, value: string) => {
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
    setSearchParams({});
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
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
        <h1 className="text-2xl font-bold text-neutral-900">{currentCategoryName}</h1>
      </div>

      {/* Mobile Category Filter (Horizontal Scroll) */}
      <div className="md:hidden -mx-4 mb-6 border-b border-neutral-100 bg-white sticky top-16 z-20">
        <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
          <Link
            to={categoryPath.length > 1 
              ? `/categories/${categoryPath[categoryPath.length - 2].id}` 
              : '/'}
            className="flex-shrink-0 px-4 py-1.5 rounded-full bg-neutral-100 text-sm font-medium text-neutral-600 hover:bg-neutral-200"
          >
            전체
          </Link>
          {/* Current siblings or children */}
          {(categoryId ? 
            (getCategoryChildren(MOCK_CATEGORIES, categoryId) || []) : 
            MOCK_CATEGORIES
          ).map((cat: Category) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                cat.id === categoryId
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar (Category Nav + Filter) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <CategorySidebar />
            <DesktopProductFilter 
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
            />
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
              <MobileFilterButton 
                activeFilterCount={activeFilterCount}
                onClick={() => setShowMobileFilters(true)}
              />
            </div>
            
            <ProductSortDropdown currentSort={sort} onSortChange={handleSortChange} />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="py-20 text-center text-neutral-500 bg-neutral-50 rounded-lg">
              <Search className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="mb-2">해당 조건에 맞는 상품이 없습니다.</p>
              {activeFilterCount > 0 && (
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
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
