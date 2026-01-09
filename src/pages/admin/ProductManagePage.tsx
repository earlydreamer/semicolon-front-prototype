/**
 * 관리자 상품 관리 페이지
 */

import AdminProductList from '@/components/features/admin/AdminProductList';

const ProductManagePage = () => {
  return (
    <div className="p-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">상품 관리</h1>
        <p className="text-neutral-500 mt-1">등록된 상품을 관리합니다</p>
      </div>

      {/* 상품 목록 */}
      <AdminProductList />
    </div>
  );
};

export default ProductManagePage;
