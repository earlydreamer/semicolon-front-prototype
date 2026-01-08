/**
 * 팔로우 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';

interface FollowState {
  followingShopIds: string[];
  
  // Actions
  toggleFollow: (shopId: string) => boolean; // 팔로우 시 true, 언팔로우 시 false
  isFollowing: (shopId: string) => boolean;
  addFollow: (shopId: string) => void;
  removeFollow: (shopId: string) => void;
  
  // Computed
  getFollowingCount: () => number;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  // 초기 팔로우 상점 (Mock)
  followingShopIds: ['s3'],
  
  /**
   * 팔로우 토글
   * @returns 팔로우 시 true, 언팔로우 시 false
   */
  toggleFollow: (shopId: string) => {
    const isCurrentlyFollowing = get().followingShopIds.includes(shopId);
    
    if (isCurrentlyFollowing) {
      set((state) => ({
        followingShopIds: state.followingShopIds.filter((id) => id !== shopId),
      }));
      return false;
    } else {
      set((state) => ({
        followingShopIds: [...state.followingShopIds, shopId],
      }));
      return true;
    }
  },
  
  /**
   * 팔로우 여부 확인
   */
  isFollowing: (shopId: string) => {
    return get().followingShopIds.includes(shopId);
  },
  
  /**
   * 팔로우 추가
   */
  addFollow: (shopId: string) => {
    if (!get().followingShopIds.includes(shopId)) {
      set((state) => ({
        followingShopIds: [...state.followingShopIds, shopId],
      }));
    }
  },
  
  /**
   * 팔로우 제거
   */
  removeFollow: (shopId: string) => {
    set((state) => ({
      followingShopIds: state.followingShopIds.filter((id) => id !== shopId),
    }));
  },
  
  /**
   * 팔로우 중인 상점 수
   */
  getFollowingCount: () => {
    return get().followingShopIds.length;
  },
}));
