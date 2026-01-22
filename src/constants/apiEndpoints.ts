/**
 * API 엔드포인트 상수 정의
 */

export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    ME: `${API_BASE_URL}/users/me`,
    PASSWORD: `${API_BASE_URL}/users/password`,
  },
  PAYMENTS: {
    PREPARE: `${API_BASE_URL}/payments/request`,
    CONFIRM: `${API_BASE_URL}/payments/confirm`,
  },
  CARTS: {
    DEFAULT: `${API_BASE_URL}/carts`,
    ME: `${API_BASE_URL}/carts/me`,
  },
  ORDERS: {
    DEFAULT: `${API_BASE_URL}/orders`,
    ME: `${API_BASE_URL}/orders/me`,
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    ME_LIKES: `${API_BASE_URL}/me/likes`,
  },
  DEPOSITS: {
    BALANCE: `${API_BASE_URL}/deposits/me/balance`,
    HISTORIES: `${API_BASE_URL}/deposits/me/histories`,
  },
} as const;
