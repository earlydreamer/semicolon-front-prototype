import Search from 'lucide-react/dist/esm/icons/search';


import { Button } from '@/components/common/Button';
import { AdminProductTable } from '@/components/features/admin/AdminProductTable';
import { useAdminProducts, type FilterStatus } from '@/hooks/admin/useAdminProducts';

const AdminProductList = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    products,
    totalCount,
    openMenuId,
    isLoading,
    errorMessage,
    loadProducts,
    toggleMenu,
    closeMenu,
    suspendProduct,
    deleteProduct,
  } = useAdminProducts();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-neutral-200 space-y-3 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="admin-product-search" className="sr-only">
              상품명 검색
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              id="admin-product-search"
              name="q"
              type="search"
              placeholder="상품명 검색…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
            />
          </div>

          <label htmlFor="admin-product-status-filter" className="sr-only">
            상태 필터
          </label>
          <select
            id="admin-product-status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white transition-shadow"
          >
            <option value="all">전체 상태</option>
            <option value="ON_SALE">판매중</option>
            <option value="RESERVED">거래중</option>
            <option value="SOLD_OUT">판매완료</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-neutral-500" role="status" aria-live="polite">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent mb-2" />
          <p>상품 목록을 불러오는 중이에요…</p>
        </div>
      ) : errorMessage ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <Button variant="outline" onClick={() => void loadProducts()}>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          <AdminProductTable
            products={products}
            openMenuId={openMenuId}
            onToggleMenu={toggleMenu}
            onCloseMenu={closeMenu}
            onSuspend={suspendProduct}
            onDelete={deleteProduct}
          />

          {products.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : null}

          <div className="p-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-50/50">
            <p className="text-sm text-neutral-500 font-medium">
              총 {new Intl.NumberFormat('ko-KR').format(totalCount)}개 상품
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductList;
