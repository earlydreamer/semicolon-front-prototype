/**
 * 프로필 통계 컴포넌트
 */

import { Package, ShoppingBag, Coins } from 'lucide-react';

interface ProfileStatsProps {
  salesCount: number;
  purchaseCount: number;
  deposit: number;
}

const ProfileStats = ({ salesCount, purchaseCount, deposit }: ProfileStatsProps) => {
  const stats = [
    {
      label: '판매',
      value: salesCount,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: '구매',
      value: purchaseCount,
      icon: ShoppingBag,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: '예치금',
      value: deposit.toLocaleString('ko-KR'),
      suffix: '원',
      icon: Coins,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 border border-neutral-200 text-center"
        >
          <div
            className={`w-10 h-10 mx-auto mb-2 rounded-full ${stat.bgColor} flex items-center justify-center`}
          >
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-lg font-bold text-neutral-900">
            {stat.value}
            {stat.suffix && <span className="text-sm font-medium">{stat.suffix}</span>}
          </p>
          <p className="text-xs text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
