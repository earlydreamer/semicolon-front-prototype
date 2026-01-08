import type { Product } from '@/mocks/products';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  title?: string;
}

export function ProductList({ products, title }: ProductListProps) {
  return (
    <section className="container mx-auto py-12 px-4">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
