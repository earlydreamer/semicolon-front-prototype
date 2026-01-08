/**
 * 주문 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Address } from '../mocks/address';

interface OrderState {
  orderItems: CartItem[]; // 주문할 상품 목록
  shippingInfo: Address | null; // 선택된 배송지
  paymentMethod: string | null; // 선택된 결제 수단
  
  // Actions
  setOrderItems: (items: CartItem[]) => void;
  setShippingInfo: (address: Address | null) => void;
  setPaymentMethod: (method: string | null) => void;
  
  // Computed (helper)
  getOrderSummary: () => {
    totalProductPrice: number;
    totalShippingFee: number;
    finalPrice: number;
  };
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderItems: [],
  shippingInfo: null,
  paymentMethod: null,

  setOrderItems: (items) => set({ orderItems: items }),
  
  setShippingInfo: (address) => set({ shippingInfo: address }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  getOrderSummary: () => {
    const { orderItems } = get();
    
    // 상품 총 가격
    const totalProductPrice = orderItems.reduce(
      (sum, item) => sum + item.product.price,
      0
    );

    // 총 배송비 (배송비가 있는 상품들의 합)
    // 중고거래 특성상 묶음배송 로직이 복잡할 수 있으나, 여기서는 단순 합산으로 처리하거나
    // 판매자별로 묶어야 하지만, MVP에서는 단순 합산으로 가정
    const totalShippingFee = orderItems.reduce(
      (sum, item) => sum + item.product.shippingFee,
      0
    );

    const finalPrice = totalProductPrice + totalShippingFee;

    return {
      totalProductPrice,
      totalShippingFee,
      finalPrice,
    };
  },

  clearOrder: () => set({ 
    orderItems: [], 
    shippingInfo: null, 
    paymentMethod: null 
  }),
}));
