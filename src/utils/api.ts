import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Use Vite environment variables (must start with VITE_)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject Authorization header
api.interceptors.request.use((config) => {
  const { accessToken, logout } = useAuthStore.getState();

  if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
    const token = accessToken.trim();
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers.Authorization = authHeader;
  } else if (accessToken) {
    // If token is invalid string value, clear the session
    console.error(`[API Request] Invalid token detected: ${accessToken}`);
    logout();
  }

  return config;
});

// Response interceptor: handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized: force logout
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url || '');
      const isPaymentFlowRequest =
        requestUrl.includes('/payments/request') ||
        requestUrl.includes('/payments/confirm');

      // In payment flow, do not force global logout; handle at caller level.
      if (isPaymentFlowRequest) {
        return Promise.reject(error);
      }

      const { logout, accessToken } = useAuthStore.getState();

      console.error(`[API 401 Unauthorized] URL: ${requestUrl || 'unknown'}`);
      console.error(`[API 401 Unauthorized] Current Token: ${accessToken?.substring(0, 15)}...`);
      console.error('[API 401 Unauthorized] Response Data:', error.response?.data);

      // Clear session
      logout();

      // Redirect to login unless already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = `/login?error=expired&returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
