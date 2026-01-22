import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userService } from '../services/userService';

interface LikeState {
  // 유저별 찜 목록: { [userId: string]: string[] }
  userLikes: Record<string, string[]>;
  
  // Actions
  toggleLike: (userId: string, productId: string) => Promise<void>;
  isLiked: (userId: string, productId: string) => boolean;
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
          // MyLikedProductListResponse 구조 (items 가 실제 상품 목록)
          const likedProductUuids = response.items?.map((p: any) => p.productUuid) || [];
          set((state) => ({
            userLikes: { ...state.userLikes, [userId]: likedProductUuids }
          }));
        } catch (error) {
          console.error('Fetch user likes failed:', error);
        }
      },

      toggleLike: async (userId: string, productId: string) => {
        const currentLikes = get().userLikes[userId] || [];
        const isCurrentlyLiked = currentLikes.includes(productId);
        
        try {
          if (isCurrentlyLiked) {
            await userService.unlikeProduct(productId);
          } else {
            await userService.likeProduct(productId);
          }

          // Update local state after successful API call
          let newLikes: string[];
          if (isCurrentlyLiked) {
            newLikes = currentLikes.filter((id) => id !== productId);
          } else {
            newLikes = [...currentLikes, productId];
          }

          set((state) => ({
            userLikes: { ...state.userLikes, [userId]: newLikes }
          }));
        } catch (error) {
          console.error('Toggle like failed:', error);
          throw error;
        }
      },
      
      isLiked: (userId: string, productId: string) => {
        return (get().userLikes[userId] || []).includes(productId);
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
