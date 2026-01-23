/**
 * 상점 상품 목록 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { Product, SaleStatus } from '../../../mocks/products';
import { Store, CheckCircle, Clock } from 'lucide-react';

const STATUS_BADGE: Record<string, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-blue-100 text-blue-700' },
  RESERVED: { text: '예약중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-green-100 text-green-700' },
  HIDDEN: { text: '숨김', className: 'bg-neutral-100 text-neutral-700' },
  BLOCKED: { text: '차단됨', className: 'bg-red-100 text-red-700' },
};

const EMPTY_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  ON_SALE: { title: '판매중인 상품이 없습니다', subtitle: '새로운 상품을 기다려주세요!' },
  RESERVED: { title: '예약중인 상품이 없습니다', subtitle: '현재 예약 대기중인 상품이 없어요.' },
  SOLD_OUT: { title: '판매완료된 상품이 없습니다', subtitle: '아직 거래가 완료된 상품이 없어요.' },
};

interface ShopProductListProps {
  products: Product[];
  shopName: string;
  statusFilter?: SaleStatus;
}

const ShopProductList = ({ products, shopName, statusFilter = 'ON_SALE' }: ShopProductListProps) => {
  if (products.length === 0) {
    const emptyMsg = EMPTY_MESSAGES[statusFilter] || EMPTY_MESSAGES.ON_SALE;
    const EmptyIcon = statusFilter === 'SOLD_OUT' ? CheckCircle : statusFilter === 'RESERVED' ? Clock : Store;
    
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <EmptyIcon className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-500 mb-2">{emptyMsg.title}</p>
        <p className="text-sm text-neutral-400">{shopName}의 {emptyMsg.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-primary-300 hover:shadow-md transition-all"
        >
          {/* 상품 이미지 */}
          <div className="aspect-square overflow-hidden bg-neutral-100 relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* 상태 배지 - 모든 상품에 표시 */}
            <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-md ${STATUS_BADGE[product.saleStatus].className}`}>
              {STATUS_BADGE[product.saleStatus].text}
            </span>
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

