import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getUserLikes } from '../mocks/likes';

interface LikeState {
  // 유저별 찜 목록: { [userId: string]: string[] }
  userLikes: Record<string, string[]>;
  
  // Actions
  toggleLike: (userId: string, productId: string) => void;
  isLiked: (userId: string, productId: string) => boolean;
  initUserLikes: (userId: string) => void;
  
  // Computed
  getLikedCount: (userId: string) => number;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      userLikes: {},
      
      initUserLikes: (userId: string) => {
        if (!get().userLikes[userId]) {
          const initialLikes = getUserLikes(userId).map(like => like.productId);
          set((state) => ({
            userLikes: { ...state.userLikes, [userId]: initialLikes }
          }));
        }
      },

      toggleLike: (userId: string, productId: string) => {
        const currentLikes = get().userLikes[userId] || [];
        const isCurrentlyLiked = currentLikes.includes(productId);
        
        let newLikes: string[];
        if (isCurrentlyLiked) {
          newLikes = currentLikes.filter((id) => id !== productId);
        } else {
          newLikes = [...currentLikes, productId];
        }

        set((state) => ({
          userLikes: { ...state.userLikes, [userId]: newLikes }
        }));
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
