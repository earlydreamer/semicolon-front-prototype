import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FollowState {
  // 유저별 팔로우 목록: { [userId: string]: string[] }
  userFollowing: Record<string, string[]>;
  
  // Actions
  toggleFollow: (userId: string, shopId: string) => void;
  isFollowing: (userId: string, shopId: string) => boolean;
  addFollow: (userId: string, shopId: string) => void;
  removeFollow: (userId: string, shopId: string) => void;
  initFollowing: (userId: string) => void;
  
  // Computed
  getFollowingCount: (userId: string) => number;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      userFollowing: {},
      
      initFollowing: (userId: string) => {
        if (!get().userFollowing[userId]) {
          // 초기 팔로우 상점 (Mock - 's3')
          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: ['s3'] }
          }));
        }
      },

      toggleFollow: (userId: string, shopId: string) => {
        const currentFollowing = get().userFollowing[userId] || [];
        const isCurrentlyFollowing = currentFollowing.includes(shopId);
        
        let newFollowing: string[];
        if (isCurrentlyFollowing) {
          newFollowing = currentFollowing.filter((id) => id !== shopId);
        } else {
          newFollowing = [...currentFollowing, shopId];
        }

        set((state) => ({
          userFollowing: { ...state.userFollowing, [userId]: newFollowing }
        }));
      },
      
      isFollowing: (userId: string, shopId: string) => {
        return (get().userFollowing[userId] || []).includes(shopId);
      },
      
      addFollow: (userId: string, shopId: string) => {
        const current = get().userFollowing[userId] || [];
        if (!current.includes(shopId)) {
          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: [...current, shopId] }
          }));
        }
      },
      
      removeFollow: (userId: string, shopId: string) => {
        const current = get().userFollowing[userId] || [];
        set((state) => ({
          userFollowing: { ...state.userFollowing, [userId]: current.filter((id) => id !== shopId) }
        }));
      },
      
      getFollowingCount: (userId: string) => {
        return (get().userFollowing[userId] || []).length;
      },
    }),
    {
      name: 'follow-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
