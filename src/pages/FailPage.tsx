/**
 * 결제 실패 페이지 (토스 공식 샘플 스타일)
 * 
 * @see https://docs.tosspayments.com/guides/v2/payment-widget/integration
 */

import { useSearchParams, Link } from 'react-router-dom';

export default function FailPage() {
  const [searchParams] = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
        <p className="text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
      </div>

      {/* 에러 정보 */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-red-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          결제 실패 상세 정보
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-red-100 pb-2">
            <dt className="text-red-600 font-medium">에러 코드</dt>
            <dd className="font-bold text-red-800">{errorCode || 'UNKNOWN_ERROR'}</dd>
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <dt className="text-red-600 font-medium">상세 사유</dt>
            <dd className="text-red-800 leading-relaxed font-medium">
              {errorMessage || '결제 중 알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/order" 
          className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm"
        >
          주문서로 돌아가기
        </Link>
        <Link 
          to="/" 
          className="flex-1 text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-4 px-6 rounded-xl transition-colors border border-neutral-200"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
