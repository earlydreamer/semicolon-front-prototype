/**
 * 정산 계좌 카드 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { User } from '../../../mocks/users';
import { CreditCard, ChevronRight } from 'lucide-react';

interface SettlementCardProps {
  user: User;
}

const SettlementCard = ({ user }: SettlementCardProps) => {
  const { settlementAccount } = user;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-neutral-700">정산 계좌</h3>
        <Link
          to="/mypage/settlement"
          className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600"
        >
          {settlementAccount ? '변경' : '등록'}
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {settlementAccount ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {settlementAccount.bank}
            </p>
            <p className="text-xs text-neutral-500">
              {settlementAccount.accountNumber} ({settlementAccount.holder})
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">등록이 필요합니다</p>
            <p className="text-xs text-orange-500">판매 대금을 받으려면 계좌를 등록하세요</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlementCard;
