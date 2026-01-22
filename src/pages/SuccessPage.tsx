/**
 * 결제 성공 페이지 (토스 공식 샘플 스타일)
 * 
 * @see https://docs.tosspayments.com/guides/v2/payment-widget/integration
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useOrderStore } from '../stores/useOrderStore';
import { useToast } from '../components/common/Toast';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { clearOrder } = useOrderStore();
  
  const [responseData, setResponseData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    async function confirm() {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const paymentUuid = searchParams.get('paymentUuid');

      if (!paymentKey || !orderId || !amount || !paymentUuid) {
        showToast('필수 결제 정보가 누락되었습니다.', 'error');
        navigate('/payment/fail?message=MISSING_PARAMS');
        return;
      }

      // 백엔드에 결제 승인 요청
      try {
        const idempotencyKey = self.crypto.randomUUID();
        
        const response = await paymentService.confirmPayment({
          paymentUuid,
          toss: {
            paymentKey,
            orderId,
            amount: Number(amount),
          },
        }, idempotencyKey);

        if (response.success) {
          setResponseData(response.data);
          showToast('결제가 성공적으로 완료되었습니다.', 'success');
          // [TIP] 실제 서비스에서는 바로 이동하거나, 결과 영수증을 보여준 뒤 이동
          // 여기서는 결과 확인을 위해 잠시 머무름 (1.5초 뒤 이동 시뮬레이션 가능)
          // clearOrder(); // 주문 정보 정리
        } else {
          throw new Error(response.message || '승인 실패');
        }
      } catch (error: any) {
        console.error('결제 승인 실패:', error);
        navigate(`/payment/fail?code=${error.response?.data?.code || 'CONFIRM_ERROR'}&message=${encodeURIComponent(error.message)}`);
      } finally {
        setIsConfirming(false);
      }
    }

    confirm();
  }, [searchParams, navigate, showToast, clearOrder]);

  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-600">결제 승인 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 성공</h1>
        <p className="text-gray-600">결제가 완료되었습니다.</p>
      </div>

      {/* 결제 정보 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">결제 정보</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">주문번호</dt>
            <dd className="font-medium">{searchParams.get('orderId')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">결제금액</dt>
            <dd className="font-medium">{Number(searchParams.get('amount')).toLocaleString()}원</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">결제키</dt>
            <dd className="font-medium text-xs break-all">{searchParams.get('paymentKey')}</dd>
          </div>
        </dl>
      </div>

      {/* API 응답 (학습용) */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-auto">
        <p className="text-xs text-gray-400 mb-2">토스 API 응답 (학습용)</p>
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(responseData, null, 2)}
        </pre>
      </div>

      <button 
        onClick={() => {
          clearOrder();
          navigate('/');
        }}
        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
