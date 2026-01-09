/**
 * 관리자 대시보드 통계 카드
 */

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBgColor?: string;
}

const StatsCard = ({
  icon: Icon,
  label,
  value,
  change,
  iconColor = 'text-primary-600',
  iconBgColor = 'bg-primary-100',
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`text-sm font-medium ${
              change.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change.isPositive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        <p className="text-sm text-neutral-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
