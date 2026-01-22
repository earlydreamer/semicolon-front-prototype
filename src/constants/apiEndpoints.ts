/**
 * API 엔드포인트 상수 정의
 */

export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  PAYMENTS: {
    PREPARE: `${API_BASE_URL}/payments/request`,
    CONFIRM: `${API_BASE_URL}/payments/confirm`,
  },
} as const;
