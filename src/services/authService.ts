import api from '../utils/api';
import type { 
  LoginRequest, 
  TokenResponse, 
  User, 
  UserRegisterRequest, 
  UserUpdateRequest,
  PasswordUpdateRequest,
  EmailVerificationResult,
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
   * 관리자 로그인
   */
  loginAdmin: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>(API_ENDPOINTS.AUTH.ADMIN_LOGIN, request);
    return response.data;
  },

  /**
   * 회원가입
   */
  register: async (request: UserRegisterRequest): Promise<User> => {
    const idempotencyKey = crypto.randomUUID();
    const response = await api.post<User>(
      API_ENDPOINTS.USERS.REGISTER,
      request,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      },
    );
    return response.data;
  },

  sendVerificationEmail: async (email: string): Promise<void> => {
    await api.post(API_ENDPOINTS.USERS.EMAIL_SEND, { email });
  },

  verifyEmailResult: async (resultToken: string): Promise<EmailVerificationResult> => {
    const response = await api.post<EmailVerificationResult>(
      API_ENDPOINTS.USERS.EMAIL_VERIFY_RESULT,
      { resultToken },
    );
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
