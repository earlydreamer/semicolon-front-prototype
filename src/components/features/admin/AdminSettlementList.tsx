/**
 * 관리자 정산 목록 컴포넌트
 */

import { useState } from 'react';
import { Wallet, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/common/Button';

type SettlementStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

interface Settlement {
  id: string;
  seller: {
    id: string;
    nickname: string;
    bankName: string;
    accountNumber: string;
  };
  orderId: string;
  productTitle: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: SettlementStatus;
  requestedAt: string;
  processedAt?: string;
}

// Mock 데이터
const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'settle_1',
    seller: {
      id: 'seller_1',
      nickname: '캠핑마스터',
      bankName: '카카오뱅크',
      accountNumber: '3333-00-1234567',
    },
    orderId: 'order_123',
    productTitle: '스노우피크 랜드락 텐트 풀세트',
    amount: 1500000,
    fee: 45000,
    netAmount: 1455000,
    status: 'PENDING',
    requestedAt: '2026-01-08T10:00:00',
  },
  {
    id: 'settle_2',
    seller: {
      id: 'seller_2',
      nickname: '기타장인',
      bankName: '국민은행',
      accountNumber: '123-12-123456',
    },
    orderId: 'order_124',
    productTitle: '펜더 스트라토캐스터 (Made in Japan)',
    amount: 1800000,
    fee: 54000,
    netAmount: 1746000,
    status: 'PENDING',
    requestedAt: '2026-01-07T15:00:00',
  },
  {
    id: 'settle_3',
    seller: {
      id: 'seller_1',
      nickname: '캠핑마스터',
      bankName: '카카오뱅크',
      accountNumber: '3333-00-1234567',
    },
    orderId: 'order_100',
    productTitle: '콜맨 2버너 스토브',
    amount: 120000,
    fee: 3600,
    netAmount: 116400,
    status: 'COMPLETED',
    requestedAt: '2026-01-05T14:00:00',
    processedAt: '2026-01-06T10:00:00',
  },
  {
    id: 'settle_4',
    seller: {
      id: 'seller_3',
      nickname: '악기수집가',
      bankName: '신한은행',
      accountNumber: '110-123-456789',
    },
    orderId: 'order_99',
    productTitle: '야마하 사일런트 기타',
    amount: 450000,
    fee: 13500,
    netAmount: 436500,
    status: 'REJECTED',
    requestedAt: '2026-01-04T11:00:00',
    processedAt: '2026-01-05T09:00:00',
  },
];

const STATUS_LABELS: Record<SettlementStatus, { text: string; color: string }> = {
  PENDING: { text: '대기중', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { text: '승인됨', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { text: '지급완료', color: 'bg-green-100 text-green-800' },
  REJECTED: { text: '반려', color: 'bg-red-100 text-red-800' },
};

export function AdminSettlementList() {
  const [settlements, setSettlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 필터링
  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  // 정산 총액 계산
  const totalPending = settlements
    .filter((s) => s.status === 'PENDING')
    .reduce((sum, s) => sum + s.netAmount, 0);

  // 정산 처리
  const handleProcess = (settlementId: string, action: 'approve' | 'reject') => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId
          ? {
              ...s,
              status: action === 'approve' ? 'COMPLETED' : 'REJECTED',
              processedAt: new Date().toISOString(),
            }
          : s
      )
    );
    setExpandedId(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
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
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">대기중인 정산</p>
          <p className="text-2xl font-bold text-neutral-900">
            {settlements.filter((s) => s.status === 'PENDING').length}건
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">대기중인 금액</p>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(totalPending)}원
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">이번 달 지급완료</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              settlements
                .filter((s) => s.status === 'COMPLETED')
                .reduce((sum, s) => sum + s.netAmount, 0)
            )}원
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-neutral-200">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">상태</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SettlementStatus | 'all')}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"
          >
            <option value="all">전체</option>
            <option value="PENDING">대기중</option>
            <option value="COMPLETED">지급완료</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>
      </div>

      {/* 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">판매자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">상품</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">판매금액</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">수수료</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">정산금액</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">요청일</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredSettlements.map((settlement) => (
                <>
                  <tr key={settlement.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_LABELS[settlement.status].color
                        }`}
                      >
                        {STATUS_LABELS[settlement.status].text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {settlement.seller.nickname}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 max-w-[200px] truncate">
                      {settlement.productTitle}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 text-right">
                      {formatCurrency(settlement.amount)}원
                    </td>
                    <td className="px-4 py-3 text-sm text-red-500 text-right">
                      -{formatCurrency(settlement.fee)}원
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-600 text-right">
                      {formatCurrency(settlement.netAmount)}원
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {formatDate(settlement.requestedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setExpandedId(expandedId === settlement.id ? null : settlement.id)}
                        className="p-1 text-neutral-400 hover:text-neutral-600"
                      >
                        {expandedId === settlement.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedId === settlement.id && (
                    <tr key={`${settlement.id}-detail`} className="bg-neutral-50">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="space-y-4">
                          {/* 계좌 정보 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-neutral-500">은행</p>
                              <p className="text-sm font-medium">{settlement.seller.bankName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">계좌번호</p>
                              <p className="text-sm font-medium">{settlement.seller.accountNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">주문번호</p>
                              <p className="text-sm font-medium">{settlement.orderId}</p>
                            </div>
                            {settlement.processedAt && (
                              <div>
                                <p className="text-xs text-neutral-500">처리일</p>
                                <p className="text-sm font-medium">{formatDate(settlement.processedAt)}</p>
                              </div>
                            )}
                          </div>
                          
                          {settlement.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleProcess(settlement.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                지급 승인
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProcess(settlement.id, 'reject')}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                반려
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSettlements.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p>해당하는 정산 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
