import { useMemo } from 'react';
import type { Product, ProductListItem, SaleStatus } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ProductSkeletonList } from './ProductSkeleton';
import { PAGINATION } from '@/constants';

interface ProductListProps {
  products: (Product | ProductListItem)[];
  title?: string;
  enableInfiniteScroll?: boolean;
  embedded?: boolean;
}

interface InfiniteProductGridProps {
  products: (Product | ProductListItem)[];
}

type ListProduct = Product | ProductListItem;

const getProductId = (product: ListProduct) => ('productUuid' in product ? product.productUuid : product.id);

const getSaleStatus = (product: ListProduct): SaleStatus => product.saleStatus ?? 'ON_SALE';

function InfiniteProductGrid({ products }: InfiniteProductGridProps) {
  const { displayItems, isLoading, hasMore, observerTarget } = useInfiniteScroll(products, {
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 min-[380px]:gap-4 sm:grid-cols-3 md:grid-cols-4">
        {displayItems.map((product) => (
          <ProductCard key={getProductId(product)} product={product} />
        ))}
        {isLoading && <ProductSkeletonList count={4} />}
      </div>

      <div ref={observerTarget} className="mt-10 w-full py-6 text-center min-[360px]:mt-12 min-[360px]:py-8">
        {!hasMore && products.length > 0 && (
          <p className="text-neutral-500 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
            모든 상품을 다 확인했어요!
          </p>
        )}
      </div>
    </>
  );
}

/**
 * 상품 그리드 리스트 컴포넌트
 * 무한 스크롤 페이징 및 스켈레톤 UI 지원
 */
export function ProductList({ 
  products, 
  title, 
  enableInfiniteScroll = true,
  embedded = false,
}: ProductListProps) {
  // 품절 상품을 뒤로 보내는 정렬 로직 (useMemo로 참조 고정)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aSaleStatus = getSaleStatus(a);
      const bSaleStatus = getSaleStatus(b);
      const aSoldOut = aSaleStatus === 'SOLD_OUT' || aSaleStatus === 'RESERVED';
      const bSoldOut = bSaleStatus === 'SOLD_OUT' || bSaleStatus === 'RESERVED';
      if (aSoldOut && !bSoldOut) return 1;
      if (!aSoldOut && bSoldOut) return -1;
      return 0;
    });
  }, [products]);

  const infiniteResetKey = useMemo(
    () => sortedProducts.map((product) => getProductId(product)).join('|'),
    [sortedProducts]
  );

  return (
    <section className={embedded ? 'py-2' : 'container mx-auto px-3 py-8 min-[360px]:px-4 min-[360px]:py-10 md:py-12'}>
      {title && (
        <h2 className="mb-5 text-xl font-bold text-neutral-900 min-[360px]:mb-6 min-[360px]:text-2xl">
          {title}
        </h2>
      )}
      
      {/* 
        초소형 화면(320px 미만): 1열
        320px 이상: 2열
        sm(640px) 이상: 3열
        md(768px) 이상: 4열
      */}
      {enableInfiniteScroll ? (
        <InfiniteProductGrid key={infiniteResetKey} products={sortedProducts} />
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 min-[380px]:gap-4 sm:grid-cols-3 md:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={getProductId(product)} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
