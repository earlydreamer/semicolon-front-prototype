/**
 * 장바구니 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import type { CartItem, CartSummary } from '../types/cart';
import type { Product } from '../mocks/products';

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (product: Product) => boolean; // 이미 담긴 상품이면 false 반환
  removeItem: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  toggleSelect: (productId: string) => void;
  selectAll: (selected: boolean) => void;
  removeSelectedItems: () => void;
  clearCart: () => void;
  
  // Computed
  getSelectedItems: () => CartItem[];
  getCartSummary: () => CartSummary;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  /**
   * 상품 추가 (중고거래 특성상 동일 상품은 1개만 담을 수 있음)
   * @returns 추가 성공 시 true, 이미 담긴 상품이면 false
   */
  addItem: (product: Product) => {
    const state = get();
    const exists = state.items.some((item) => item.productId === product.id);
    
    if (exists) {
      return false; // 이미 장바구니에 담긴 상품
    }
    
    // 새 상품 추가 (수량은 항상 1)
    const newItem: CartItem = {
      productId: product.id,
      product,
      quantity: 1,
      addedAt: new Date().toISOString(),
      selected: true,
    };
    
    set({ items: [...state.items, newItem] });
    return true;
  },
  
  /**
   * 상품 삭제
   */
  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  
  /**
   * 장바구니에 담긴 상품인지 확인
   */
  isInCart: (productId: string) => {
    return get().items.some((item) => item.productId === productId);
  },
  
  /**
   * 개별 선택/해제 토글
   */
  toggleSelect: (productId: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      ),
    }));
  },
  
  /**
   * 전체 선택/해제
   */
  selectAll: (selected: boolean) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selected })),
    }));
  },
  
  /**
   * 선택된 상품 삭제
   */
  removeSelectedItems: () => {
    set((state) => ({
      items: state.items.filter((item) => !item.selected),
    }));
  },
  
  /**
   * 장바구니 비우기
   */
  clearCart: () => {
    set({ items: [] });
  },
  
  /**
   * 선택된 상품 목록 반환
   */
  getSelectedItems: () => {
    return get().items.filter((item) => item.selected);
  },
  
  /**
   * 장바구니 요약 정보 계산
   */
  getCartSummary: (): CartSummary => {
    const selectedItems = get().getSelectedItems();
    
    const productTotal = selectedItems.reduce(
      (sum, item) => sum + item.product.price,
      0
    );
    
    const shippingTotal = selectedItems.reduce(
      (sum, item) => sum + item.product.shippingFee,
      0
    );
    
    return {
      selectedCount: selectedItems.length,
      productTotal,
      shippingTotal,
      grandTotal: productTotal + shippingTotal,
    };
  },
  
  /**
   * 장바구니 총 상품 수
   */
  getTotalCount: () => {
    return get().items.length;
  },
}));
