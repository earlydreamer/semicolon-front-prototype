/**
 * 정산 계좌 정보 카드 컴포넌트
 */

import type { User } from '../../../mocks/users';

interface AccountInfoCardProps {
  user: User;
}

const AccountInfoCard = ({ user }: AccountInfoCardProps) => {
  const { bankName, accountNumber, accountHolder } = user;

  const handleEdit = () => {
    alert('계좌 정보 수정 기능은 준비 중입니다.');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">정산 계좌 정보</h2>
        <button
          onClick={handleEdit}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          계좌 수정
        </button>
      </div>

      {bankName && accountNumber ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">은행명</span>
            <span className="text-neutral-900 font-medium">{bankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">계좌번호</span>
            <span className="text-neutral-900 font-medium">{accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">예금주</span>
            <span className="text-neutral-900 font-medium">{accountHolder}</span>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-neutral-400 text-sm mb-3">등록된 정산 계좌가 없습니다.</p>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-100 transition-colors"
          >
            계좌 등록하기
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
        * 판매 대금은 구매 확정 후 등록하신 정산 계좌로 입금됩니다.
        <br />* 계좌 정보 변경 시 다음 정산부터 적용됩니다.
      </p>
    </div>
  );
};

export default AccountInfoCard;
