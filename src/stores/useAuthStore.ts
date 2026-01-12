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
  /**
   * [ADMIN] 관리자 인증 상태
   * - 현재는 프론트엔드 Mock 처리
   * - 추후 백엔드 API 연동 시 실제 권한 검사 필요
   * - 관리자 페이지는 별도 서브도메인으로 분리 예정
   */
  isAdminAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  /**
   * [MOCK] 관리자 로그인
   * TODO: API 연동 시 실제 권한 검사 로직으로 교체
   */
  adminLogin: (adminId: string, password: string) => boolean;
  adminLogout: () => void;
}

/**
 * [MOCK] Auth Store
 * 현재는 클라이언트 측 Mock 데이터로 동작하며, LocalStorage에 상태를 영구 저장합니다.
 * 추후 API 연동 시 login/logout 액션 내부 로직을 API 호출로 변경해야 합니다.
 * 
 * [IMPORTANT] 관리자 인증 관련
 * - isAdminAuthenticated: 관리자 페이지 접근 권한
 * - 현재 Mock 로그인 (admin/admin123)
 * - 추후 백엔드 API 연동 시:
 *   1. 별도 서브도메인(admin.example.com)으로 분리
 *   2. JWT 토큰 기반 권한 검사
 *   3. API 레벨 권한 차단 필수 (프론트엔드만으로는 불충분)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, isAdminAuthenticated: false }),
      adminLogin: (adminId: string, password: string) => {
        // [MOCK] 하드코딩된 관리자 계정
        // TODO: 추후 API 연동 시 실제 인증 로직으로 교체 필요
        if (adminId === 'admin' && password === 'admin123') {
          set({ isAdminAuthenticated: true });
          console.log('[MOCK] Admin login successful');
          return true;
        }
        console.log('[MOCK] Admin login failed - invalid credentials');
        return false;
      },
      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

