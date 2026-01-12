/**
 * 관리자 카테고리 관리 페이지
 */

import CategoryTree from '@/components/features/admin/CategoryTree';

const CategoryManagePage = () => {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">카테고리 관리</h1>
        <p className="text-neutral-500 mt-1">상품 카테고리를 관리합니다</p>
      </div>

      {/* 카테고리 트리 */}
      <CategoryTree />
    </div>
  );
};

export default CategoryManagePage;
