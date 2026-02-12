export interface User {
  userUuid: string;
  id: string; // userUuid와 동일한 값 (프론트엔드 호환성용)
  email: string;
  nickname: string;
  intro?: string;
  avatar?: string;
  phone?: string;
  deposit?: number;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'WITHDRAWN'; // UserStatus Enum 반영
  createdAt: string; // 가입일
}

export interface TokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string; // 백엔드 DTO: email
  password: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface UserUpdateRequest {
  name: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}
