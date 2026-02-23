/**
 * API 엔드포인트 상수 정의
 */

export const API_BASE_URL = "/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    ADMIN_LOGIN: `${API_BASE_URL}/admin/auth/login`,
  },
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    ME: `${API_BASE_URL}/users/me`,
    PASSWORD: `${API_BASE_URL}/users/password`,
    ADDRESSES: `${API_BASE_URL}/users/me/addresses`,
    EMAIL_SEND: `${API_BASE_URL}/users/email/send`,
    EMAIL_VERIFY_RESULT: `${API_BASE_URL}/users/email/verify/result`,
  },
  PAYMENTS: {
    PREPARE: `${API_BASE_URL}/payments/request`,
    CONFIRM: `${API_BASE_URL}/payments/confirm`,
  },
  CARTS: {
    DEFAULT: `${API_BASE_URL}/carts`,
    ME: `${API_BASE_URL}/carts/me`,
  },
  RETURNS: {
    BASE: `${API_BASE_URL}/returns`,
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
  INTERNAL_USERS: {
    UUID: `${API_BASE_URL}/internal/users/uuid`,
  },
  INTERNAL_DEPOSITS: {
    CHARGE: (userUuid: string) => `${API_BASE_URL}/internal/deposits/${userUuid}/charge`,
  },
  ADMIN_COUPONS: {
    BASE: `${API_BASE_URL}/admin/coupons`,
    ISSUE_TO_USER: (couponUuid: string) => `${API_BASE_URL}/admin/coupons/${couponUuid}/issue`,
  },
  ADMIN_ORDERS: {
    BASE: `${API_BASE_URL}/admin/orders`,
    UPDATE_STATUS: (orderUuid: string) => `${API_BASE_URL}/admin/orders/${orderUuid}/status`,
  },
  ADMIN_PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    USER_BY_PRODUCT: (productUuid: string) => `${API_BASE_URL}/admin/products/${productUuid}/user`,
  },
  ADMIN_USERS: {
    BASE: `${API_BASE_URL}/admin/users`,
  },
  ADMIN_SETTLEMENTS: {
    BASE: `${API_BASE_URL}/admin/settlements`,
    LEGACY_BASE: '/admin/settlements',
  },
} as const;
