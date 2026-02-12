/**
 * API 엔드포인트 상수 정의
 */

export const API_BASE_URL = "/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    ME: `${API_BASE_URL}/users/me`,
    PASSWORD: `${API_BASE_URL}/users/password`,
    ADDRESSES: `${API_BASE_URL}/users/me/addresses`,
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
    ME_LIKES: `${API_BASE_URL}/products/likes/me`,
  },
  SHOPS: {
    BASE: `${API_BASE_URL}/shops`,
    ME: `${API_BASE_URL}/shops/me`,
  },
  SELLERS: {
    BASE: `${API_BASE_URL}/sellers`,
    ME_FOLLOWING: `${API_BASE_URL}/sellers/me/following`,
  },
  REVIEWS: {
    BASE: `${API_BASE_URL}`,
  },
  DEPOSITS: {
    BALANCE: `${API_BASE_URL}/deposits/me/balance`,
    HISTORIES: `${API_BASE_URL}/deposits/me/histories`,
  },
  COUPONS: {
    BASE: `${API_BASE_URL}/coupons`,
    ME: `${API_BASE_URL}/coupons/me`,
    ISSUABLE: `${API_BASE_URL}/coupons/issuable`,
  },
  ADMIN_COUPONS: {
    BASE: `${API_BASE_URL}/admin/coupons`,
  },
} as const;
