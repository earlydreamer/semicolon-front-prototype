import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userService } from '../services/userService';
import type { LikedProductItem } from '../services/userService';

interface LikeState {
  // 유저별 찜 목록: { [userId: string]: string[] }
  userLikes: Record<string, string[]>;
  
  // Actions
  toggleLike: (userId: string, productUuid: string) => Promise<void>;
  isLiked: (userId: string, productUuid: string) => boolean;
  fetchUserLikes: (userId: string) => Promise<void>;
  
  // Computed
  getLikedCount: (userId: string) => number;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      userLikes: {},
      
      fetchUserLikes: async (userId: string) => {
        try {
          const response = await userService.getLikedProducts();
          const likedProducts: LikedProductItem[] = response.items ?? response.content ?? [];
          const likedProductUuids = likedProducts.map((p) => p.productUuid);
          set((state) => ({
            userLikes: { ...state.userLikes, [userId]: likedProductUuids }
          }));
        } catch (error) {
          console.error('Fetch user likes failed:', error);
        }
      },

      toggleLike: async (userId: string, productUuid: string) => {
        const currentLikes = get().userLikes[userId] || [];
        const isCurrentlyLiked = currentLikes.includes(productUuid);
        
        try {
          if (isCurrentlyLiked) {
            await userService.unlikeProduct(productUuid);
          } else {
            await userService.likeProduct(productUuid);
          }

          // Update local state after successful API call
          let newLikes: string[];
          if (isCurrentlyLiked) {
            newLikes = currentLikes.filter((id) => id !== productUuid);
          } else {
            newLikes = [...currentLikes, productUuid];
          }

          set((state) => ({
            userLikes: { ...state.userLikes, [userId]: newLikes }
          }));
        } catch (error) {
          console.error('Toggle like failed:', error);
          throw error;
        }
      },
      
      isLiked: (userId: string, productUuid: string) => {
        return (get().userLikes[userId] || []).includes(productUuid);
      },
      
      getLikedCount: (userId: string) => {
        return (get().userLikes[userId] || []).length;
      },
    }),
    {
      name: 'like-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
