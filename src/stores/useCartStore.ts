/**
 * 장바구니 상태 관리 Store (Zustand)
 * 백엔드 API 연동 버전
 */

import { create } from 'zustand';
import { cartService } from '../services/cartService';
import type { CartItem, CartSummary } from '../types/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (productUuid: string) => Promise<boolean>; // 이미 담긴 상품이면 false 반환 (API에서 처리 가능)
  removeItem: (cartId: number) => Promise<void>;
  isInCart: (productUuid: string) => boolean;
  toggleSelect: (productUuid: string) => void;
  selectAll: (selected: boolean) => void;
  removeSelectedItems: () => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed
  getSelectedItems: () => CartItem[];
  getCartSummary: () => CartSummary;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  /**
   * 장바구니 목록 조회
   */
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.getCartList();
      // 프론트엔드 전용 선택 상태(selected) 초기화
      const itemsWithSelection: CartItem[] = response.items.map(item => ({
        ...item,
        selected: item.saleStatus === 'ON_SALE' // 판매 중인 상품만 기본 선택
      }));
      set({ items: itemsWithSelection, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '장바구니를 불러오는데 실패했습니다.';
      set({ error: message, isLoading: false });
    }
  },
  
  /**
   * 상품 추가
   */
  addItem: async (productUuid: string) => {
    // 이미 있는 상품인지 로컬에서 먼저 확인 (최적화)
    const exists = get().items.some(item => item.productUuid === productUuid);
    if (exists) return false;

    try {
      await cartService.addToCart(productUuid);
      await get().fetchItems(); // 목록 새로고침
      return true;
    } catch (error) {
      console.error('Add to cart failed:', error);
      return false;
    }
  },
  
  /**
   * 상품 삭제
   */
  removeItem: async (cartId: number) => {
    try {
      await cartService.removeFromCart(cartId);
      set((state) => ({
        items: state.items.filter((item) => item.cartId !== cartId),
      }));
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  },
  
  /**
   * 장바구니에 담긴 상품인지 확인
   */
  isInCart: (productUuid: string) => {
    return get().items.some((item) => item.productUuid === productUuid);
  },
  
  /**
   * 개별 선택/해제 토글 (프론트 전용)
   */
  toggleSelect: (productUuid: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productUuid === productUuid
          ? { ...item, selected: !item.selected }
          : item
      ),
    }));
  },
  
  /**
   * 전체 선택/해제 (프론트 전용)
   */
  selectAll: (selected: boolean) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selected })),
    }));
  },
  
  /**
   * 선택된 상품 삭제
   */
  removeSelectedItems: async () => {
    const selectedItems = get().getSelectedItems();
    try {
      // 순차적 삭제 (백엔드에 벌크 삭제 API가 있다면 교체 필요)
      await Promise.all(selectedItems.map(item => cartService.removeFromCart(item.cartId)));
      set((state) => ({
        items: state.items.filter((item) => !item.selected),
      }));
    } catch (error) {
      console.error('Remove selected items failed:', error);
    }
  },
  
  /**
   * 장바구니 비우기
   */
  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ items: [] });
    } catch (error) {
      console.error('Clear cart failed:', error);
    }
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
      (sum, item) => sum + item.price,
      0
    );
    
    // 백엔드 CartDto에 shippingFee가 없으므로 임시로 0 처리
    const shippingTotal = 0; 
    
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
