import { Link, NavLink } from 'react-router-dom';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { ADMIN_NAV_ITEMS } from '@/constants/adminNavigation';

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  return (
    <aside className="w-64 bg-neutral-900 text-white h-full flex flex-col">
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <span className="text-primary-400">세미콜론</span>
          <span className="text-sm font-normal text-neutral-400 ml-2">운영자</span>
        </h1>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-white p-1"
            aria-label="사이드바 닫기"
          >
            <LogOut className="w-5 h-5 rotate-180" aria-hidden={true} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <li key={item.key}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-[background-color,color]"
                  onClick={onClose}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" aria-hidden={true} />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  <ExternalLink className="w-4 h-4" aria-hidden={true} />
                </a>
              ) : (
                <NavLink
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-[background-color,color,box-shadow] ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`
                  }
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5" aria-hidden={true} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" aria-hidden={true} />
          <span className="font-medium">사이트로 돌아가기</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
