/**
 * 移댄뀒怨좊━ ?섏씠吏
 * ?꾪꽣 湲곕뒫 ?ы븿 (媛寃⑸?, ?먮ℓ?곹깭)
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
import type { Category } from '@/types/category';
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
  
  // URL ?뚮씪誘명꽣 寃利?(XSS 諛⑹?)
  const categoryId = sanitizeUrlParam(rawCategoryId);
  
  // URL ?뚮씪誘명꽣?먯꽌 ?꾪꽣 議곌굔 ?쎄린
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0');
  const status = (searchParams.get('status') || 'all') as SaleStatus | 'all';
  const sortParam = searchParams.get('sort') || 'latest';
  
  // SortOption ???留ㅽ븨
  const sort: SortOption = sortParam === 'price_asc' ? 'price-asc' : 
                           sortParam === 'price_desc' ? 'price-desc' : 
                           sortParam as SortOption;

  // ?꾪꽣 ?곹깭
  const filters: ProductFilterState = {
    minPrice,
    maxPrice,
    status,
  };

  // 移댄뀒怨좊━ ?곗씠??濡쒕뱶
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

  // ?곹뭹 ?곗씠??濡쒕뱶
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
        // Backend response uses 'items' field
        const productList = response.items || [];
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

  const currentCategoryName = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1].name : '?꾩껜 ?곹뭹';

  // Filter Products (?꾨줎?몄뿏?쒖뿉??異붽? ?꾪꽣留?
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 媛寃??꾪꽣
    if (minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // ?곹깭 ?꾪꽣
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.saleStatus === status);
    }

    return filtered;
  }, [products, minPrice, maxPrice, status]);

  // ?뺣젹 蹂寃?
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    const sortValue = newSort === 'price-asc' ? 'price_asc' : 
                      newSort === 'price-desc' ? 'price_desc' : newSort;
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  // ?꾪꽣 蹂寃?
  const updateFilter = (key: keyof ProductFilterState, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '0') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  // ?꾪꽣 珥덇린??
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
            ?꾩껜
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
                <span className="text-sm text-neutral-500">濡쒕뵫 以?..</span>
              ) : (
                <span className="text-sm text-neutral-500">
                  珥?<strong className="text-neutral-900">{filteredProducts.length}</strong>媛?
                </span>
              )}
              
              {/* 紐⑤컮???꾪꽣 踰꾪듉 */}
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
              <p className="mb-2">?대떦 議곌굔??留욌뒗 ?곹뭹???놁뒿?덈떎.</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:underline text-sm"
                >
                  ?꾪꽣 珥덇린??
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 紐⑤컮???꾪꽣 紐⑤떖 */}
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


