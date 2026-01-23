/**
 * 관리자 상품 목록 컴포넌트
 */

import { useState } from 'react';
import Search from 'lucide-react/dist/esm/icons/search';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { MOCK_PRODUCTS, type Product, type SaleStatus } from '@/mocks/products';
import { formatPrice } from '@/utils/formatPrice';
import { SALE_STATUS_LABELS } from '@/constants';

type FilterStatus = 'all' | SaleStatus;

const STATUS_COLORS: Record<SaleStatus, string> = {
  ON_SALE: 'bg-green-100 text-green-700',
  RESERVED: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-neutral-100 text-neutral-700',
};

const AdminProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.saleStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 상품 정지
  const handleSuspend = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, saleStatus: 'SOLD_OUT' as SaleStatus } : p
      )
    );
    setOpenMenuId(null);
  };

  // 상품 삭제
  const handleDelete = (productId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {/* 헤더 */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="상품명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="ON_SALE">판매중</option>
            <option value="RESERVED">예약중</option>
            <option value="SOLD_OUT">판매완료</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상품</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">판매자</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">가격</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상태</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">등록일</th>
              <th className="text-right text-xs font-medium text-neutral-500 uppercase px-4 py-3">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-neutral-500">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-900">{product.seller.nickname}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPrice(product.price)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[product.saleStatus as SaleStatus] || STATUS_COLORS.ON_SALE}`}>
                    {SALE_STATUS_LABELS[product.saleStatus as SaleStatus] || product.saleStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-neutral-500">
                    {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-500" />
                    </button>

                    {openMenuId === product.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                        <button
                          onClick={() => window.open(`/products/${product.id}`, '_blank')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <Eye className="w-4 h-4" />
                          상품 보기
                        </button>
                        <button
                          onClick={() => handleSuspend(product.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-neutral-50"
                        >
                          <Pause className="w-4 h-4" />
                          판매 정지
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 결과 없음 */}
      {filteredProducts.length === 0 && (
        <div className="p-8 text-center text-neutral-500">
          검색 결과가 없습니다
        </div>
      )}

      {/* 페이지네이션 (간소화) */}
      <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
        <p className="text-sm text-neutral-500">
          총 {filteredProducts.length}개 상품
        </p>
      </div>
    </div>
  );
};

export default AdminProductList;
