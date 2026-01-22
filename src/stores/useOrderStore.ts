/**
 * 주문 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Address } from '../mocks/address';

interface OrderState {
  orderUuid: string | null; // 주문 고유 식별자
  orderItems: CartItem[]; // 주문할 상품 목록
  shippingInfo: Address | null; // 선택된 배송지
  paymentMethod: string | null; // 선택된 결제 수단
  couponUuid: string | null; // 선택된 쿠폰 UUID
  depositUseAmount: number; // 사용한 예치금 금액
  
  // Actions
  setOrderUuid: (uuid: string | null) => void;
  setOrderItems: (items: CartItem[]) => void;
  setShippingInfo: (address: Address | null) => void;
  setPaymentMethod: (method: string | null) => void;
  setCouponUuid: (uuid: string | null) => void;
  setDepositUseAmount: (amount: number) => void;
  
  // Computed (helper)
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
  shippingInfo: null,
  paymentMethod: null,
  couponUuid: null,
  depositUseAmount: 0,

  setOrderUuid: (uuid) => set({ orderUuid: uuid }),
  setOrderItems: (items) => set({ orderItems: items }),
  setShippingInfo: (address) => set({ shippingInfo: address }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCouponUuid: (uuid) => set({ couponUuid: uuid }),
  setDepositUseAmount: (amount) => set({ depositUseAmount: amount }),

  getOrderSummary: () => {
    const { orderItems, depositUseAmount } = get();
    
    // 상품 총 가격
    const totalProductPrice = orderItems.reduce(
      (sum, item) => sum + item.product.price,
      0
    );

    // 총 배송비
    const totalShippingFee = orderItems.reduce(
      (sum, item) => sum + item.product.shippingFee,
      0
    );

    // TODO: 쿠폰 할인 로직 연동 (현재는 하드코딩 또는 외부 계산 필요)
    // 여기서는 단순성을 위해 0으로 시작
    const couponDiscount = 0;

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

  clearOrder: () => set({ 
    orderUuid: null,
    orderItems: [], 
    shippingInfo: null, 
    paymentMethod: null,
    couponUuid: null,
    depositUseAmount: 0,
  }),
}));
