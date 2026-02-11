import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { followService } from '../services/followService';

interface FollowState {
  userFollowing: Record<string, string[]>;

  toggleFollow: (userId: string, shopId: string) => Promise<void>;
  isFollowing: (userId: string, shopId: string) => boolean;
  removeFollow: (userId: string, shopId: string) => Promise<void>;
  initFollowing: (userId: string) => Promise<void>;

  getFollowingCount: (userId: string) => number;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      userFollowing: {},

      initFollowing: async (userId: string) => {
        try {
          const following = await followService.getMyFollowing();
          const ids = following.map((item) => item.sellerUuid);
          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: ids },
          }));
        } catch (error) {
          console.error('Failed to initialize following list:', error);
        }
      },

      toggleFollow: async (userId: string, shopId: string) => {
        const currentFollowing = get().userFollowing[userId] || [];
        const isCurrentlyFollowing = currentFollowing.includes(shopId);

        try {
          if (isCurrentlyFollowing) {
            await followService.unfollowSeller(shopId);
          } else {
            await followService.followSeller(shopId);
          }

          const newFollowing = isCurrentlyFollowing
            ? currentFollowing.filter((id) => id !== shopId)
            : [...currentFollowing, shopId];

          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: newFollowing },
          }));
        } catch (error) {
          console.error('Failed to toggle follow:', error);
        }
      },

      isFollowing: (userId: string, shopId: string) => {
        return (get().userFollowing[userId] || []).includes(shopId);
      },

      removeFollow: async (userId: string, shopId: string) => {
        const current = get().userFollowing[userId] || [];

        try {
          await followService.unfollowSeller(shopId);
          set((state) => ({
            userFollowing: {
              ...state.userFollowing,
              [userId]: current.filter((id) => id !== shopId),
            },
          }));
        } catch (error) {
          console.error('Failed to unfollow:', error);
        }
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
