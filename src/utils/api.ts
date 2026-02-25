import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Vite 환경변수 사용 (VITE_ 접두사 필수)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: Authorization 헤더 주입
api.interceptors.request.use((config) => {
  const { accessToken, logout } = useAuthStore.getState();
  
  if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
    const token = accessToken.trim();
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers.Authorization = authHeader;
    // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} | Auth: ${authHeader.substring(0, 15)}...`);
  } else if (accessToken) {
    // 토큰이 'undefined' 문자열이거나 비정상적인 경우 세션 정리
    console.error(`[API Request] Invalid token detected: ${accessToken}`);
    logout();
  }
  
  return config;
});

// 응답 인터셉터: 401 오류 처리 (토큰 만료 등)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 시 세션 종료
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url || '');
      const isPaymentFlowRequest =
        requestUrl.includes('/payments/request') ||
        requestUrl.includes('/payments/confirm');

      // 결제 단계의 401은 전역 로그아웃으로 끊지 않고 호출부에서 처리한다.
      if (isPaymentFlowRequest) {
        return Promise.reject(error);
      }

      const { logout, accessToken } = useAuthStore.getState();
      
      console.error(`[API 401 Unauthorized] URL: ${requestUrl || 'unknown'}`);
      console.error(`[API 401 Unauthorized] Current Token: ${accessToken?.substring(0, 15)}...`);
      console.error(`[API 401 Unauthorized] Response Data:`, error.response?.data);
      
      // 세션 종료 처리
      logout();
      
      // 로그인 페이지가 아닌 경우 로그인 페이지로 리다이렉트
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = `/login?error=expired&returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
