/**
 * 주문 상태를 관리하는 Store(Zustand)입니다.
 */

import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Address } from '../types/address';

// 주문 생성 응답의 OrderItem 정보 타입입니다.
export interface OrderItemResponse {
  orderItemUuid: string;
  productId: number;
  productUuid: string;
  sellerUuid: string;
  productName: string;
  productPrice: number;
  imageUrl: string;
}

interface OrderState {
  orderUuid: string | null; // 주문 고유 식별자
  orderItems: CartItem[]; // 주문 대상 상품 목록(UI 표시용)
  orderResponseItems: OrderItemResponse[] | null; // 주문 생성 응답의 실제 OrderItem 목록
  shippingInfo: Address | null; // 선택된 배송지
  paymentMethod: string | null; // 선택된 결제 수단
  couponUuid: string | null; // 선택된 쿠폰 UUID
  couponDiscountAmount: number; // 쿠폰 할인 금액
  depositUseAmount: number; // 예치금 사용 금액

  // 상태 갱신 액션
  setOrderUuid: (uuid: string | null) => void;
  setOrderItems: (items: CartItem[]) => void;
  setOrderResponseItems: (items: OrderItemResponse[] | null) => void;
  setShippingInfo: (address: Address | null) => void;
  setPaymentMethod: (method: string | null) => void;
  setCouponUuid: (uuid: string | null) => void;
  setCouponDiscountAmount: (amount: number) => void;
  setDepositUseAmount: (amount: number) => void;

  // 요약 계산 도우미
  getOrderSummary: () => {
    totalProductPrice: number;
    totalShippingFee: number;
    couponDiscount: number;
    depositUseAmount: number;
    finalPrice: number;
    pgPayAmount: number;
  };
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderUuid: null,
  orderItems: [],
  orderResponseItems: null,
  shippingInfo: null,
  paymentMethod: null,
  couponUuid: null,
  couponDiscountAmount: 0,
  depositUseAmount: 0,

  setOrderUuid: (uuid) => set({ orderUuid: uuid }),
  setOrderItems: (items) => set({ orderItems: items }),
  setOrderResponseItems: (items) => set({ orderResponseItems: items }),
  setShippingInfo: (address) => set({ shippingInfo: address }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCouponUuid: (uuid) => set({ couponUuid: uuid }),
  setCouponDiscountAmount: (amount) => set({ couponDiscountAmount: amount }),
  setDepositUseAmount: (amount) => set({ depositUseAmount: amount }),

  getOrderSummary: () => {
    const { orderItems, depositUseAmount, couponDiscountAmount } = get();

    // 상품 합계를 계산합니다.
    const totalProductPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

    // 배송비는 CartItem에 별도 값이 없어 현재 0으로 계산합니다.
    const totalShippingFee = 0;

    const couponDiscount = Math.min(couponDiscountAmount, totalProductPrice);

    const finalPrice = totalProductPrice + totalShippingFee - couponDiscount;
    const pgPayAmount = Math.max(0, finalPrice - depositUseAmount);

    return {
      totalProductPrice,
      totalShippingFee,
      couponDiscount,
      depositUseAmount,
      finalPrice,
      pgPayAmount,
    };
  },

  clearOrder: () =>
    set({
      orderUuid: null,
      orderItems: [],
      orderResponseItems: null,
      shippingInfo: null,
      paymentMethod: null,
      couponUuid: null,
      couponDiscountAmount: 0,
      depositUseAmount: 0,
    }),
}));
