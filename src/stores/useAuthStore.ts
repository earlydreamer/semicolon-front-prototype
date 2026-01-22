import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { LoginRequest, User, UserRegisterRequest } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isInitialized: boolean;
  
  login: (request: LoginRequest) => Promise<void>;
  adminLogin: (id: string, pw: string) => boolean; // 임시 Mock 관리자 로그인
  register: (request: UserRegisterRequest) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      isInitialized: false,

      login: async (request: LoginRequest) => {
        try {
          // 1. 로그인 API 호출 (토큰 발급)
          const { accessToken } = await authService.login(request);
          
          // 2. 토큰을 STATE에 먼저 저장 (api.ts 인터셉터가 사용할 수 있도록)
          set({ accessToken, isAuthenticated: true });

          // 3. 내 정보 조회 API 호출 (유저 정보 획득)
          const user = await authService.getMe();
          set({ 
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === 'ADMIN'
          });
          
        } catch (error) {
          // 실패 시 상태 초기화
          set({ 
            accessToken: null, 
            isAuthenticated: false, 
            isAdminAuthenticated: false, 
            user: null 
          });
          throw error;
        }
      },

      // 임시 관리자 로그인 (Mock) - 실제론 별도 API나 role 체크 권장
      adminLogin: (id: string, pw: string) => {
        if (id === 'admin' && pw === 'admin123') {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (request: UserRegisterRequest) => {
         await authService.register(request);
      },

      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false, 
          isAdminAuthenticated: false 
        });
        // 필요하다면 로컬 스토리지 클리어, 홈으로 이동 등 추가 처리
      },

      initialize: async () => {
        const { accessToken, isAdminAuthenticated } = get();
        if (!accessToken) {
          // 토큰은 없지만 관리자 세션이 로컬에 남아있을 수 있음 (Mock용)
          set({ isInitialized: true });
          return;
        }

        try {
          const user = await authService.getMe();
          set({ 
            user: { ...user, id: user.userUuid }, 
            isAuthenticated: true,
            isAdminAuthenticated: user.role === 'ADMIN' || isAdminAuthenticated,
            isInitialized: true
          });
        } catch (error) {
          // 토큰 만료 등으로 조회 실패 시 로그아웃 처리
          set({ 
            user: null, 
            accessToken: null, 
            isAuthenticated: false,
            isAdminAuthenticated: false,
            isInitialized: true 
          });
        }
      },

      refreshUser: async () => {
        try {
          const user = await authService.getMe();
          set({ 
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === 'ADMIN' 
          });
        } catch (error) {
          console.error('Refresh user failed:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        isAdminAuthenticated: state.isAdminAuthenticated,
        user: state.user
      }),
    }
  )
);
