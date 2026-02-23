import type { ComponentType } from 'react';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Image from 'lucide-react/dist/esm/icons/image';
import Package from 'lucide-react/dist/esm/icons/package';
import Users from 'lucide-react/dist/esm/icons/users';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import FlaskConical from 'lucide-react/dist/esm/icons/flask-conical';
import FolderTree from 'lucide-react/dist/esm/icons/folder-tree';
import ChartNoAxesCombined from 'lucide-react/dist/esm/icons/chart-no-axes-combined';

export type AdminNavItem = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  description: string;
  accent: string;
  external?: boolean;
};

const grafanaUrl = import.meta.env.VITE_GRAFANA_URL || '/admin/grafana';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: 'dashboard',
    label: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
    description: '운영 메뉴 허브에서 빠르게 이동합니다.',
    accent: 'from-slate-400/20 to-slate-500/5 border-slate-200',
  },
  {
    key: 'banners',
    label: '배너 관리',
    href: '/admin/banners',
    icon: Image,
    description: '메인 배너 노출 순서와 활성 상태를 관리합니다.',
    accent: 'from-amber-400/20 to-amber-500/5 border-amber-200',
  },
  {
    key: 'products',
    label: '상품 관리',
    href: '/admin/products',
    icon: Package,
    description: '상품 상태와 재고 여부를 확인하고 관리합니다.',
    accent: 'from-blue-400/20 to-blue-500/5 border-blue-200',
  },
  {
    key: 'users',
    label: '회원 관리',
    href: '/admin/users',
    icon: Users,
    description: '가입한 사용자 상태와 기본 정보를 조회합니다.',
    accent: 'from-emerald-400/20 to-emerald-500/5 border-emerald-200',
  },
  {
    key: 'reports',
    label: '신고 관리',
    href: '/admin/reports',
    icon: AlertTriangle,
    description: '신고 접수 내역을 검토하고 처리합니다.',
    accent: 'from-rose-400/20 to-rose-500/5 border-rose-200',
  },
  {
    key: 'coupons',
    label: '쿠폰 관리',
    href: '/admin/coupons',
    icon: Ticket,
    description: '쿠폰 생성과 활성 여부를 관리합니다.',
    accent: 'from-orange-400/20 to-orange-500/5 border-orange-200',
  },
  {
    key: 'test-tools',
    label: '테스트 도구',
    href: '/admin/test-tools',
    icon: FlaskConical,
    description: '운영 환경용 관리자 테스트 기능을 실행합니다.',
    accent: 'from-indigo-400/20 to-indigo-500/5 border-indigo-200',
  },
  {
    key: 'categories',
    label: '카테고리 관리',
    href: '/admin/categories',
    icon: FolderTree,
    description: '카테고리 구조와 정렬을 편집합니다.',
    accent: 'from-cyan-400/20 to-cyan-500/5 border-cyan-200',
  },
  {
    key: 'grafana',
    label: 'Grafana',
    href: grafanaUrl,
    icon: ChartNoAxesCombined,
    description: '서비스 메트릭과 로그 대시보드를 확인합니다.',
    accent: 'from-violet-400/20 to-violet-500/5 border-violet-200',
    external: true,
  },
];

