/**
 * 상점 통계 컴포넌트
 */

import Package from 'lucide-react/dist/esm/icons/package';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Users from 'lucide-react/dist/esm/icons/users';
import Star from 'lucide-react/dist/esm/icons/star';

interface ShopStatsProps {
  salesCount: number;
  activeListingCount: number;
  followerCount: number;
  rating: number;
}

const ShopStats = ({ salesCount, activeListingCount, followerCount, rating }: ShopStatsProps) => {
  const stats = [
    {
      label: '누적 판매',
      value: salesCount,
      icon: ShoppingBag,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: '판매중',
      value: activeListingCount,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: '팔로워',
      value: followerCount,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: '평점',
      value: rating.toFixed(1),
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-3 border border-neutral-200 text-center"
        >
          <div
            className={`w-8 h-8 mx-auto mb-2 rounded-full ${stat.bgColor} flex items-center justify-center`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
          <p className="text-xs text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ShopStats;
