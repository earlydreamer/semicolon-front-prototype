import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { followService } from '../services/followService';

interface FollowState {
  userFollowing: Record<string, string[]>;

  toggleFollow: (userId: string, shopId: string) => Promise<boolean>;
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
        try {
          // 로컬 캐시가 오래됐을 수 있어 서버 상태를 기준으로 토글 방향을 결정한다.
          const before = await followService.getMyFollowing();
          const beforeIds = before.map((item) => item.sellerUuid);
          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: beforeIds },
          }));

          const isCurrentlyFollowing = beforeIds.includes(shopId);
          if (isCurrentlyFollowing) {
            await followService.unfollowSeller(shopId);
          } else {
            await followService.followSeller(shopId);
          }
          const refreshed = await followService.getMyFollowing();
          const ids = refreshed.map((item) => item.sellerUuid);
          set((state) => ({
            userFollowing: { ...state.userFollowing, [userId]: ids },
          }));
          return ids.includes(shopId);
        } catch (error) {
          // 중복 팔로우(409)는 서버 상태를 재조회해 정상 상태로 복구한다.
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            try {
              const refreshed = await followService.getMyFollowing();
              const ids = refreshed.map((item) => item.sellerUuid);
              set((state) => ({
                userFollowing: { ...state.userFollowing, [userId]: ids },
              }));
              return ids.includes(shopId);
            } catch {
              return true;
            }
          }

          console.error('Failed to toggle follow:', error);
          try {
            const refreshed = await followService.getMyFollowing();
            const ids = refreshed.map((item) => item.sellerUuid);
            set((state) => ({
              userFollowing: { ...state.userFollowing, [userId]: ids },
            }));
            return ids.includes(shopId);
          } catch (refreshError) {
            console.error('Failed to refresh following after toggle error:', refreshError);
          }
          throw error;
        }
      },

      isFollowing: (userId: string, shopId: string) => {
        return (get().userFollowing[userId] || []).includes(shopId);
      },

      removeFollow: async (userId: string, shopId: string) => {
        try {
          await followService.unfollowSeller(shopId);
          const refreshed = await followService.getMyFollowing();
          const ids = refreshed.map((item) => item.sellerUuid);
          set((state) => ({
            userFollowing: {
              ...state.userFollowing,
              [userId]: ids,
            },
          }));
        } catch (error) {
          console.error('Failed to unfollow:', error);
          throw error;
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
