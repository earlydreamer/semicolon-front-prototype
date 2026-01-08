/**
 * 상점 상품 목록 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { Product } from '../../../mocks/products';
import { Store } from 'lucide-react';

interface ShopProductListProps {
  products: Product[];
  shopName: string;
}

const ShopProductList = ({ products, shopName }: ShopProductListProps) => {
  // 판매중인 상품만 필터링
  const activeProducts = products.filter((p) => p.saleStatus === 'ON_SALE');

  if (activeProducts.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <Store className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-500 mb-2">판매중인 상품이 없습니다</p>
        <p className="text-sm text-neutral-400">{shopName}의 새로운 상품을 기다려주세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {activeProducts.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-primary-300 hover:shadow-md transition-all"
        >
          {/* 상품 이미지 */}
          <div className="aspect-square overflow-hidden bg-neutral-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* 상품 정보 */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 mb-1 group-hover:text-primary-600">
              {product.title}
            </h3>
            <p className="text-base font-bold text-neutral-900">
              {product.price.toLocaleString('ko-KR')}원
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {product.shippingFee > 0
                ? `배송비 ${product.shippingFee.toLocaleString('ko-KR')}원`
                : '무료배송'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShopProductList;
