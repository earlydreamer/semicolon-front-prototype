import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";
import type { LoginRequest, User, UserRegisterRequest } from "../types/auth";

const authStorage = {
  getItem: (name: string) => {
    return localStorage.getItem(name) ?? sessionStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    try {
      const parsed = JSON.parse(value) as { state?: { rememberMe?: boolean } };
      const rememberMe = Boolean(parsed?.state?.rememberMe);
      if (rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
        return;
      }
    } catch {
      // ignore parse errors and fallback to session storage
    }

    sessionStorage.setItem(name, value);
    localStorage.removeItem(name);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isInitialized: boolean;
  rememberMe: boolean;

  login: (request: LoginRequest, rememberMe?: boolean) => Promise<void>;
  loginAdmin: (request: LoginRequest, rememberMe?: boolean) => Promise<void>;
  register: (request: UserRegisterRequest) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
  socialLogin: (accessToken: string, refreshToken?: string | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      isInitialized: false,
      rememberMe: false,

      login: async (request: LoginRequest, rememberMe = true) => {
        try {
          const { accessToken } = await authService.login(request);
          set({ accessToken, isAuthenticated: true, rememberMe });

          const user = await authService.getMe();
          set({
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === "ADMIN",
          });
        } catch (error) {
          set({
            accessToken: null,
            isAuthenticated: false,
            isAdminAuthenticated: false,
            user: null,
            rememberMe: false,
          });
          throw error;
        }
      },

      loginAdmin: async (request: LoginRequest, rememberMe = true) => {
        try {
          const { accessToken } = await authService.loginAdmin(request);
          set({ accessToken, isAuthenticated: true, rememberMe });

          const user = await authService.getMe();
          set({
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === "ADMIN",
          });
        } catch (error) {
          set({
            accessToken: null,
            isAuthenticated: false,
            isAdminAuthenticated: false,
            user: null,
            rememberMe: false,
          });
          throw error;
        }
      },

      register: async (request: UserRegisterRequest) => {
        await authService.register(request);
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isAdminAuthenticated: false,
          rememberMe: false,
        });
      },

      initialize: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({
            isAdminAuthenticated: false,
            isInitialized: true,
          });
          return;
        }

        try {
          const user = await authService.getMe();
          set({
            user: { ...user, id: user.userUuid },
            isAuthenticated: true,
            isAdminAuthenticated: user.role === "ADMIN",
            isInitialized: true,
          });
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isAdminAuthenticated: false,
            isInitialized: true,
            rememberMe: false,
          });
        }
      },

      refreshUser: async () => {
        try {
          const user = await authService.getMe();
          set({
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === "ADMIN",
          });
        } catch (error) {
          console.error("사용자 정보 새로고침 실패:", error);
        }
      },

      socialLogin: async (accessToken: string, _refreshToken?: string | null) => {
        try {
          set({ accessToken, isAuthenticated: true, rememberMe: true });
          const user = await authService.getMe();
          set({
            user: { ...user, id: user.userUuid },
            isAdminAuthenticated: user.role === "ADMIN",
          });
        } catch (error) {
          set({
            accessToken: null,
            isAuthenticated: false,
            isAdminAuthenticated: false,
            user: null,
            rememberMe: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
