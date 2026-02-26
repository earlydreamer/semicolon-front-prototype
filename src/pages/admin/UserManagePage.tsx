/**
 * 관리자 회원 관리 페이지
 */

import AdminUserList from '@/components/features/admin/AdminUserList';

const UserManagePage = () => {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">회원 관리</h1>
        <p className="text-neutral-500 mt-1">가입된 회원을 관리합니다</p>
      </div>

      {/* 회원 목록 */}
      <AdminUserList />
    </div>
  );
};

export default UserManagePage;

