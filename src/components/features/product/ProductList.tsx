import type { Product } from '@/mocks/products';
import { ProductCard } from './ProductCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ProductSkeletonList } from './ProductSkeleton';

interface ProductListProps {
  products: Product[];
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
  const { displayItems, isLoading, hasMore, observerTarget } = useInfiniteScroll(products, {
    pageSize: 12,
  });

  // 무한 스크롤 비활성화 시 전체 표시 (또는 기존 로직 유지 가능)
  const itemsToRender = enableInfiniteScroll ? displayItems : products;

  return (
    <section className="container mx-auto py-12 px-4">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {title}
        </h2>
      )}
      
      {/* 
        1줄당 4개 항목 표시 (md 이상에서 grid-cols-4 고정) 
        데이터가 부족할 경우 grid의 기본 동작에 의해 왼쪽으로 정렬됨
      */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {itemsToRender.map((product) => (
          <ProductCard key={product.id} product={product} />
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
