/**
 * 寃??寃곌낵 ?섏씠吏
 * 移댄뀒怨좊━ ?섏씠吏? ?숈씪???덉씠?꾩썐 援ъ“ ?ъ슜
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

  // URL ?뚮씪誘명꽣?먯꽌 寃??議곌굔 ?쎄린 (XSS 諛⑹?瑜??꾪빐 sanitize ?곸슜)
  const query = sanitizeUrlParam(searchParams.get('q'));
  const categoryId = sanitizeUrlParam(searchParams.get('category'));
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0');
  const status = (searchParams.get('status') || 'all') as SaleStatus | 'all';
  const sortParam = searchParams.get('sort') || 'latest';
  
  // SortOption ???留ㅽ븨
  const sort: SortOption = sortParam === 'price_asc' ? 'price-asc' : 
                           sortParam === 'price_desc' ? 'price-desc' : 
                           sortParam as SortOption;

  // 移댄뀒怨좊━ ?곗씠??濡쒕뱶
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        // CategoryResponse[] ??Category[] 蹂??
        const convertToCategories = (items: typeof data): Category[] => {
          const buildTree = (parentId: number | null, currentDepth: number): Category[] => {
            return items
              .filter((cat) => cat.parentId === parentId)
              .map((cat) => ({
                id: String(cat.id),
                name: cat.name,
                depth: Math.min(Math.max(currentDepth, 1), 3) as 1 | 2 | 3,
                parentId: cat.parentId === null ? null : String(cat.parentId),
                children: buildTree(cat.id, currentDepth + 1),
              }));
          };
          
          return buildTree(null, 1);
        };
        
        setCategories(convertToCategories(data));
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
      try {
        const sortMap: Record<SortOption, string> = {
          'latest': 'recent',
          'price-asc': 'price_asc',
          'price-desc': 'price_desc',
          'popular': 'popular'
        };

        const response = await productService.getProducts({
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          sort: sortMap[sort],
          page: 0,
          size: 100
        });
        setProducts(response.items || response.content || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryId, sort]);

  // ?꾩옱 移댄뀒怨좊━ ?대쫫 李얘린
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

  // ?꾪꽣留?(?꾨줎?몄뿏?쒖뿉??異붽? 寃??諛??꾪꽣)
  const filteredProducts = useMemo(() => {
    let results = [...products];

    // ?ㅼ썙??寃??
    if (query) {
      const lowerQuery = query.toLowerCase();
      // @濡??쒖옉?섎㈃ ?곸젏紐낅쭔 寃??(諛깆뿏?쒖뿉??吏???덈릺誘濡??꾨줎?몄뿉??泥섎━)
      if (query.startsWith('@')) {
        const targetShopName = query.slice(1).toLowerCase();
        results = results.filter(
          (p) => String(p.title).toLowerCase().includes(targetShopName)
        );
      } else {
        // ?쇰컲 寃?? ?곹뭹紐낅쭔 寃??
        results = results.filter(
          (p) => p.title.toLowerCase().includes(lowerQuery)
        );
      }
    }

    // 媛寃??꾪꽣
    if (minPrice > 0) {
      results = results.filter((p) => p.price >= minPrice);
    }
    if (maxPrice > 0) {
      results = results.filter((p) => p.price <= maxPrice);
    }

    // ?곹깭 ?꾪꽣
    if (status !== 'all') {
      results = results.filter((p) => p.saleStatus === status);
    }

    return results;
  }, [products, query, minPrice, maxPrice, status]);

  // ?뺣젹 蹂寃?
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    const sortValue = newSort === 'price-asc' ? 'price_asc' : 
                      newSort === 'price-desc' ? 'price_desc' : newSort;
    params.set('sort', sortValue);
    setSearchParams(params);
  };

  // ?꾪꽣 蹂寃?
  const updateFilter = (key: string, value: string) => {
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
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  // ?쒖꽦 ?꾪꽣 媛쒖닔
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
          {query ? `"${query}" 寃??寃곌낵` : '?꾩껜 ?곹뭹'}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - 移댄뀒怨좊━ + ?꾪꽣 */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* 移댄뀒怨좊━ ?ъ씠?쒕컮 (湲곗〈 而댄룷?뚰듃 ?ъ궗?? */}
            <CategorySidebar />
            
            {/* 異붽? ?꾪꽣 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900">?꾪꽣</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    珥덇린??
                  </button>
                )}
              </div>

              {/* 媛寃⑸? */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">媛寃⑸?</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="理쒖냼"
                    value={minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
                  />
                  <span className="text-neutral-400">~</span>
                  <input
                    type="number"
                    placeholder="理쒕?"
                    value={maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* ?먮ℓ ?곹깭 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">?먮ℓ ?곹깭</h4>
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
                珥?<strong className="text-neutral-900">{filteredProducts.length}</strong>媛?
              </span>
              
              {/* 紐⑤컮???꾪꽣 踰꾪듉 */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
              >
                <SlidersHorizontal className="w-4 h-4" />
                ?꾪꽣
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
              <p className="mb-2">寃??寃곌낵媛 ?놁뒿?덈떎.</p>
              {(query || activeFilterCount > 0) && (
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
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">?꾪꽣</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* 移댄뀒怨좊━ */}
              <div>
                <h3 className="font-semibold mb-3">移댄뀒怨좊━</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      !categoryId ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-neutral-50'
                    }`}
                  >
                    ?꾩껜
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

              {/* 媛寃⑸? */}
              <div>
                <h3 className="font-semibold mb-3">媛寃⑸?</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="理쒖냼"
                    value={minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                  />
                  <span className="text-neutral-400">~</span>
                  <input
                    type="number"
                    placeholder="理쒕?"
                    value={maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* ?먮ℓ ?곹깭 */}
              <div>
                <h3 className="font-semibold mb-3">?먮ℓ ?곹깭</h3>
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
                珥덇린??
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium"
              >
                ?곸슜?섍린
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;


