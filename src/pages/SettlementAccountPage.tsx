/**
 * 정산 계좌 관리 페이지
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const SettlementAccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">출금 기능 준비 중</h2>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            보다 안전하고 편리한 출금 서비스를 위해<br />
            현재 시스템을 준비 중입니다.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-5 mb-8 text-left border border-primary-100">
            <p className="text-sm font-bold text-primary-700 mb-1">MVP 정산 안내</p>
            <p className="text-xs text-primary-600 leading-normal">
              • 판매 수익은 발송 완료 후 자동으로 <b>나의 예치금</b>으로 정산됩니다.<br />
              • 적립된 예치금은 상품 구매 시 즉시 현금처럼 사용 가능합니다.<br />
              • 정식 계좌 출금 기능은 추후 업데이트를 통해 제공될 예정입니다.
            </p>
          </div>

          <button
            onClick={() => navigate('/mypage')}
            className="w-full h-14 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-lg active:scale-[0.98]"
          >
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementAccountPage;
