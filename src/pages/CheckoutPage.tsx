/**
 * Checkout page (Toss Payments widget integration)
 *
 * @see https://docs.tosspayments.com/guides/v2/payment-widget/integration
 */

import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loadTossPayments, type TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import type { AxiosError } from 'axios';
import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';
import { paymentService } from '../services/paymentService';
import { useToast } from '../components/common/Toast';

const tossClientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

type CouponDistributionItem = {
    orderItemUuid: string;
    productUuid: string;
    productPrice: number;
};

function buildPaymentCouponMap(items: CouponDistributionItem[], couponTotal: number): Record<string, number> {
    const couponByOrderItem: Record<string, number> = {};
    items.forEach((item) => {
        couponByOrderItem[item.orderItemUuid] = 0;
    });

    if (items.length === 0 || couponTotal <= 0) {
        return couponByOrderItem;
    }

    const sortedItems = [...items].sort((a, b) => {
        const uuidCmp = a.productUuid.localeCompare(b.productUuid);
        if (uuidCmp !== 0) return uuidCmp;
        return a.orderItemUuid.localeCompare(b.orderItemUuid);
    });

    const totalItemPrice = sortedItems.reduce((sum, item) => sum + item.productPrice, 0);
    if (totalItemPrice <= 0) {
        return couponByOrderItem;
    }

    const normalizedCouponTotal = Math.min(couponTotal, totalItemPrice);
    const itemCoupons = new Array(sortedItems.length).fill(0);

    let distributedCoupon = 0;
    for (let i = 0; i < sortedItems.length - 1; i++) {
        const itemCoupon = Math.floor((normalizedCouponTotal * sortedItems[i].productPrice) / totalItemPrice);
        itemCoupons[i] = itemCoupon;
        distributedCoupon += itemCoupon;
    }

    const lastIndex = sortedItems.length - 1;
    itemCoupons[lastIndex] = normalizedCouponTotal - distributedCoupon;

    const lastItemPrice = sortedItems[lastIndex].productPrice;
    if (itemCoupons[lastIndex] > lastItemPrice) {
        let overflow = itemCoupons[lastIndex] - lastItemPrice;
        itemCoupons[lastIndex] = lastItemPrice;

        for (let i = 0; i < lastIndex && overflow > 0; i++) {
            const expandable = sortedItems[i].productPrice - itemCoupons[i];
            if (expandable <= 0) continue;
            const transfer = Math.min(expandable, overflow);
            itemCoupons[i] += transfer;
            overflow -= transfer;
        }
    }

    sortedItems.forEach((item, index) => {
        couponByOrderItem[item.orderItemUuid] = Math.max(0, Math.min(itemCoupons[index], item.productPrice));
    });

    return couponByOrderItem;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, isAuthenticated, accessToken } = useAuthStore();
    const {
        orderUuid,
        orderItems,
        orderResponseItems,
        couponUuid,
        getOrderSummary
    } = useOrderStore();

    const summary = getOrderSummary();
    const customerKey = user?.userUuid || 'ANONYMOUS';

    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
    const shouldRedirectLogin = !isAuthenticated || !accessToken;
    const shouldRedirectOrder = !orderUuid || orderItems.length === 0 || !orderResponseItems;

    useEffect(() => {
        if (shouldRedirectLogin || shouldRedirectOrder) return;

        async function fetchPaymentWidgets() {
            try {
                if (!tossClientKey) {
                    throw new Error('VITE_TOSS_CLIENT_KEY is not configured.');
                }

                const tossPayments = await loadTossPayments(tossClientKey);
                const widgetsInstance = tossPayments.widgets({ customerKey });
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

            await widgets.setAmount({
                currency: 'KRW',
                value: summary.pgPayAmount,
            });

            await widgets.renderPaymentMethods({
                selector: '#payment-method',
                variantKey: 'DEFAULT',
            });

            await widgets.renderAgreement({
                selector: '#agreement',
                variantKey: 'AGREEMENT',
            });

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, summary.pgPayAmount, shouldRedirectLogin, shouldRedirectOrder]);

    if (shouldRedirectLogin) return <Navigate to="/login" replace />;
    if (shouldRedirectOrder) return <Navigate to="/order" replace />;

    async function handlePaymentRequest() {
        if (!widgets || !orderUuid || !orderResponseItems) return;

        try {
            const orderName = orderItems.length > 1
                ? `${orderItems[0].title} 외 ${orderItems.length - 1}건`
                : orderItems[0].title;

            const idempotencyKey = orderUuid;
            const paymentCouponByOrderItem = buildPaymentCouponMap(
                orderResponseItems.map(item => ({
                    orderItemUuid: item.orderItemUuid,
                    productUuid: item.productUuid,
                    productPrice: item.productPrice,
                })),
                summary.couponDiscount
            );

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
                items: orderResponseItems.map(item => ({
                    orderItemUuid: item.orderItemUuid,
                    productUuid: item.productUuid,
                    productName: item.productName,
                    price: item.productPrice,
                    sellerUuid: item.sellerUuid,
                    paymentCoupon: paymentCouponByOrderItem[item.orderItemUuid] ?? 0
                }))
            }, idempotencyKey);

            if (!prepareResponse.success) {
                showToast(prepareResponse.message || '결제 준비 중 오류가 발생했습니다.', 'error');
                return;
            }

            const { toss, paymentUuid } = prepareResponse.data;

            const appendUuid = (url: string) => {
                if (url.includes('paymentUuid')) return url;
                const separator = url.includes('?') ? '&' : '?';
                return `${url}${separator}paymentUuid=${paymentUuid}`;
            };

            await widgets.requestPayment({
                orderId: toss.orderId,
                orderName: toss.orderName,
                successUrl: appendUuid(toss.successUrl),
                failUrl: appendUuid(toss.failUrl),
                customerEmail: user?.email,
                customerName: user?.nickname,
            });
        } catch (error: unknown) {
            console.error('Payment request failed:', error);
            const apiError = error as AxiosError<{ code?: string; message?: string; details?: string }> & { code?: string };

            // 토스 결제창을 사용자가 직접 닫거나 취소한 경우 — 현재 페이지에 머무름
            const tossCode = apiError.code || apiError.response?.data?.code || '';
            if (tossCode === 'PAYMENT_CANCELED' || tossCode === 'USER_CANCEL') {
                showToast('결제를 취소했습니다.', 'info');
                return;
            }

            const code = apiError.response?.data?.code || 'PREPARE_FAILED';
            const message = apiError.response?.data?.details
                || apiError.response?.data?.message
                || apiError.message
                || '결제 요청 중 오류가 발생했습니다.';

            showToast(message, 'error');
            navigate(`/payment/fail?code=${encodeURIComponent(code)}&message=${encodeURIComponent(message)}`);
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-3 py-6 min-[360px]:px-4 min-[360px]:py-10">
            <h1 className="mb-5 text-xl font-bold min-[360px]:mb-6 min-[360px]:text-2xl">결제하기</h1>

            <div id="payment-method" className="mb-4" />
            <div id="agreement" className="mb-6" />

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

