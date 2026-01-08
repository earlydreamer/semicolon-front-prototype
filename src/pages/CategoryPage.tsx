import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { CategoryNav } from '@/components/features/category/CategoryNav';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [sort, setSort] = useState<SortOption>('latest');

  // Find current category name and path
  const currentCategoryName = useMemo(() => {
    if (!categoryId) return '전체 상품';
    
    // Simple BFS to find category name
    const queue = [...MOCK_CATEGORIES];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node?.id === categoryId) return node.name;
      if (node?.children) queue.push(...node.children);
    }
    return categoryId;
  }, [categoryId]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    if (categoryId) {
      // In a real app, this would be backend filtering or recursive check
      // Here we just match the exact categoryId for simplicity, or partial check if needed
      products = products.filter(p => p.categoryId === categoryId);
    }

    switch (sort) {
      case 'latest':
        // Mock data doesn't have real date objects, assuming array order is latest
        break;
      case 'popular':
        // Mock logic
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
    }

    return products;
  }, [categoryId, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
          <Link to="/" className="hover:text-neutral-900">홈</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-neutral-900">{currentCategoryName}</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">{currentCategoryName}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar (Category Nav) */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="sticky top-24 border border-neutral-200 rounded-lg bg-white overflow-hidden">
             <div className="p-4 border-b border-neutral-100 font-bold bg-neutral-50">
               카테고리
             </div>
             {/* Reusing CategoryNav in sidebar mode or just simple list */}
             {/* For now, just listing 1st depth for simplicity or reusing CategoryNav logic? 
                 Let's make a simple vertical list here since CategoryNav is designed for Overlay/Mobile 
             */}
             <div className="flex flex-col">
               {MOCK_CATEGORIES.map((cat) => (
                 <Link 
                   key={cat.id} 
                   to={`/categories/${cat.id}`}
                   className={`px-4 py-3 text-sm hover:bg-neutral-50 flex justify-between items-center ${cat.id === categoryId ? 'text-primary-600 font-bold bg-neutral-50' : 'text-neutral-600'}`}
                 >
                   {cat.name}
                   {/* <ChevronRight className="h-3 w-3 text-neutral-300" /> */}
                 </Link>
               ))}
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
            <span className="text-sm text-neutral-500">
              총 <strong className="text-neutral-900">{filteredProducts.length}</strong>개
            </span>
            <ProductSortDropdown currentSort={sort} onSortChange={setSort} />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="py-20 text-center text-neutral-500 bg-neutral-50 rounded-lg">
              <p>해당 카테고리에 등록된 상품이 없습니다.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
