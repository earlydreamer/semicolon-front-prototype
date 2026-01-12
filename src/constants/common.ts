/**
 * 공통 비즈니스 로직 및 UI 관련 숫자 상수
 */

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
} as const;

export const TOAST = {
  DEFAULT_DURATION: 3000,
} as const;

export const CATEGORY = {
  MAX_DEPTH: 3,
} as const;

export const SHIPPING = {
  DEFAULT_FEE: 3000,
  FREE_THRESHOLD: 0,
} as const;

export const RATING = {
  MAX: 5.0,
} as const;
