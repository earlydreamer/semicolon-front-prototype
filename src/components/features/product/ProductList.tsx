import { useMemo } from 'react';
import type { Product, ProductListItem } from '@/types/product';
import { ProductCard } from './ProductCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ProductSkeletonList } from './ProductSkeleton';
import { PAGINATION } from '@/constants';

interface ProductListProps {
  products: (Product | ProductListItem)[];
  title?: string;
  enableInfiniteScroll?: boolean;
}

/**
 * 상품 그리드 리스트 컴포넌트
 * 무한 스크롤 페이징 및 스켈레톤 UI 지원
 */
export function ProductList({ 
  products, 
  title, 
  enableInfiniteScroll = true 
}: ProductListProps) {
  // 품절 상품을 뒤로 보내는 정렬 로직 (useMemo로 참조 고정)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aSaleStatus = ('saleStatus' in a) ? a.saleStatus : (a as any).saleStatus || 'ON_SALE';
      const bSaleStatus = ('saleStatus' in b) ? b.saleStatus : (b as any).saleStatus || 'ON_SALE';
      const aSoldOut = aSaleStatus === 'SOLD_OUT' || aSaleStatus === 'RESERVED';
      const bSoldOut = bSaleStatus === 'SOLD_OUT' || bSaleStatus === 'RESERVED';
      if (aSoldOut && !bSoldOut) return 1;
      if (!aSoldOut && bSoldOut) return -1;
      return 0;
    });
  }, [products]);

  const { displayItems, isLoading, hasMore, observerTarget } = useInfiniteScroll(sortedProducts, {
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  // 무한 스크롤 비활성화 시 전체 표시 (또는 기존 로직 유지 가능)
  const itemsToRender = enableInfiniteScroll ? displayItems : sortedProducts;

  return (
    <section className="container mx-auto py-12 px-4">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {title}
        </h2>
      )}
      
      {/* 
        초소형 화면(320px 미만): 1열
        320px 이상: 2열
        sm(640px) 이상: 3열
        md(768px) 이상: 4열
      */}
      <div className="grid grid-cols-1 gap-3 min-[320px]:grid-cols-2 min-[320px]:gap-4 sm:grid-cols-3 md:grid-cols-4">
        {itemsToRender.map((product: any) => (
          <ProductCard key={('productUuid' in product ? product.productUuid : product.id)} product={product} />
        ))}
        
        {/* 로딩 중 스켈레톤 표시 */}
        {isLoading && <ProductSkeletonList count={4} />}
      </div>

      {/* 무한 스크롤 관찰 대상 및 하단 메시지 */}
      <div ref={observerTarget} className="mt-12 w-full py-8 text-center">
        {!hasMore && products.length > 0 && (
          <p className="text-neutral-500 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
            모든 상품을 다 확인했어요!
          </p>
        )}
      </div>
    </section>
  );
}
