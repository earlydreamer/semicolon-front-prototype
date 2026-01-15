/**
 * 관리자 정산 목록 컴포넌트
 * 
 * 정산 처리 방식:
 * - 구매확정 시 자동 정산 대상 등록
 * - 매일 00:00 KST 일괄 지급 처리 (배치)
 * - 수동 승인/반려 없음 (시스템 자동 처리)
 */

import { useState, Fragment } from 'react';
import { Wallet, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

/**
 * 정산 상태
 * - PENDING: 정산 대기 (구매확정 완료, 다음 배치 대기)
 * - SCHEDULED: 정산 예정 (금일 자정 처리 예정)
 * - COMPLETED: 정산 완료 (지급 완료)
 */
type SettlementStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED';

interface Settlement {
  id: string;
  seller: {
    id: string;
    nickname: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  orderId: string;
  productTitle: string;
  amount: number;         // 판매금액
  fee: number;            // 수수료
  netAmount: number;      // 정산금액
  status: SettlementStatus;
  confirmedAt: string;    // 구매확정일
  scheduledAt?: string;   // 정산 예정일 (다음 자정)
  processedAt?: string;   // 정산 처리일
}

// 오늘 자정 계산
const todayMidnight = new Date();
todayMidnight.setHours(0, 0, 0, 0);

// 내일 자정 계산
const tomorrowMidnight = new Date(todayMidnight);
tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

// Mock 데이터
const MOCK_SETTLEMENTS: Settlement[] = [
  // 정산 대기 (PENDING) - 구매확정 후 다음 배치 대기
  {
    id: 'settle_1',
    seller: {
      id: 'seller_1',
      nickname: '캠핑마스터',
      bankName: '카카오뱅크',
      accountNumber: '3333-00-1234567',
      accountHolder: '김캠핑',
    },
    orderId: 'order_123',
    productTitle: '스노우피크 랜드락 텐트 풀세트',
    amount: 1500000,
    fee: 45000,
    netAmount: 1455000,
    status: 'PENDING',
    confirmedAt: '2026-01-14T15:30:00',
    scheduledAt: tomorrowMidnight.toISOString(),
  },
  {
    id: 'settle_2',
    seller: {
      id: 'seller_2',
      nickname: '기타장인',
      bankName: '국민은행',
      accountNumber: '123-12-123456',
      accountHolder: '박기타',
    },
    orderId: 'order_124',
    productTitle: '펜더 스트라토캐스터 (Made in Japan)',
    amount: 1800000,
    fee: 54000,
    netAmount: 1746000,
    status: 'PENDING',
    confirmedAt: '2026-01-14T10:00:00',
    scheduledAt: tomorrowMidnight.toISOString(),
  },
  // 정산 예정 (SCHEDULED) - 금일 자정 처리 예정
  {
    id: 'settle_3',
    seller: {
      id: 'seller_1',
      nickname: '캠핑마스터',
      bankName: '카카오뱅크',
      accountNumber: '3333-00-1234567',
      accountHolder: '김캠핑',
    },
    orderId: 'order_100',
    productTitle: '콜맨 2버너 스토브',
    amount: 120000,
    fee: 3600,
    netAmount: 116400,
    status: 'SCHEDULED',
    confirmedAt: '2026-01-13T14:00:00',
    scheduledAt: todayMidnight.toISOString(),
  },
  // 정산 완료 (COMPLETED)
  {
    id: 'settle_4',
    seller: {
      id: 'seller_3',
      nickname: '악기수집가',
      bankName: '신한은행',
      accountNumber: '110-123-456789',
      accountHolder: '이악기',
    },
    orderId: 'order_099',
    productTitle: '야마하 사일런트 기타',
    amount: 450000,
    fee: 13500,
    netAmount: 436500,
    status: 'COMPLETED',
    confirmedAt: '2026-01-10T11:00:00',
    scheduledAt: '2026-01-11T00:00:00',
    processedAt: '2026-01-11T00:05:23',
  },
  {
    id: 'settle_5',
    seller: {
      id: 'seller_1',
      nickname: '캠핑마스터',
      bankName: '카카오뱅크',
      accountNumber: '3333-00-1234567',
      accountHolder: '김캠핑',
    },
    orderId: 'order_080',
    productTitle: '헬리녹스 체어원',
    amount: 95000,
    fee: 2850,
    netAmount: 92150,
    status: 'COMPLETED',
    confirmedAt: '2026-01-08T09:30:00',
    scheduledAt: '2026-01-09T00:00:00',
    processedAt: '2026-01-09T00:03:45',
  },
];

const STATUS_LABELS: Record<SettlementStatus, { text: string; color: string; description: string }> = {
  PENDING: { 
    text: '정산대기', 
    color: 'bg-yellow-100 text-yellow-800',
    description: '구매확정 완료, 다음 정산 배치 대기 중'
  },
  SCHEDULED: { 
    text: '정산예정', 
    color: 'bg-blue-100 text-blue-800',
    description: '금일 자정(00:00) 일괄 처리 예정'
  },
  COMPLETED: { 
    text: '정산완료', 
    color: 'bg-green-100 text-green-800',
    description: '판매자 계좌로 지급 완료'
  },
};

export function AdminSettlementList() {
  const [settlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 필터링
  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  // 정산 통계
  const pendingCount = settlements.filter((s) => s.status === 'PENDING').length;
  const scheduledCount = settlements.filter((s) => s.status === 'SCHEDULED').length;
  const pendingAmount = settlements
    .filter((s) => s.status === 'PENDING' || s.status === 'SCHEDULED')
    .reduce((sum, s) => sum + s.netAmount, 0);
  const completedAmount = settlements
    .filter((s) => s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.netAmount, 0);

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

  const formatDateOnly = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* 배치 처리 안내 */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">정산 자동 처리 안내</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>구매확정 완료 시 자동으로 정산 대기 목록에 등록됩니다.</li>
            <li>매일 자정(00:00 KST) 일괄 지급 처리됩니다.</li>
            <li>처리 결과는 판매자에게 알림으로 발송됩니다.</li>
          </ul>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">정산 대기</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}건</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">금일 정산 예정</p>
          <p className="text-2xl font-bold text-blue-600">{scheduledCount}건</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">미지급 금액</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(pendingAmount)}원</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">이번 달 지급 완료</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(completedAmount)}원</p>
        </div>
      </div>

      {/* 필터 */}
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

      {/* 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {filteredSettlements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">정산상태</th>
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
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_LABELS[settlement.status].color
                          }`}
                        >
                          {settlement.status === 'SCHEDULED' && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {STATUS_LABELS[settlement.status].text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900">
                        {settlement.seller.nickname}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 max-w-[200px] truncate">
                        {settlement.productTitle}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 text-right">
                        {formatCurrency(settlement.netAmount)}원
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {formatDateOnly(settlement.confirmedAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        {settlement.processedAt ? (
                          formatDate(settlement.processedAt)
                        ) : settlement.scheduledAt ? (
                          <span className="text-blue-600">
                            {formatDateOnly(settlement.scheduledAt)} 예정
                          </span>
                        ) : (
                          '-'
                        )}
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
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <p className="text-xs text-neutral-500">주문번호</p>
                              <p className="text-sm font-medium">{settlement.orderId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">판매금액</p>
                              <p className="text-sm font-medium">{formatCurrency(settlement.amount)}원</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">수수료 (3%)</p>
                              <p className="text-sm font-medium text-red-500">-{formatCurrency(settlement.fee)}원</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">입금 은행</p>
                              <p className="text-sm font-medium">{settlement.seller.bankName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500">입금 계좌</p>
                              <p className="text-sm font-medium">{settlement.seller.accountNumber}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-neutral-200">
                            <p className="text-xs text-neutral-500">
                              {STATUS_LABELS[settlement.status].description}
                            </p>
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
            icon={Wallet}
            description="해당하는 정산 내역이 없습니다."
          />
        )}
      </div>
    </div>
  );
}
