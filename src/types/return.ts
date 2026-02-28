export interface ReturnRequestCreateDto {
  reason: string;
  orderItemUuids: string[];
}

export interface ReturnTrackingRegisterDto {
  carrierName: string;
  carrierCode: string;
  trackingNumber: string;
}

export interface ReturnRejectDto {
  reason: string;
}

export type ReturnStatus =
  | 'RETURN_REQUESTED'
  | 'RETURN_SELLER_APPROVED'
  | 'RETURN_SHIPPED'
  | 'RETURN_RECEIVED'
  | 'RETURN_APPROVED'
  | 'RETURN_COMPLETED'
  | 'RETURN_REJECTED_BEFORE_SHIPMENT'
  | 'RETURN_REJECTED_AFTER_SHIPMENT'
  | 'RETURN_REJECTED';

export interface ReturnResponse {
  returnRequestUuid: string;
  orderUuid: string;
  status: ReturnStatus;
  reason: string;
  rejectionReason?: string;
  carrierName?: string;
  carrierCode?: string;
  trackingNumber?: string;
  createdAt: string;
  returnItems: ReturnItemResponse[];
}

export interface ReturnItemResponse {
  returnItemUuid: string;
  orderItemUuid: string;
  refundAmount: number;
}

export interface SellerReturnResponse {
  returnRequestUuid: string;
  orderUuid: string;
  status: ReturnStatus;
  reason: string;
  rejectionReason?: string;
  carrierName?: string;
  trackingNumber?: string;
  createdAt: string;
  returnItems: SellerReturnItemSummary[];
}

export interface SellerReturnItemSummary {
  orderItemUuid: string;
  productUuid: string;
  productName: string;
  imageUrl?: string;
  refundAmount: number;
}
