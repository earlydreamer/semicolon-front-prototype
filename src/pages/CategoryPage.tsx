/**
 * 카테고리 페이지
 * 필터 기능 포함 (가격대, 판매상태)
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Search from 'lucide-react/dist/esm/icons/search';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { 
  DesktopProductFilter, 
  MobileFilterButton, 
  MobileFilterModal,
  getActiveFilterCount,
  type ProductFilterState 
} from '@/components/features/product/ProductFilter';
import { type SaleStatus, type ProductListItem } from '@/types/product';
import { type Category } from '@/mocks/categories';
import { CategorySidebar } from '@/components/features/category/CategorySidebar';
import { findCategoryPath, getCategoryChildren, transformCategories } from '@/utils/category';
import { cn } from '@/utils/cn';
import { sanitizeUrlParam } from '@/utils/sanitize';
import { productService } from '@/services/productService';

export default function CategoryPage() {
  const { categoryId: rawCategoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(transformCategories(data));
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // 상품 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setProducts([]); // Clear previous products to avoid confusion
      try {
        const sortMap: Record<SortOption, string> = {
          'latest': 'recent',
          'price-asc': 'price_asc',
          'price-desc': 'price_desc',
          'popular': 'popular'
        };

        const response = await productService.getProducts({
          categoryId: categoryId && !isNaN(parseInt(categoryId)) ? parseInt(categoryId) : undefined,
          sort: sortMap[sort],
          page: 0,
          size: 20
        });
        // Backend response structure might use 'items' instead of 'content' depending on implementation
        // or might return the array directly. This handles common Spring Data Page structures.
        const productList = response.content || [];
        setProducts(productList);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryId, sort]);

  // Find current category path
  const categoryPath = useMemo(() => {
    if (!categoryId || !categories.length) return [];
    return findCategoryPath(categories, categoryId) || [];
  }, [categoryId, categories]);

  const currentCategoryName = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1].name : '전체 상품';

  // Filter Products (프론트엔드에서 추가 필터링)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 가격 필터
    if (minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // 상태 필터
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.saleStatus === status);
    }

    return filtered;
  }, [products, minPrice, maxPrice, status]);

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
            (getCategoryChildren(categories, categoryId) || []) : 
            categories
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
              {loading ? (
                <span className="text-sm text-neutral-500">로딩 중...</span>
              ) : (
                <span className="text-sm text-neutral-500">
                  총 <strong className="text-neutral-900">{filteredProducts.length}</strong>개
                </span>
              )}
              
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
