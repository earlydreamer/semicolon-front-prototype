import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductList } from '@/components/features/product/ProductList';
import { ProductSortDropdown, type SortOption } from '@/components/features/product/ProductSortDropdown';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { CategorySidebar } from '@/components/features/category/CategorySidebar';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [sort, setSort] = useState<SortOption>('latest');

  // Find current category path
  const categoryPath = useMemo(() => {
    if (!categoryId) return [];

    const findPath = (categories: import('@/mocks/categories').Category[], targetId: string, currentPath: import('@/mocks/categories').Category[]): import('@/mocks/categories').Category[] | null => {
      for (const cat of categories) {
        if (cat.id === targetId) {
          return [...currentPath, cat];
        }
        if (cat.children) {
          const path = findPath(cat.children, targetId, [...currentPath, cat]);
          if (path) return path;
        }
      }
      return null;
    };

    return findPath(MOCK_CATEGORIES, categoryId, []) || [];
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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar (Category Nav) */}
        {/* Sidebar (Category Nav) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CategorySidebar />
          </div>
        </div>

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
