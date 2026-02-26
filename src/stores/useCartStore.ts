/**
 * 장바구니 상태 관리 Store (Zustand)
 * 백엔드 API 연동 버전
 */

import { create } from 'zustand';
import axios from 'axios';
import { cartService } from '../services/cartService';
import type { CartItem, CartSummary } from '../types/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (productUuid: string) => Promise<boolean>;
  removeItem: (cartId: number) => Promise<void>;
  isInCart: (productUuid: string) => boolean;
  toggleSelect: (productUuid: string) => void;
  selectAll: (selected: boolean) => void;
  removeSelectedItems: () => Promise<void>;
  clearCart: () => Promise<void>;

  getSelectedItems: () => CartItem[];
  getCartSummary: () => CartSummary;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.getCartList();
      const itemsWithSelection: CartItem[] = response.items.map((item) => ({
        ...item,
        selected: item.saleStatus === 'ON_SALE',
      }));
      set({ items: itemsWithSelection, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '장바구니를 불러오는 데 실패했어요.';
      set({ error: message, isLoading: false });
    }
  },

  addItem: async (productUuid: string) => {
    const exists = get().items.some((item) => item.productUuid === productUuid);
    if (exists) return false;

    try {
      await cartService.addToCart(productUuid);
      await get().fetchItems();
      return true;
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;

      if (status === 409) {
        await get().fetchItems();
        return false;
      }

      console.error('Add to cart failed:', error);
      throw error;
    }
  },

  removeItem: async (cartId: number) => {
    try {
      await cartService.removeFromCart([cartId]);
      set((state) => ({
        items: state.items.filter((item) => item.cartId !== cartId),
      }));
    } catch (error) {
      console.error('Remove from cart failed:', error);
      throw error;
    }
  },

  isInCart: (productUuid: string) => {
    return get().items.some((item) => item.productUuid === productUuid);
  },

  toggleSelect: (productUuid: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productUuid === productUuid && item.saleStatus === 'ON_SALE'
          ? { ...item, selected: !item.selected }
          : item,
      ),
    }));
  },

  selectAll: (selected: boolean) => {
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        selected: selected ? item.saleStatus === 'ON_SALE' : false,
      })),
    }));
  },

  removeSelectedItems: async () => {
    const selectedItems = get().getSelectedItems();
    try {
      const cartIds = selectedItems.map((item) => item.cartId);
      if (cartIds.length === 0) return;

      await cartService.removeFromCart(cartIds);
      set((state) => ({
        items: state.items.filter((item) => !item.selected),
      }));
    } catch (error) {
      console.error('Remove selected items failed:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ items: [] });
    } catch (error) {
      console.error('Clear cart failed:', error);
    }
  },

  getSelectedItems: () => {
    return get().items.filter((item) => item.selected);
  },

  getCartSummary: (): CartSummary => {
    const selectedItems = get().getSelectedItems();
    const productTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const shippingTotal = 0;

    return {
      selectedCount: selectedItems.length,
      productTotal,
      shippingTotal,
      grandTotal: productTotal + shippingTotal,
    };
  },

  getTotalCount: () => {
    return get().items.length;
  },
}));