import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userService } from "../services/userService";
import type { LikedProductItem } from "../services/userService";

interface LikeState {
  userLikes: Record<string, string[]>;

  toggleLike: (
    userId: string,
    productUuid: string,
  ) => Promise<{ isLiked: boolean }>;
  isLiked: (userId: string, productUuid: string) => boolean;
  fetchUserLikes: (userId: string) => Promise<void>;
  getLikedCount: (userId: string) => number;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      userLikes: {},

      fetchUserLikes: async (userId: string) => {
        try {
          // 단건 대용량 조회로 요청 폭주를 피하면서 누락 가능성을 줄인다.
          const response = await userService.getLikedProducts(0, 200);
          const likedProducts: LikedProductItem[] =
            response.items ?? response.content ?? [];
          const uniqueLikedProductUuids = Array.from(
            new Set(likedProducts.map((p) => p.productUuid)),
          );

          set((state) => ({
            ...state,
            userLikes: {
              ...state.userLikes,
              [userId]: uniqueLikedProductUuids,
            },
          }));
        } catch (error) {
          console.error("Fetch user likes failed:", error);
        }
      },

      toggleLike: async (userId: string, productUuid: string) => {
        const previousLikes = get().userLikes[userId] || [];
        const isCurrentlyLiked = previousLikes.includes(productUuid);
        const nextLiked = !isCurrentlyLiked;
        const nextLikes = nextLiked
          ? Array.from(new Set([...previousLikes, productUuid]))
          : previousLikes.filter((id) => id !== productUuid);

        set((state) => ({
          ...state,
          userLikes: {
            ...state.userLikes,
            [userId]: nextLikes,
          },
        }));

        try {
          if (isCurrentlyLiked) {
            await userService.unlikeProduct(productUuid);
          } else {
            await userService.likeProduct(productUuid);
          }

          // 서버 상태를 다시 동기화해서 누락/불일치 방지
          void get().fetchUserLikes(userId);

          return {
            isLiked: nextLiked,
          };
        } catch (error) {
          // 실패 시 즉시 롤백
          set((state) => ({
            ...state,
            userLikes: {
              ...state.userLikes,
              [userId]: previousLikes,
            },
          }));

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
      name: "like-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userLikes: state.userLikes }),
    },
  ),
);
