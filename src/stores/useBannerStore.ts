/**
 * 배너 상태 관리 Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Banner, BannerInput } from '@/types/banner';
import { MOCK_BANNERS, DEFAULT_BANNER } from '@/mocks/banners';

interface BannerStore {
  banners: Banner[];
  isMockMode: boolean;
  
  // 활성 배너 목록 (order 순 정렬)
  getActiveBanners: () => Banner[];
  
  // 배너가 없을 때 디폴트 배너 반환
  getBannersForDisplay: () => Banner[];
  
  // CRUD
  addBanner: (input: BannerInput) => void;
  updateBanner: (id: string, input: Partial<BannerInput>) => void;
  deleteBanner: (id: string) => void;
  
  // 배너 목록 일괄 저장 (어드민용)
  setBanners: (banners: Banner[]) => void;
  
  // 활성화/비활성화
  toggleBannerActive: (id: string) => void;
  
  // 순서 변경
  reorderBanner: (id: string, newOrder: number) => void;
  moveBannerUp: (id: string) => void;
  moveBannerDown: (id: string) => void;
  
  // 초기화
  resetToDefault: () => void;
}

export const useBannerStore = create<BannerStore>()(
  persist(
    (set, get) => ({
      banners: [...MOCK_BANNERS],
      isMockMode: true,
      
      getActiveBanners: () => {
        return get().banners
          .filter(b => b.isActive)
          .sort((a, b) => a.order - b.order);
      },
      
      getBannersForDisplay: () => {
        const active = get().getActiveBanners();
        return active.length > 0 ? active : [DEFAULT_BANNER];
      },
      
      addBanner: (input) => {
        const banners = get().banners;
        const maxOrder = Math.max(0, ...banners.map(b => b.order));
        const newBanner: Banner = {
          id: `banner-${Date.now()}`,
          ...input,
          order: maxOrder + 1,
          isActive: input.isActive ?? true,
          createdAt: new Date().toISOString(),
        };
        set({ banners: [...banners, newBanner] });
      },
      
      updateBanner: (id, input) => {
        set({
          banners: get().banners.map(b =>
            b.id === id
              ? { ...b, ...input, updatedAt: new Date().toISOString() }
              : b
          ),
        });
      },
      
      deleteBanner: (id) => {
        set({ banners: get().banners.filter(b => b.id !== id) });
      },
      
      setBanners: (banners) => {
        set({ banners });
      },
      
      toggleBannerActive: (id) => {
        set({
          banners: get().banners.map(b =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          ),
        });
      },
      
      reorderBanner: (id, newOrder) => {
        set({
          banners: get().banners.map(b =>
            b.id === id ? { ...b, order: newOrder } : b
          ),
        });
      },
      
      moveBannerUp: (id) => {
        const banners = [...get().banners].sort((a, b) => a.order - b.order);
        const index = banners.findIndex(b => b.id === id);
        if (index > 0) {
          const prev = banners[index - 1];
          const curr = banners[index];
          const prevOrder = prev.order;
          prev.order = curr.order;
          curr.order = prevOrder;
          set({ banners });
        }
      },
      
      moveBannerDown: (id) => {
        const banners = [...get().banners].sort((a, b) => a.order - b.order);
        const index = banners.findIndex(b => b.id === id);
        if (index < banners.length - 1) {
          const next = banners[index + 1];
          const curr = banners[index];
          const nextOrder = next.order;
          next.order = curr.order;
          curr.order = nextOrder;
          set({ banners });
        }
      },
      
      resetToDefault: () => {
        set({ banners: [...MOCK_BANNERS] });
      },
    }),
    {
      name: 'dukku-banner-storage',
    }
  )
);
