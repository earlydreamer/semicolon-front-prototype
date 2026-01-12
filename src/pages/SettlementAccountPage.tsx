/**
 * 정산 계좌 관리 페이지
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { MOCK_USER } from '../mocks/users';
import { useToast } from '../components/common/Toast';

const BANKS = [
  '카카오뱅크', '토스뱅크', 'KB국민은행', '신한은행', 
  '우리은행', 'NH농협은행', '하나은행', 'IBK기업은행'
];

const SettlementAccountPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Mock User의 계좌 정보 또는 빈 값으로 초기화
  const initialAccount = MOCK_USER.settlementAccount || { bank: '', accountNumber: '', holder: '' };
  
  const [formData, setFormData] = useState({
    bank: initialAccount.bank,
    accountNumber: initialAccount.accountNumber,
    holder: initialAccount.holder,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bank || !formData.accountNumber || !formData.holder) {
      showToast('모든 정보를 입력해주세요.', 'error');
      return;
    }

    // API 연동 대신 Toast 메시지로 대체
    showToast('정산 계좌 정보가 저장되었습니다.', 'success');
    navigate('/mypage');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-900" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">정산 계좌 관리</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">계좌 정보 입력</h2>
            <p className="text-sm text-neutral-500">
              판매 대금을 정산받을 본인 명의의 계좌를 입력해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 은행 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">은행</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all appearance-none bg-white"
              >
                <option value="">은행을 선택해주세요</option>
                {BANKS.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            {/* 계좌번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">계좌번호</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => {
                  // 숫자와 하이픈만 허용
                  const value = e.target.value.replace(/[^0-9-]/g, '');
                  setFormData(prev => ({ ...prev, accountNumber: value }));
                }}
                placeholder="- 없이 숫자만 입력"
                className="w-full h-12 px-4 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            {/* 예금주 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">예금주</label>
              <input
                type="text"
                name="holder"
                value={formData.holder}
                onChange={handleChange}
                placeholder="예금주 성명"
                className="w-full h-12 px-4 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
              <p className="text-xs text-neutral-400">
                * 가입하신 회원 정보와 일치하는 계좌만 등록 가능합니다.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettlementAccountPage;
