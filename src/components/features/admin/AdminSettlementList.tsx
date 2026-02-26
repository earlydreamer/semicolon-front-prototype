import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Wallet from 'lucide-react/dist/esm/icons/wallet';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { adminService } from '@/services/adminService';
import type {
  AdminSettlementDetailResponse,
  AdminSettlementStatus,
  AdminSettlementStatisticsResponse,
} from '@/types/admin';

const STATUS_LABELS: Record<AdminSettlementStatus, { text: string; color: string }> = {
  CREATED: { text: '생성됨', color: 'bg-neutral-100 text-neutral-700' },
  PENDING: { text: '대기중', color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { text: '처리중', color: 'bg-blue-100 text-blue-800' },
  SUCCESS: { text: '정산완료', color: 'bg-green-100 text-green-800' },
  FAILED: { text: '실패', color: 'bg-red-100 text-red-700' },
};

const parseDate = (value: string) => {
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function AdminSettlementList() {
  const [settlements, setSettlements] = useState<AdminSettlementDetailResponse[]>([]);
  const [statistics, setStatistics] = useState<AdminSettlementStatisticsResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdminSettlementStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  const loadSettlements = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const queryStatus = statusFilter === 'all' ? undefined : statusFilter;
      const [settlementPage, settlementStats] = await Promise.all([
        adminService.getAdminSettlements({ status: queryStatus, page: 0, size: 100 }),
        adminService.getAdminSettlementStatistics({ status: queryStatus }),
      ]);

      setSettlements(settlementPage.content);
      setStatistics(settlementStats);
    } catch (error) {
      console.error('Failed to load admin settlements:', error);
      setErrorMessage('정산 데이터를 불러오지 못했어요.');
      showToast('정산 데이터를 불러오지 못했어요.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, statusFilter]);

  useEffect(() => {
    void loadSettlements();
  }, [loadSettlements]);

  const filteredSettlements = useMemo(() => {
    if (statusFilter === 'all') return settlements;
    return settlements.filter((settlement) => settlement.status === statusFilter);
  }, [settlements, statusFilter]);

  const pendingAmount =
    (statistics?.createdAmount ?? 0) +
    (statistics?.pendingAmount ?? 0) +
    (statistics?.processingAmount ?? 0);
  const completedAmount = statistics?.successAmount ?? 0;

  const formatCurrency = (value: number) => new Intl.NumberFormat('ko-KR').format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value);
  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const parsed = parseDate(value);
    if (!parsed) return '-';
    return parsed.toLocaleString('ko-KR');
  };
  const formatDateOnly = (value?: string | null) => {
    if (!value) return '-';
    const parsed = parseDate(value);
    if (!parsed) return '-';
    return parsed.toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 대기/예정</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(pendingAmount)}원</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 완료 금액</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(completedAmount)}원</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">전체 정산 건수</p>
          <p className="text-2xl font-bold text-neutral-900">{formatNumber(statistics?.totalCount ?? 0)}건</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 실패 건수</p>
          <p className="text-2xl font-bold text-red-600">{formatNumber(statistics?.failedCount ?? 0)}건</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-neutral-200">
        <div>
          <label htmlFor="admin-settlement-status-filter" className="block text-sm font-medium text-neutral-700 mb-1">정산 상태</label>
          <select
            id="admin-settlement-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminSettlementStatus | 'all')}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="CREATED">생성됨</option>
            <option value="PENDING">정산대기</option>
            <option value="PROCESSING">처리중</option>
            <option value="SUCCESS">정산완료</option>
            <option value="FAILED">실패</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500" role="status" aria-live="polite">
            정산 데이터를 불러오는 중이에요…
          </div>
        ) : errorMessage ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button variant="outline" onClick={() => void loadSettlements()}>
              다시 시도
            </Button>
          </div>
        ) : filteredSettlements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">판매자</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상품</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">정산금액</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">생성일</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">처리일</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredSettlements.map((settlement) => (
                  <Fragment key={settlement.settlementUuid}>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[settlement.status].color}`}
                        >
                          {STATUS_LABELS[settlement.status].text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">{settlement.sellerNickname}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{settlement.productName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 text-right">
                        {formatCurrency(settlement.settlementAmount)}원
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{formatDateOnly(settlement.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {settlement.completedAt
                          ? formatDate(settlement.completedAt)
                          : `${formatDateOnly(settlement.settlementReservationDate)} 예정`}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedId(
                            expandedId === settlement.settlementUuid ? null : settlement.settlementUuid,
                          )}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                          aria-label={`${settlement.productName} 정산 상세 ${expandedId === settlement.settlementUuid ? '닫기' : '열기'}`}
                          aria-expanded={expandedId === settlement.settlementUuid}
                          aria-controls={`admin-settlement-detail-${settlement.settlementUuid}`}
                        >
                          {expandedId === settlement.settlementUuid
                            ? <ChevronUp className="w-5 h-5" aria-hidden="true" />
                            : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === settlement.settlementUuid && (
                      <tr id={`admin-settlement-detail-${settlement.settlementUuid}`} className="bg-neutral-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-neutral-500">주문번호</p>
                              <p className="text-sm font-medium">{settlement.orderUuid}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">판매금액</p>
                              <p className="text-sm font-medium">{formatCurrency(settlement.totalAmount)}원</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">수수료</p>
                              <p className="text-sm font-medium text-red-500">-{formatCurrency(settlement.feeAmount)}원</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">정산예정일</p>
                              <p className="text-sm font-medium">{formatDate(settlement.settlementReservationDate)}</p>
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
