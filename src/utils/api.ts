import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// TODO: 추후 환경변수로 분리
const BASE_URL = ''; // 프록시 설정을 따르거나 직접 주소 입력

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: Authorization 헤더 주입
api.interceptors.request.use((config) => {
  // Zustand store에서 직접 상태를 가져오는 것은 비동기 이슈가 있을 수 있으나
  // 현재 구조상 단순하게 접근 (localStorage 등 활용 가능)
  // useAuthStore.getState()로 현재 상태 확인
  const { user } = useAuthStore.getState();
  
  // 실제 연동 시에는 유저 객체에 토큰이 포함되어 있다고 가정
  // 현재 MockUser 타입에는 토큰이 없으므로 임시로 'mock-token' 처리하거나 
  // 백엔드 명세에 맞춰 accessToken 필드가 있다고 가정함
  const token = (user as any)?.accessToken || 'mock-token'; 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
