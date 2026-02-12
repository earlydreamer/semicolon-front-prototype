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
  // useAuthStore.getState()로 현재 상태 확인
  const { accessToken } = useAuthStore.getState();
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// 응답 인터셉터: 401 오류 처리 (토큰 만료 등)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 시 세션 종료
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      
      // 무한 루프 방지: 현재 경로가 로그인이 아닐 때만 로그아웃 처리 및 리다이렉트 고려
      logout();
      
      // 사용자 경험을 위해 강제 페이지 이동은 신중히 (필요 시 아래 주석 해제)
      // if (!window.location.pathname.includes('/login')) {
      //   window.location.href = '/login?expired=true';
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
