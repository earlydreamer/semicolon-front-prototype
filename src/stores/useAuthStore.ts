import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * [MOCK] User Interface
 * 나중에 실제 백엔드 API, 타입 정의와 연동 시 교체 필요
 */
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * [MOCK] Auth Store
 * 현재는 클라이언트 측 Mock 데이터로 동작하며, LocalStorage에 상태를 영구 저장합니다.
 * 추후 API 연동 시 login/logout 액션 내부 로직을 API 호출로 변경해야 합니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
