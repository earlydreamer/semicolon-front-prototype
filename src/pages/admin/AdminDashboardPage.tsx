import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Clock3 from 'lucide-react/dist/esm/icons/clock-3';
import { ADMIN_NAV_ITEMS } from '@/constants/adminNavigation';

type StatusCard = {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  isTime?: boolean;
};

const statusCards: StatusCard[] = [
  {
    title: '관리자 허브',
    value: `${ADMIN_NAV_ITEMS.length}개 메뉴`,
    description: '자주 쓰는 운영 메뉴 바로가기',
    icon: Activity,
  },
  {
    title: '접근 권한',
    value: 'ADMIN',
    description: '관리자 전용 페이지 접근 중',
    icon: ShieldCheck,
  },
  {
    title: '현재 시간',
    value: '',
    description: '대시보드 진입 시각 기준',
    icon: Clock3,
    isTime: true,
  },
];

const formatNow = (date: Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

const AdminDashboardPage = () => {
  const now = useMemo(() => new Date(), []);
  const quickLinks = useMemo(
    () => ADMIN_NAV_ITEMS.filter((item) => item.key !== 'dashboard'),
    []
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.14) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16,185,129,0.12) 0%, transparent 35%)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            Admin Landing
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 lg:text-3xl">운영 대시보드</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 lg:text-base">
            관리자 핵심 메뉴와 운영 도구를 한 곳에서 이동할 수 있는 허브입니다. 현재 운영 흐름에 맞춰 메뉴를 빠르게 선택하세요.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusCards.map((card) => (
          <article key={card.title} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{card.title}</p>
                <p className="mt-2 text-lg font-semibold text-neutral-900">
                  {card.isTime ? formatNow(now) : card.value}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{card.description}</p>
              </div>
              <div className="rounded-lg bg-neutral-100 p-2">
                <card.icon className="h-4 w-4 text-neutral-700" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">빠른 이동</h2>
          <span className="text-xs text-neutral-500">총 {quickLinks.length}개</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const content = (
              <>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-white/70 p-2 backdrop-blur-sm">
                    <item.icon className="h-5 w-5 text-neutral-800" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-500" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-900">{item.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">{item.description}</p>
              </>
            );

            const className = `group rounded-xl border bg-gradient-to-br p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${item.accent}`;

            if (item.external) {
              return (
                <a key={item.key} href={item.href} target="_blank" rel="noreferrer" className={className}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.key} to={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
