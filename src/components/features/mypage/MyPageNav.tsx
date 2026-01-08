/**
 * 마이페이지 빠른 메뉴 네비게이션
 */

import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Package, Settings, ChevronRight } from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

interface MyPageNavProps {
  likeCount: number;
  orderCount: number;
}

const MyPageNav = ({ likeCount, orderCount }: MyPageNavProps) => {
  const menuItems: MenuItem[] = [
    {
      icon: ShoppingBag,
      label: '구매 내역',
      href: '/mypage/orders',
      badge: orderCount,
    },
    {
      icon: Heart,
      label: '좋아요 상품',
      href: '/mypage/likes',
      badge: likeCount,
    },
    {
      icon: Package,
      label: '판매 관리',
      href: '/mypage/sales',
    },
    {
      icon: Settings,
      label: '설정',
      href: '/mypage/settings',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {menuItems.map((item, index) => (
        <Link
          key={item.href}
          to={item.href}
          className={`flex items-center justify-between px-4 py-3.5 hover:bg-neutral-50 transition-colors
            ${index !== menuItems.length - 1 ? 'border-b border-neutral-100' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
              <item.icon className="w-4.5 h-4.5 text-neutral-600" />
            </div>
            <span className="text-sm font-medium text-neutral-900">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.badge !== undefined && item.badge > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyPageNav;
