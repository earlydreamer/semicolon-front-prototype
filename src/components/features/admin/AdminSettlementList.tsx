import { Fragment, useMemo, useState } from 'react';
import Wallet from 'lucide-react/dist/esm/icons/wallet';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { EmptyState } from '@/components/common/EmptyState';
import { MockDataNotice } from '@/components/common/MockDataNotice';

type SettlementStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED';

interface Settlement {
  id: string;
  sellerNickname: string;
  orderId: string;
  productTitle: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: SettlementStatus;
  confirmedAt: string;
  scheduledAt?: string;
  processedAt?: string;
}

const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'settle_1',
    sellerNickname: '캠핑마스터',
    orderId: 'order_123',
    productTitle: '텐트 세트',
    amount: 1500000,
    fee: 45000,
    netAmount: 1455000,
    status: 'PENDING',
    confirmedAt: '2026-01-14T15:30:00',
    scheduledAt: '2026-01-15T00:00:00',
  },
  {
    id: 'settle_2',
    sellerNickname: '기타장인',
    orderId: 'order_124',
    productTitle: '기타 하드케이스',
    amount: 1800000,
    fee: 54000,
    netAmount: 1746000,
    status: 'COMPLETED',
    confirmedAt: '2026-01-13T10:00:00',
    processedAt: '2026-01-14T00:03:45',
  },
];

const STATUS_LABELS: Record<SettlementStatus, { text: string; color: string }> = {
  PENDING: { text: '정산대기', color: 'bg-yellow-100 text-yellow-800' },
  SCHEDULED: { text: '정산예정', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { text: '정산완료', color: 'bg-green-100 text-green-800' },
};

export function AdminSettlementList() {
  const [settlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSettlements = useMemo(() => {
    if (statusFilter === 'all') return settlements;
    return settlements.filter((settlement) => settlement.status === statusFilter);
  }, [settlements, statusFilter]);

  const pendingAmount = settlements
    .filter((settlement) => settlement.status === 'PENDING' || settlement.status === 'SCHEDULED')
    .reduce((sum, settlement) => sum + settlement.netAmount, 0);

  const completedAmount = settlements
    .filter((settlement) => settlement.status === 'COMPLETED')
    .reduce((sum, settlement) => sum + settlement.netAmount, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('ko-KR').format(value);
  const formatDate = (value: string) => new Date(value).toLocaleString('ko-KR');
  const formatDateOnly = (value: string) => new Date(value).toLocaleDateString('ko-KR');

  return (
    <div className="space-y-4">
      <MockDataNotice />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 대기/예정</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(pendingAmount)}원</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 완료 금액</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(completedAmount)}원</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-neutral-200">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">정산 상태</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SettlementStatus | 'all')}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="PENDING">정산대기</option>
            <option value="SCHEDULED">정산예정</option>
            <option value="COMPLETED">정산완료</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {filteredSettlements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">판매자</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상품</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">정산금액</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">구매확정일</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">처리일</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredSettlements.map((settlement) => (
                  <Fragment key={settlement.id}>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[settlement.status].color}`}
                        >
                          {STATUS_LABELS[settlement.status].text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">{settlement.sellerNickname}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{settlement.productTitle}</td>
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 text-right">
                        {formatCurrency(settlement.netAmount)}원
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{formatDateOnly(settlement.confirmedAt)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {settlement.processedAt
                          ? formatDate(settlement.processedAt)
                          : settlement.scheduledAt
                            ? `${formatDateOnly(settlement.scheduledAt)} 예정`
                            : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === settlement.id ? null : settlement.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                        >
                          {expandedId === settlement.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === settlement.id && (
                      <tr className="bg-neutral-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-neutral-500">주문번호</p>
                              <p className="text-sm font-medium">{settlement.orderId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">판매금액</p>
                              <p className="text-sm font-medium">{formatCurrency(settlement.amount)}원</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">수수료</p>
                              <p className="text-sm font-medium text-red-500">-{formatCurrency(settlement.fee)}원</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Wallet} description="해당 조건의 정산 내역이 없습니다." />
        )}
      </div>
    </div>
  );
}
