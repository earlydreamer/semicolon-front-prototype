import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import type { TokenResponse } from '../types/auth';
import { resolveApiBaseUrl } from './runtimeUrls';

export { resolveApiBaseUrl } from './runtimeUrls';

const BASE_URL = resolveApiBaseUrl();
const AUTH_REFRESH_PATH = '/api/v1/auth/refresh';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = Pick<TokenResponse, 'accessToken' | 'refreshToken'>;

const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);

const baseHeaders = {
  'Content-Type': 'application/json',
} as const;

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: apiTimeout,
  headers: baseHeaders,
});

const api = axios.create({
  baseURL: BASE_URL,
  timeout: apiTimeout,
  headers: baseHeaders,
});

export const normalizeBearerToken = (token: string) => token.replace(/^Bearer\s+/i, '').trim();

export const buildAuthorizationHeader = (token: string | null | undefined) => {
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }

  const normalized = normalizeBearerToken(token);
  return normalized ? `Bearer ${normalized}` : null;
};

export const isSessionExpiryCandidate = (requestUrl: string) => {
  const normalized = requestUrl || '';

  if (!normalized) {
    return true;
  }

  return !(
    normalized.includes('/payments/request') ||
    normalized.includes('/payments/confirm') ||
    normalized.startsWith('/api/v1/auth/login') ||
    normalized.startsWith('/api/v1/auth/refresh') ||
    normalized.startsWith('/api/v1/auth/logout') ||
    normalized.startsWith('/api/v1/admin/auth/login')
  );
};

export const buildSessionExpiryRedirectUrl = (
  pathname: string,
  search = '',
) => {
  const currentPath = `${pathname}${search}`;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname.startsWith('/admin/login');

  if (isAdminPage && !isAdminLoginPage) {
    return `/admin/login?error=expired&returnUrl=${encodeURIComponent(currentPath)}`;
  }

  if (
    pathname.includes('/login') ||
    pathname.includes('/signup')
  ) {
    return null;
  }

  return `/login?error=expired&returnUrl=${encodeURIComponent(currentPath)}`;
};

export const createSingleFlightCoordinator = <T>(task: () => Promise<T>) => {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (!inFlight) {
      inFlight = task().finally(() => {
        inFlight = null;
      });
    }

    return inFlight;
  };
};

const clearAndRedirectSession = (requestUrl: string, forceRedirect = false) => {
  const { logout } = useAuthStore.getState();
  const redirectUrl = buildSessionExpiryRedirectUrl(window.location.pathname, window.location.search);

  logout();

  if (redirectUrl && (forceRedirect || isSessionExpiryCandidate(requestUrl))) {
    window.location.href = redirectUrl;
  }
};

const performRefresh = async (): Promise<string | null> => {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    clearAndRedirectSession(AUTH_REFRESH_PATH, true);
    return null;
  }

  try {
    const response = await refreshClient.post<RefreshResponse>(
      AUTH_REFRESH_PATH,
      undefined,
      {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      },
    );

    const accessToken = normalizeBearerToken(response.data.accessToken);
    const nextRefreshToken = response.data.refreshToken?.trim() || refreshToken;

    useAuthStore.setState((state) => ({
      ...state,
      accessToken,
      refreshToken: nextRefreshToken,
    }));

    return accessToken;
  } catch (error) {
    console.error('[API Refresh] session refresh failed:', error);
    clearAndRedirectSession(AUTH_REFRESH_PATH, true);
    return null;
  }
};

const refreshSessionOnce = createSingleFlightCoordinator(performRefresh);

export const refreshAccessTokenOnce = async (requestUrl: string): Promise<string | null> => {
  if (!isSessionExpiryCandidate(requestUrl)) {
    return null;
  }

  return refreshSessionOnce();
};

const getRequestUrl = (config?: RetriableRequestConfig) => String(config?.url || '');

// Request interceptor: inject Authorization header
api.interceptors.request.use((config) => {
  const { accessToken, logout } = useAuthStore.getState();
  const authHeader = buildAuthorizationHeader(accessToken);

  if (authHeader) {
    config.headers.Authorization = authHeader;
  } else if (accessToken) {
    console.error(`[API Request] Invalid token detected: ${accessToken}`);
    logout();
  }

  return config;
});

// Response interceptor: refresh once, then retry original request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestConfig = error.config as RetriableRequestConfig | undefined;
    const requestUrl = getRequestUrl(requestConfig);

    if (!isSessionExpiryCandidate(requestUrl)) {
      return Promise.reject(error);
    }

    if (requestConfig?._retry) {
      clearAndRedirectSession(requestUrl);
      return Promise.reject(error);
    }

    const refreshedAccessToken = await refreshAccessTokenOnce(requestUrl);
    if (!refreshedAccessToken || !requestConfig) {
      return Promise.reject(error);
    }

    requestConfig._retry = true;
    requestConfig.headers.Authorization = buildAuthorizationHeader(refreshedAccessToken) ?? undefined;

    return api(requestConfig);
  },
);

export const redirectOnSessionExpiry = (requestUrl: string) => {
  clearAndRedirectSession(requestUrl);
};

export default api;
