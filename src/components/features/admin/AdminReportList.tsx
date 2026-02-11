/**
 * 관리자 신고 목록 컴포넌트
 */

import { useState, Fragment } from 'react';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import { Button } from '@/components/common/Button';

type ReportType = 'PRODUCT' | 'USER';
type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

interface Report {
  id: string;
  type: ReportType;
  targetId: string;
  targetName: string;
  reason: string;
  description: string;
  reporter: {
    id: string;
    nickname: string;
  };
  status: ReportStatus;
  createdAt: string;
  processedAt?: string;
}

// Mock 데이터
const MOCK_REPORTS: Report[] = [
  {
    id: 'report_1',
    type: 'PRODUCT',
    targetId: 'prod_1',
    targetName: '스노우피크 랜드락 텐트',
    reason: '허위 상품',
    description: '상품 사진과 실제 상품이 다릅니다. 가품인 것 같습니다.',
    reporter: { id: 'user_10', nickname: '정직한구매자' },
    status: 'PENDING',
    createdAt: '2026-01-08T10:30:00',
  },
  {
    id: 'report_2',
    type: 'USER',
    targetId: 'user_5',
    targetName: '악성판매자',
    reason: '사기 의심',
    description: '입금 후 연락이 두절되었습니다. 3일이 지났는데 배송도 안 해주고 연락도 안 받습니다.',
    reporter: { id: 'user_11', nickname: '피해자123' },
    status: 'PENDING',
    createdAt: '2026-01-07T15:20:00',
  },
  {
    id: 'report_3',
    type: 'PRODUCT',
    targetId: 'prod_15',
    targetName: '마틴 D-28 기타',
    reason: '불법 상품',
    description: '도난 장물로 의심됩니다. 시리얼 넘버 확인 요청합니다.',
    reporter: { id: 'user_12', nickname: '기타매니아' },
    status: 'RESOLVED',
    createdAt: '2026-01-05T09:00:00',
    processedAt: '2026-01-06T14:00:00',
  },
  {
    id: 'report_4',
    type: 'USER',
    targetId: 'user_8',
    targetName: '정상유저',
    reason: '비매너',
    description: '욕설 및 협박성 메시지를 보냈습니다.',
    reporter: { id: 'user_13', nickname: '신고자A' },
    status: 'REJECTED',
    createdAt: '2026-01-04T11:00:00',
    processedAt: '2026-01-05T10:00:00',
  },
];

const STATUS_LABELS: Record<ReportStatus, { text: string; color: string }> = {
  PENDING: { text: '미처리', color: 'bg-yellow-100 text-yellow-800' },
  RESOLVED: { text: '승인', color: 'bg-green-100 text-green-800' },
  REJECTED: { text: '반려', color: 'bg-red-100 text-red-800' },
};

const TYPE_LABELS: Record<ReportType, { text: string; color: string }> = {
  PRODUCT: { text: '상품', color: 'bg-blue-100 text-blue-800' },
  USER: { text: '사용자', color: 'bg-purple-100 text-purple-800' },
};

import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';

// ... existing imports ...

export function AdminReportList() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { showToast } = useToast();

  // 필터링
  const filteredReports = reports.filter((report) => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (typeFilter !== 'all' && report.type !== typeFilter) return false;
    return true;
  });

  // 신고 처리
  const handleProcess = (reportId: string, action: 'approve' | 'reject') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === 'approve' ? 'RESOLVED' : 'REJECTED',
              processedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setExpandedId(null);
    showToast(
      action === 'approve' ? '신고가 승인(제재) 되었습니다.' : '신고가 반려되었습니다.',
      'success'
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* 필터 */}
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
            <option value="RESOLVED">승인</option>
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

      {/* 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            STATUS_LABELS[report.status].color
                          }`}
                        >
                          {STATUS_LABELS[report.status].text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            TYPE_LABELS[report.type].color
                          }`}
                        >
                          {TYPE_LABELS[report.type].text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">{report.targetName}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{report.reason}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{report.reporter.nickname}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                        >
                          {expandedId === report.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === report.id && (
                      <tr key={`${report.id}-detail`} className="bg-neutral-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-neutral-700 mb-1">신고 내용</h4>
                              <p className="text-sm text-neutral-600 bg-white p-3 rounded border border-neutral-200">
                                {report.description}
                              </p>
                            </div>
                            
                            {report.status === 'PENDING' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleProcess(report.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  승인 (제재하기)
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleProcess(report.id, 'reject')}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  반려
                                </Button>
                              </div>
                            )}
                            
                            {report.processedAt && (
                              <p className="text-xs text-neutral-500">
                                처리일: {formatDate(report.processedAt)}
                              </p>
                            )}
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
          <EmptyState
            icon={AlertTriangle}
            description="해당하는 신고 내역이 없습니다."
          />
        )}
      </div>
    </div>
  );
}
