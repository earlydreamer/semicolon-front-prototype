/**
 * 결제 성공 페이지
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useToast } from '../components/common/Toast';
import { paymentService } from '../services/paymentService';
import { useCartStore } from '../stores/useCartStore';
import { useOrderStore } from '../stores/useOrderStore';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { clearOrder } = useOrderStore();
  const { fetchItems } = useCartStore();

  const [isConfirming, setIsConfirming] = useState(true);
  const hasConfirmed = useRef(false);

  const orderId = searchParams.get('orderId') ?? '';
  const amountParam = searchParams.get('amount') ?? '0';
  const amount = Number(amountParam);

  useEffect(() => {
    if (hasConfirmed.current) return;

    async function confirm() {
      const paymentKey = searchParams.get('paymentKey');
      const paymentUuid = searchParams.get('paymentUuid');
      const requestOrderId = searchParams.get('orderId');
      const requestAmount = searchParams.get('amount');

      if (!paymentKey || !requestOrderId || !requestAmount || !paymentUuid) {
        showToast('필수 결제 정보가 누락되었습니다.', 'error');
        navigate('/payment/fail?message=MISSING_PARAMS');
        return;
      }

      hasConfirmed.current = true;

      try {
        const idempotencyKey = paymentUuid;

        const response = await paymentService.confirmPayment(
          {
            paymentUuid,
            toss: {
              paymentKey,
              orderId: requestOrderId,
              amount: Number(requestAmount),
            },
          },
          idempotencyKey
        );

        if (!response.success) {
          throw new Error(response.message || '결제 확인에 실패했습니다.');
        }

        showToast('결제가 완료되었습니다.', 'success');
        fetchItems();
        clearOrder();
      } catch (error: unknown) {
        console.error('결제 확인 실패:', error);
        const apiError = error as AxiosError<{ code?: string; message?: string }>;
        const code = apiError.response?.data?.code || 'CONFIRM_ERROR';
        const message = apiError.response?.data?.message || apiError.message || '결제 확인에 실패했습니다.';
        navigate(`/payment/fail?code=${code}&message=${encodeURIComponent(message)}`);
      } finally {
        setIsConfirming(false);
      }
    }

    confirm();
  }, [searchParams, navigate, showToast, clearOrder, fetchItems]);

  if (isConfirming) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
        <p className="text-neutral-600">결제 확인 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-neutral-900">결제가 완료되었어요</h1>
        <p className="mb-6 text-sm text-neutral-500">주문이 정상적으로 접수되었습니다.</p>

        <dl className="mb-6 rounded-xl bg-neutral-50 p-4 text-sm">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-neutral-500">주문번호</dt>
            <dd className="max-w-[65%] truncate font-medium text-neutral-800" title={orderId}>
              {orderId || '-'}
            </dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-neutral-500">결제금액</dt>
            <dd className="font-semibold text-neutral-900">
              {Number.isFinite(amount) ? amount.toLocaleString('ko-KR') : '0'}원
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => {
            clearOrder();
            navigate('/');
          }}
          className="w-full rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
