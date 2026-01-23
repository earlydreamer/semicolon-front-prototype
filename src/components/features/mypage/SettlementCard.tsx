/**
 * 정산 계좌 카드 컴포넌트
 */

import { CreditCard } from 'lucide-react';

const SettlementCard = () => {
  // MVP에서는 계좌 등록 기능을 생략하고 예치금 정산만 진행
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-neutral-700">예치금 관리</h3>
        <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-400 rounded-full font-medium uppercase">
          MVP Preparing
        </span>
      </div>

      <div className="space-y-3">
        {/* 충전 */}
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">예치금 충전 준비 중</p>
            <p className="text-xs text-neutral-400">현금처럼 사용 가능한 예치금을 충전할 수 있습니다</p>
          </div>
        </div>

        {/* 출금 */}
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">출금 기능 준비 중</p>
            <p className="text-xs text-neutral-400">판매 수익은 예치금으로 정산됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementCard;
