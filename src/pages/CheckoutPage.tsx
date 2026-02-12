/**
 * 결제 위젯 페이지 (토스 공식 샘플 스타일)
 * 
 * @see https://docs.tosspayments.com/guides/v2/payment-widget/integration
 */

import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loadTossPayments, type TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';
import { paymentService } from '../services/paymentService';
import { useToast } from '../components/common/Toast';

// 테스트용 결제위젯 클라이언트 키
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, isAuthenticated } = useAuthStore();
    const { 
        orderUuid, 
        orderItems,
        orderResponseItems, // 주문 응답의 실제 OrderItem 정보
        couponUuid,
        getOrderSummary 
    } = useOrderStore();
    
    const summary = getOrderSummary();
    
    // User 타입 반영 (id -> userUuid)
    const customerKey = user?.userUuid || 'ANONYMOUS';

    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
    const shouldRedirectLogin = !isAuthenticated;
    const shouldRedirectOrder = !orderUuid || orderItems.length === 0 || !orderResponseItems;

    useEffect(() => {
        if (shouldRedirectLogin || shouldRedirectOrder) return;
        async function fetchPaymentWidgets() {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const widgetsInstance = tossPayments.widgets({
                    customerKey,
                });
                setWidgets(widgetsInstance);
            } catch (error) {
                console.error('Error fetching payment widgets:', error);
                showToast('결제 위젯을 불러오는 중 오류가 발생했습니다.', 'error');
            }
        }

        fetchPaymentWidgets();
    }, [customerKey, showToast, shouldRedirectLogin, shouldRedirectOrder]);

    useEffect(() => {
        if (shouldRedirectLogin || shouldRedirectOrder) return;
        async function renderPaymentWidgets() {
            if (widgets == null) return;

            // 결제 금액 설정 (PG 결제 금액 기준)
            await widgets.setAmount({
                currency: 'KRW',
                value: summary.pgPayAmount,
            });

            // 결제수단 위젯 렌더링
            await widgets.renderPaymentMethods({
                selector: '#payment-method',
                variantKey: 'DEFAULT',
            });

            // 약관 위젯 렌더링
            await widgets.renderAgreement({
                selector: '#agreement',
                variantKey: 'AGREEMENT',
            });

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, summary.pgPayAmount, shouldRedirectLogin, shouldRedirectOrder]);

    // 주문 정보가 없거나 orderResponseItems가 없으면 주문서로 리다이렉트
    if (shouldRedirectLogin) return <Navigate to="/login" replace />;
    if (shouldRedirectOrder) return <Navigate to="/order" replace />;

    // 결제 요청 핸들러 (Prepare -> Toss Request)
    async function handlePaymentRequest() {
        if (!widgets || !orderUuid) return;

        try {
            // 1. [STEP] 백엔드 결제 준비 요청 (Prepare)
            const orderName = orderItems.length > 1 
                ? `${orderItems[0].title} 외 ${orderItems.length - 1}건`
                : orderItems[0].title;

            // [FIX] orderUuid를 기반으로 멱등키 생성 (재요청 시 중복 방지)
            const idempotencyKey = orderUuid;
            
            const prepareResponse = await paymentService.preparePayment({
                orderUuid,
                couponUuid: couponUuid || undefined,
                amounts: {
                    itemsTotalAmount: summary.totalProductPrice + summary.totalShippingFee,
                    couponDiscountAmount: summary.couponDiscount,
                    finalPayAmount: summary.finalPrice,
                    depositUseAmount: summary.depositUseAmount,
                    pgPayAmount: summary.pgPayAmount,
                },
                orderName,
                items: orderResponseItems!.map(item => ({
                    orderItemUuid: item.orderItemUuid,
                    productId: item.productId,
                    productName: item.productName,
                    price: item.productPrice,
                    sellerUuid: item.sellerUuid,
                    paymentCoupon: 0 // TODO: 개별 쿠폰 할인 로직
                }))
            }, idempotencyKey);

            if (!prepareResponse.success) {
                showToast(prepareResponse.message || '결제 준비 중 오류가 발생했습니다.', 'error');
                return;
            }

            const { toss, paymentUuid } = prepareResponse.data;

            // [FIX] 중복 방지 및 누락 방지를 위한 URL 파라미터 처리
            const appendUuid = (url: string) => {
                if (url.includes('paymentUuid')) return url;
                const separator = url.includes('?') ? '&' : '?';
                return `${url}${separator}paymentUuid=${paymentUuid}`;
            };

            // 2. [STEP] 토스 결제 요청
            // 백엔드에서 받은 Toss 관련 파라미터(orderId, amount 등)를 그대로 사용
            await widgets.requestPayment({
                orderId: toss.orderId,
                orderName: toss.orderName,
                successUrl: appendUuid(toss.successUrl),
                failUrl: appendUuid(toss.failUrl),
                customerEmail: user?.email,
                customerName: user?.nickname,
            });
        } catch (error: unknown) {
            console.error('결제 요청 실패:', error);
            showToast('결제 요청 중 오류가 발생했습니다.', 'error');
            // 중대한 오류 시 실패 페이지로 이동 고려
            navigate('/payment/fail?message=PREPARE_FAILED');
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-3 py-6 min-[360px]:px-4 min-[360px]:py-10">
            <h1 className="mb-5 text-xl font-bold min-[360px]:mb-6 min-[360px]:text-2xl">결제하기</h1>

            {/* 결제수단 위젯 */}
            <div id="payment-method" className="mb-4" />

            {/* 약관 위젯 */}
            <div id="agreement" className="mb-6" />

            {/* 결제하기 버튼 */}
            <button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!ready}
                onClick={handlePaymentRequest}
            >
                {summary.pgPayAmount.toLocaleString()}원 결제하기
            </button>
        </div>
    );
}



