import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu';
import Bell from 'lucide-react/dist/esm/icons/bell';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import AdminSidebar from '../features/admin/AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // 페이지 이동 시 모바일 사이드바 닫기
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      {/* 사이드바 오버레이 (모바일) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 관리자 상단 헤더 */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-3 min-[360px]:px-4 lg:px-8">
          <div className="flex items-center gap-2 min-[360px]:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-semibold text-neutral-800 hidden sm:block">관리자 시스템</h2>
          </div>

          <div className="flex items-center gap-2 min-[360px]:gap-4">
            <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-neutral-900">최고관리자</p>
                <p className="text-xs text-neutral-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto p-3 min-[360px]:p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
