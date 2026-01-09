/**
 * 판매자 대시보드
 */

import { Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useSellerStore } from '@/stores/useSellerStore';

const SellerDashboard = () => {
  const { getStats } = useSellerStore();
  const stats = getStats();

  const statItems = [
    {
      icon: Package,
      label: '판매중',
      value: stats.onSale,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      label: '예약중',
      value: stats.reserved,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: CheckCircle,
      label: '판매완료',
      value: stats.soldOut,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: TrendingUp,
      label: '총 수익',
      value: stats.totalRevenue.toLocaleString() + '원',
      color: 'bg-purple-100 text-purple-600',
      isLarge: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">판매 현황</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-sm text-neutral-500 mb-1">{item.label}</div>
            <div className={`font-bold ${item.isLarge ? 'text-lg' : 'text-2xl'} text-neutral-900`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
