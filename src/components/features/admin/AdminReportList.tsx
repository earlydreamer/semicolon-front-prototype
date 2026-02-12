import { Fragment, useMemo, useState } from 'react';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { MockDataNotice } from '@/components/common/MockDataNotice';

type ReportType = 'PRODUCT' | 'USER';
type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

interface Report {
  id: string;
  type: ReportType;
  targetName: string;
  reason: string;
  description: string;
  reporterNickname: string;
  status: ReportStatus;
  createdAt: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: 'report_1',
    type: 'PRODUCT',
    targetName: '스노우피크 쉘터 텐트',
    reason: '허위 상품',
    description: '상품 설명과 실제 상태가 크게 다릅니다.',
    reporterNickname: '구매자A',
    status: 'PENDING',
    createdAt: '2026-01-08T10:30:00',
  },
  {
    id: 'report_2',
    type: 'USER',
    targetName: '판매자B',
    reason: '사기 의심',
    description: '입금 후 연락이 두절되었습니다.',
    reporterNickname: '구매자C',
    status: 'PENDING',
    createdAt: '2026-01-07T15:20:00',
  },
];

const STATUS_LABELS: Record<ReportStatus, { text: string; color: string }> = {
  PENDING: { text: '미처리', color: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { text: '처리완료', color: 'bg-green-100 text-green-800' },
  REJECTED: { text: '반려', color: 'bg-red-100 text-red-800' },
};

export function AdminReportList() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
      if (typeFilter !== 'all' && report.type !== typeFilter) return false;
      return true;
    });
  }, [reports, statusFilter, typeFilter]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-4">
      <MockDataNotice />

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-neutral-200">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">상태</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="PENDING">미처리</option>
            <option value="RESOLVED">처리완료</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">유형</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ReportType | 'all')}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="PRODUCT">상품</option>
            <option value="USER">사용자</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">유형</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">대상</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">사유</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">신고자</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">신고일</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredReports.map((report) => (
                  <Fragment key={report.id}>
                    <tr key={report.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[report.status].color}`}
                        >
                          {STATUS_LABELS[report.status].text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{report.type}</td>
                      <td className="px-4 py-3 text-sm text-neutral-900">{report.targetName}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{report.reason}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{report.reporterNickname}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                        >
                          {expandedId === report.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === report.id && (
                      <tr key={`${report.id}-detail`} className="bg-neutral-50">
                        <td colSpan={7} className="px-4 py-4">
                          <p className="text-sm text-neutral-700 mb-3">{report.description}</p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => showToast('준비중입니다.', 'info')}>
                              처리 완료
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => showToast('준비중입니다.', 'info')}>
                              반려
                            </Button>
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
          <EmptyState icon={AlertTriangle} description="해당 조건의 신고 내역이 없습니다." />
        )}
      </div>
    </div>
  );
}
