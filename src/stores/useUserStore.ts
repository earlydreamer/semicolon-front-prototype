import { create } from 'zustand';
import { userService } from '../services/userService';
import type { DepositBalanceData, DepositHistoryItem } from '../services/userService';

interface UserState {
  balance: DepositBalanceData | null;
  histories: DepositHistoryItem[];
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchHistories: (size?: number, isMore?: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  balance: null,
  histories: [],
  nextCursor: null,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const response = await userService.getDepositBalance();
      if (response.success) {
        set({ balance: response.data });
      }
    } catch (error) {
      console.error('Fetch balance failed:', error);
    }
  },

  fetchHistories: async (size = 10, isMore = false) => {
    set({ isLoading: true });
    try {
      const cursor = isMore ? get().nextCursor : undefined;
      const response = await userService.getDepositHistories(size, cursor || undefined);
      
      if (response.success) {
        set((state) => ({
          histories: isMore ? [...state.histories, ...response.data.items] : response.data.items,
          nextCursor: response.data.page.nextCursor,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: '예치금 내역을 불러오는데 실패했습니다.', isLoading: false });
    }
  },
}));
