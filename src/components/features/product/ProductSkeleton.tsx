/**
 * 상품 리스트 로딩 중 표시되는 스켈레톤 컴포넌트
 * 기존 ProductCard와 레이아웃을 동일하게 유지하여 레이아웃 시프트를 방지함
 */
export function ProductSkeleton() {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-200" />
      
      <div className="flex flex-col gap-2">
        {/* Title Skeleton */}
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        
        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/3 rounded bg-neutral-200 font-bold" />
          <div className="h-3 w-1/4 rounded bg-neutral-200" />
        </div>
        
        {/* Footer Skeleton */}
        <div className="mt-1 flex items-center gap-1 border-t border-neutral-100 pt-2">
          <div className="h-3 w-1/4 rounded bg-neutral-200" />
          <div className="ml-auto flex gap-2">
            <div className="h-3 w-6 rounded bg-neutral-200" />
            <div className="h-3 w-6 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 여러 개의 고정된 개수의 스켈레톤을 표시하는 헬퍼 컴포넌트
 */
interface ProductSkeletonListProps {
  count?: number;
}

export function ProductSkeletonList({ count = 4 }: ProductSkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={`skeleton-${i}`} />
      ))}
    </>
  );
}
