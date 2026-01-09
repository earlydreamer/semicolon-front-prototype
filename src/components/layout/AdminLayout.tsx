/**
 * 관리자 페이지 레이아웃
 */

import { Outlet } from 'react-router-dom';
import AdminSidebar from '../features/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* 사이드바 */}
      <AdminSidebar />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
