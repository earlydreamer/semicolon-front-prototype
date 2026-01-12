/**
 * 좋아요(찜) 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';

interface LikeState {
  likedProductIds: string[];
  
  // Actions
  toggleLike: (productId: string) => boolean; // 좋아요 추가 시 true, 제거 시 false
  isLiked: (productId: string) => boolean;
  addLike: (productId: string) => void;
  removeLike: (productId: string) => void;
  
  // Computed
  getLikedCount: () => number;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  // 초기 찜한 상품 (Mock)
  likedProductIds: ['p1', 'p5'],
  
  /**
   * 좋아요 토글
   * @returns 좋아요 추가 시 true, 제거 시 false
   */
  toggleLike: (productId: string) => {
    const isCurrentlyLiked = get().likedProductIds.includes(productId);
    
    if (isCurrentlyLiked) {
      set((state) => ({
        likedProductIds: state.likedProductIds.filter((id) => id !== productId),
      }));
      return false;
    } else {
      set((state) => ({
        likedProductIds: [...state.likedProductIds, productId],
      }));
      return true;
    }
  },
  
  /**
   * 좋아요 여부 확인
   */
  isLiked: (productId: string) => {
    return get().likedProductIds.includes(productId);
  },
  
  /**
   * 좋아요 추가
   */
  addLike: (productId: string) => {
    if (!get().likedProductIds.includes(productId)) {
      set((state) => ({
        likedProductIds: [...state.likedProductIds, productId],
      }));
    }
  },
  
  /**
   * 좋아요 제거
   */
  removeLike: (productId: string) => {
    set((state) => ({
      likedProductIds: state.likedProductIds.filter((id) => id !== productId),
    }));
  },
  
  /**
   * 좋아요 상품 수
   */
  getLikedCount: () => {
    return get().likedProductIds.length;
  },
}));
