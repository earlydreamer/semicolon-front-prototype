import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/authService";
import type { LoginRequest, User, UserRegisterRequest } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isInitialized: boolean;

  login: (request: LoginRequest) => Promise<void>;
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

      login: async (request: LoginRequest) => {
        try {
          const { accessToken } = await authService.login(request);
          set({ accessToken, isAuthenticated: true });

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
          console.error("Refresh user failed:", error);
        }
      },

      socialLogin: async (accessToken: string, _refreshToken?: string | null) => {
        try {
          set({ accessToken, isAuthenticated: true });
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
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
