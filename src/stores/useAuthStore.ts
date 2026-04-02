import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "../services/authService";
import type { LoginRequest, User, UserRegisterRequest } from "../types/auth";

export const normalizeAccessToken = (token: string) => token.replace(/^Bearer\s+/i, "").trim();

export const isAdminUser = (user: Pick<User, "role"> | null) => user?.role === "ADMIN";

const AUTH_STORAGE_NAME = "auth-storage";
const AUTH_REFRESH_TOKEN_STORAGE_KEY = `${AUTH_STORAGE_NAME}:refresh-token`;

type AuthSnapshot = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  rememberMe: boolean;
};

type PersistedAuthEnvelope = {
  state?: Partial<AuthSnapshot>;
  version?: number;
};

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const withUserId = (user: User): User => ({
  ...user,
  id: user.userUuid,
});

const createClearedSnapshot = (rememberMe = false): AuthSnapshot => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  rememberMe,
});

const createAuthenticatedSnapshot = (
  user: User,
  accessToken: string,
  refreshToken: string | null,
  rememberMe: boolean,
): AuthSnapshot => ({
  user: withUserId(user),
  accessToken: normalizeAccessToken(accessToken),
  refreshToken,
  isAuthenticated: true,
  isAdminAuthenticated: isAdminUser(user),
  rememberMe,
});

const parseAuthEnvelope = (value: string | null): PersistedAuthEnvelope | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as PersistedAuthEnvelope;
  } catch {
    return null;
  }
};

const getAuthBaseStorage = (
  rememberMe: boolean,
  localStorageAdapter: StorageAdapter,
  sessionStorageAdapter: StorageAdapter,
) => (rememberMe ? localStorageAdapter : sessionStorageAdapter);

export const createAuthStorage = (
  localStorageAdapter: StorageAdapter = localStorage,
  sessionStorageAdapter: StorageAdapter = sessionStorage,
) => ({
  getItem: (name: string) => {
    const storedValue =
      localStorageAdapter.getItem(name) ?? sessionStorageAdapter.getItem(name);

    if (!storedValue) {
      return null;
    }

    const parsed = parseAuthEnvelope(storedValue);
    if (!parsed?.state) {
      return storedValue;
    }

    const sessionRefreshToken = sessionStorageAdapter.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);

    return JSON.stringify({
      ...parsed,
      state: {
        ...parsed.state,
        refreshToken: sessionRefreshToken ?? parsed.state.refreshToken ?? null,
      },
    });
  },
  setItem: (name: string, value: string) => {
    const parsed = parseAuthEnvelope(value);
    const state = parsed?.state ?? null;
    const rememberMe = Boolean(state?.rememberMe);
    const baseStorage = getAuthBaseStorage(rememberMe, localStorageAdapter, sessionStorageAdapter);
    const oppositeStorage = rememberMe ? sessionStorageAdapter : localStorageAdapter;
    const refreshToken = state?.refreshToken?.trim() || null;

    const basePayload = parsed
      ? JSON.stringify({
          ...parsed,
          state: {
            ...state,
            refreshToken: null,
          },
        })
      : value;

    baseStorage.setItem(name, basePayload);
    oppositeStorage.removeItem(name);

    if (refreshToken) {
      sessionStorageAdapter.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    } else {
      sessionStorageAdapter.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
    }
  },
  removeItem: (name: string) => {
    localStorageAdapter.removeItem(name);
    sessionStorageAdapter.removeItem(name);
    sessionStorageAdapter.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
  },
});

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
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

const applyUserSession = (
  user: User,
  accessToken: string,
  refreshToken: string | null,
  rememberMe: boolean,
): AuthSnapshot => ({
  ...createAuthenticatedSnapshot(user, accessToken, refreshToken, rememberMe),
  user: withUserId(user),
});

const clearUserSession = (rememberMe = false): AuthSnapshot =>
  createClearedSnapshot(rememberMe);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
      isInitialized: false,
      rememberMe: false,

      login: async (request: LoginRequest, rememberMe = true) => {
        try {
          const { accessToken, refreshToken } = await authService.login(request);
          set({
            ...clearUserSession(rememberMe),
            accessToken: normalizeAccessToken(accessToken),
            refreshToken: refreshToken || null,
            rememberMe,
          });

          const user = await authService.getMe();
          set({
            ...applyUserSession(user, accessToken, refreshToken || null, rememberMe),
            isInitialized: true,
          });
        } catch (error) {
          set(clearUserSession());
          throw error;
        }
      },

      loginAdmin: async (request: LoginRequest, rememberMe = true) => {
        try {
          const { accessToken, refreshToken } = await authService.loginAdmin(request);
          set({
            ...clearUserSession(rememberMe),
            accessToken: normalizeAccessToken(accessToken),
            refreshToken: refreshToken || null,
            rememberMe,
          });

          const user = await authService.getMe();
          set({
            ...applyUserSession(user, accessToken, refreshToken || null, rememberMe),
            isInitialized: true,
          });
        } catch (error) {
          set(clearUserSession());
          throw error;
        }
      },

      register: async (request: UserRegisterRequest) => {
        await authService.register(request);
      },

      logout: () => {
        set(clearUserSession());
      },

      initialize: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({
            ...clearUserSession(),
            isInitialized: true,
          });
          return;
        }

        try {
          const user = await authService.getMe();
          set({
            ...applyUserSession(user, accessToken, get().refreshToken, get().rememberMe),
            isInitialized: true,
          });
        } catch {
          set({
            ...clearUserSession(),
            isInitialized: true,
          });
        }
      },

      refreshUser: async () => {
        try {
          const user = await authService.getMe();
          set({
            user: withUserId(user),
            isAuthenticated: true,
            isAdminAuthenticated: isAdminUser(user),
          });
        } catch (error) {
          console.error("사용자 정보 새로고침 실패:", error);
        }
      },

      socialLogin: async (accessToken: string, refreshToken?: string | null) => {
        try {
          set({
            ...clearUserSession(true),
            accessToken: normalizeAccessToken(accessToken),
            refreshToken: refreshToken || null,
            rememberMe: true,
          });
          const user = await authService.getMe();
          set({
            ...applyUserSession(user, accessToken, refreshToken || null, true),
            isInitialized: true,
          });
        } catch (error) {
          set(clearUserSession());
          throw error;
        }
      },
    }),
    {
      name: AUTH_STORAGE_NAME,
      storage: createJSONStorage(() => createAuthStorage()),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isAdminAuthenticated: state.isAdminAuthenticated,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
