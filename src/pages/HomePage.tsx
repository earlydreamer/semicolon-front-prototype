import { useEffect } from 'react';
import { HeroBanner } from '@/components/features/home/HeroBanner';
import { ProductList } from '@/components/features/product/ProductList';
import { useProductStore } from '@/stores/useProductStore';

export default function HomePage() {
  const { featuredProducts, isLoading, error, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-screen bg-neutral-0">
      <HeroBanner />

      {isLoading && (
        <div className="flex justify-center py-14 min-[360px]:py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="flex justify-center px-4 py-14 text-center text-neutral-500 min-[360px]:py-20">
          상품 정보를 불러오는 중 오류가 발생했습니다.
        </div>
      )}

      {!isLoading && !error && (
        <ProductList title="오늘의 상품 추천" products={featuredProducts} />
      )}

      <div className="h-14 min-[360px]:h-20" />
    </div>
  );
}
