/**
 * 二쇰Ц ?곹깭 愿由?Store (Zustand)
 */

import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Address } from '../types/address';

// OrderResponse.items ????뺤쓽
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
  orderUuid: string | null; // 二쇰Ц 怨좎쑀 ?앸퀎??
  orderItems: CartItem[]; // 二쇰Ц???곹뭹 紐⑸줉 (UI ?쒖떆??
  orderResponseItems: OrderItemResponse[] | null; // 二쇰Ц ?앹꽦 ??諛쏆? ?ㅼ젣 OrderItem ?뺣낫 (寃곗젣 ?붿껌??
  shippingInfo: Address | null; // ?좏깮??諛곗넚吏
  paymentMethod: string | null; // ?좏깮??寃곗젣 ?섎떒
  couponUuid: string | null; // ?좏깮??荑좏룿 UUID
  couponDiscountAmount: number; // 쿠폰 할인 금액
  depositUseAmount: number; // ?ъ슜???덉튂湲?湲덉븸
  
  // Actions
  setOrderUuid: (uuid: string | null) => void;
  setOrderItems: (items: CartItem[]) => void;
  setOrderResponseItems: (items: OrderItemResponse[] | null) => void;
  setShippingInfo: (address: Address | null) => void;
  setPaymentMethod: (method: string | null) => void;
  setCouponUuid: (uuid: string | null) => void;
  setCouponDiscountAmount: (amount: number) => void;
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
    
    // ?곹뭹 珥?媛寃?
    const totalProductPrice = orderItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    // 珥?諛곗넚鍮?(CartItem??shippingFee媛 ?녿뒗 寃쎌슦 0?쇰줈 泥섎━)
    // CartItem ????낅뜲?댄듃 ??異붽? ?꾩슂 ?꾩옱??Mock ?鍮??쒓굅??
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

  clearOrder: () => set({ 
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

