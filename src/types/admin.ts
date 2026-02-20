import type { OrderListResponse, PageResponse } from './order';
import type { ProductListItem, ProductListResponse } from './product';

export type AdminSettlementStatus = 'CREATED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface AdminSettlementDetailResponse {
  settlementUuid: string;
  status: AdminSettlementStatus;
  sellerUuid: string;
  sellerNickname: string;
  productName: string;
  totalAmount: number;
  fee: number | string;
  feeAmount: number;
  settlementAmount: number;
  settlementReservationDate: string;
  orderUuid: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSettlementStatisticsResponse {
  totalCount: number;
  totalAmount: number;
  totalSettlementAmount: number;
  totalFeeAmount: number;
  createdCount: number;
  processingCount: number;
  pendingCount: number;
  successCount: number;
  failedCount: number;
  createdAmount: number;
  processingAmount: number;
  pendingAmount: number;
  successAmount: number;
  failedAmount: number;
  completedCountInPeriod: number;
  completedAmountInPeriod: number;
}

export interface AdminSettlementSearchParams {
  status?: AdminSettlementStatus;
  sellerUuid?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface AdminSettlementStatisticsParams {
  status?: AdminSettlementStatus;
  sellerUuid?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserAdminProfileResponse {
  userUuid: string;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminProductListItem extends ProductListItem {
  sellerNickname: string;
  sellerUserUuid: string;
}

export interface AdminProductListResponse extends ProductListResponse {
  items: AdminProductListItem[];
}

export type AdminOrderPageResponse = PageResponse<OrderListResponse>;
