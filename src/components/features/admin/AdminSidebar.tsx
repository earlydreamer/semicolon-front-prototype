/**
 * 관리자 사이드바 네비게이션
 */

import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FolderTree,
  LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: '대시보드', href: '/admin' },
  { icon: Package, label: '상품 관리', href: '/admin/products' },
  { icon: Users, label: '회원 관리', href: '/admin/users' },
  { icon: FolderTree, label: '카테고리 관리', href: '/admin/categories' },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-neutral-900 text-white min-h-screen flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-bold">
          <span className="text-primary-400">Semicolon</span>
          <span className="text-sm font-normal text-neutral-400 ml-2">Admin</span>
        </h1>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* 하단 */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">사이트로 돌아가기</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
