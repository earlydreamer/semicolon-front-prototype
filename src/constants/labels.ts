/**
 * UI 라벨 및 공통 메시지 상수
 */

import type { SaleStatus, ConditionStatus } from '@/types/product';
import type { OrderStatus } from '@/types/user';

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  ON_SALE: '판매중',
  RESERVED: '예약중',
  SOLD_OUT: '판매완료',
};

export const VISIBILITY_STATUS_LABELS: Record<string, string> = {
  VISIBLE: '공개',
  HIDDEN: '숨김',
  BLOCKED: '차단',
};

export const SALE_STATUS_COLORS: Record<SaleStatus, string> = {
  ON_SALE: 'bg-green-100 text-green-700',
  RESERVED: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-neutral-200 text-neutral-500',
};

export const VISIBILITY_STATUS_COLORS: Record<string, string> = {
  VISIBLE: 'bg-blue-100 text-blue-700',
  HIDDEN: 'bg-neutral-100 text-neutral-500',
  BLOCKED: 'bg-red-100 text-red-700',
};

export const CONDITION_STATUS_LABELS: Record<ConditionStatus, string> = {
  SEALED: '미개봉',
  NO_WEAR: '사용감 없음',
  MINOR_WEAR: '사용감 적음',
  VISIBLE_WEAR: '사용감 많음',
  DAMAGED: '하자 있음',
};

/**
 * 판매상태 도움말 설명
 */
export const SALE_STATUS_DESCRIPTIONS: Record<SaleStatus, string> = {
  ON_SALE: '현재 구매 가능한 상품입니다.',
  RESERVED: '다른 구매자가 결제를 진행 중인 상품입니다. 구매 확정 전까지는 거래가 취소될 수 있습니다.',
  SOLD_OUT: '이미 판매가 완료된 상품입니다.',
};

export const VISIBILITY_STATUS_DESCRIPTIONS: Record<string, string> = {
  VISIBLE: '모든 사용자에게 보이는 상품입니다.',
  HIDDEN: '판매자가 일시적으로 숨긴 상품입니다.',
  BLOCKED: '정책 위반으로 차단된 상품입니다.',
};

/**
 * 상품 상태(컨디션) 도움말 설명
 */
export const CONDITION_STATUS_DESCRIPTIONS: Record<ConditionStatus, string> = {
  SEALED: '포장이 개봉되지 않은 새 제품입니다.',
  NO_WEAR: '사용 흔적이 없는 깨끗한 상태입니다.',
  MINOR_WEAR: '약간의 사용감이 있으나 기능에 문제없습니다.',
  VISIBLE_WEAR: '눈에 띄는 사용 흔적이 있습니다.',
  DAMAGED: '부분적인 파손이나 기능 이상이 있습니다.',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, { text: string; className: string }> = {
  PENDING: { text: '결제 대기', className: 'bg-yellow-100 text-yellow-700' },
  PAID: { text: '결제 완료', className: 'bg-blue-100 text-blue-700' },
  PAYMENT_FAILED: { text: '결제 실패', className: 'bg-red-100 text-red-700' },
  CANCELED: { text: '취소됨', className: 'bg-red-100 text-red-700' },
  PARTIAL_REFUNDED: { text: '부분 환불됨', className: 'bg-orange-100 text-orange-600' },
};

export const ORDER_ITEM_STATUS_LABELS: Record<string, { text: string; className: string }> = {
  PAYMENT_COMPLETED: { text: '결제 완료', className: 'bg-blue-100 text-blue-700' },
  PREPARING_SHIPMENT: { text: '배송 준비 중', className: 'bg-purple-100 text-purple-700' },
  SHIPPED: { text: '배송 중', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { text: '배송 완료', className: 'bg-green-100 text-green-700' },
  CONFIRM_PENDING: { text: '구매 확정 대기', className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { text: '구매 확정', className: 'bg-neutral-100 text-neutral-700' },
  CANCEL_REQUESTED: { text: '취소 요청', className: 'bg-orange-100 text-orange-700' },
  CANCEL_IN_PROGRESS: { text: '취소 처리 중', className: 'bg-orange-100 text-orange-700' },
  CANCELED: { text: '취소 완료', className: 'bg-red-100 text-red-700' },
  REFUND_REQUESTED: { text: '환불 요청', className: 'bg-orange-100 text-orange-700' },
  REFUND_IN_PROGRESS: { text: '환불 진행 중', className: 'bg-orange-100 text-orange-700' },
  REFUND_COMPLETED: { text: '환불 완료', className: 'bg-orange-100 text-orange-700' },
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
  RESERVED_PRODUCT: '예약중인 상품은 장바구니에 담을 수 없습니다.',
  MOVING_TO_PAYMENT: '안전결제 페이지로 이동합니다.',
} as const;
