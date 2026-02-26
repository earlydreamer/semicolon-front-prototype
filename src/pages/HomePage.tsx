import { HeroBanner } from '@/components/features/home/HeroBanner';
import { ProductList } from '@/components/features/product/ProductList';
import { MOCK_PRODUCTS } from '@/mocks/products';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-0">
      <HeroBanner />
      <ProductList title="오늘의 상품 추천" products={MOCK_PRODUCTS} />
      
      {/* Spacer for better scrolling experience */}
      <div className="h-20" />
    </div>
  );
}
