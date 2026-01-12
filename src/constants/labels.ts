/**
 * UI 라벨 및 공통 메시지 상수
 */

import type { SaleStatus, ConditionStatus } from '@/types/product';

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  ON_SALE: '판매중',
  RESERVED: '예약중',
  SOLD_OUT: '판매완료',
  HIDDEN: '숨김',
  BLOCKED: '차단',
};

export const CONDITION_STATUS_LABELS: Record<ConditionStatus, string> = {
  SEALED: '미개봉',
  NO_WEAR: '사용감 없음',
  MINOR_WEAR: '사용감 적음',
  VISIBLE_WEAR: '사용감 많음',
  DAMAGED: '하자 있음',
};

export const CONFIRM_MESSAGES = {
  DELETE_CATEGORY: '이 카테고리를 삭제하시겠습니까?',
  DELETE_PRODUCT: '정말 삭제하시겠습니까?',
  CANCEL_EDIT: '수정을 취소하시겠습니까?',
} as const;

export const ERROR_MESSAGES = {
  CATEGORY_DEPTH_LIMIT: '카테고리는 최대 3단계(대 > 중 > 소)까지만 생성이 가능합니다.',
  PRODUCT_NOT_FOUND: '상품을 찾을 수 없습니다.',
} as const;

export const TOAST_MESSAGES = {
  ADDED_TO_LIKES: '찜한 상품에 추가되었습니다.',
  REMOVED_FROM_LIKES: '찜한 상품에서 제거되었습니다.',
  ADDED_TO_CART: '장바구니에 담았습니다.',
  ALREADY_IN_CART: '이미 장바구니에 담긴 상품입니다.',
  MOVING_TO_PAYMENT: '안전결제 페이지로 이동합니다.',
} as const;
