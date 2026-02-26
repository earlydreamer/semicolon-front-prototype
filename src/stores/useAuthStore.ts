import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MOCK_USERS_DATA, type User } from '../mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  
  /**
   * [MOCK] 동적 로그인
   * - loginId: user1, user2, ... user20
   * - password: testuser
   */
  login: (loginId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  
  /**
   * [MOCK] 관리자 로그인
   */
  adminLogin: (adminId: string, password: string) => boolean;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      
      login: async (loginId: string, password: string) => {
        // [MOCK] 인증 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 800));

        // password 검제
        if (password !== 'testuser') {
          return { success: false, message: '비밀번호가 일치하지 않습니다. (testuser 입력 필요)' };
        }

        // user1, user2 패턴 분석하여 인덱스 추출
        const match = loginId.match(/^user(\d+)$/);
        if (!match) {
          return { success: false, message: 'ID 형식이 올바르지 않습니다. (user1 ~ user20)' };
        }

        const index = parseInt(match[1], 10) - 1;
        const targetUser = MOCK_USERS_DATA[index];

        if (!targetUser) {
          return { success: false, message: '존재하지 않는 사용자입니다.' };
        }

        set({ user: targetUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false, isAdminAuthenticated: false }),

      adminLogin: (adminId: string, password: string) => {
        if (adminId === 'admin' && password === 'admin123') {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },
      
      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

