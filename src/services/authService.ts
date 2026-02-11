import api from '../utils/api';
import type { 
  LoginRequest, 
  TokenResponse, 
  User, 
  UserRegisterRequest, 
  UserUpdateRequest,
  PasswordUpdateRequest 
} from '../types/auth';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN, request);
    return response.data;
  },

  /**
   * 회원가입
   */
  register: async (request: UserRegisterRequest): Promise<User> => {
    const response = await api.post<User>(API_ENDPOINTS.USERS.REGISTER, request);
    return response.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USERS.ME);
    return response.data;
  },

  /**
   * 내 정보 수정
   */
  updateMe: async (request: UserUpdateRequest): Promise<User> => {
    const response = await api.put<User>(API_ENDPOINTS.USERS.ME, request);
    return response.data;
  },
  
  /**
   * 비밀번호 변경
   */
    updatePassword: async (request: PasswordUpdateRequest): Promise<void> => {
    await api.put(API_ENDPOINTS.USERS.PASSWORD, request);
  },
};
