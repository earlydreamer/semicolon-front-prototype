export interface OrderItemCreateRequest {
  productUuid: string;
  sellerUuid: string;
  productName: string;
  productPrice: number;
  imageUrl: string;
}

export interface OrderCreateRequest {
  address: string;
  recipient: string;
  contactNumber: string;
  items: OrderItemCreateRequest[];
}

export interface UpdateShippingInfoRequest {
  address: string;
  recipient: string;
  contactNumber: string;
}

export interface DeliveryInfoRequest {
  carrierName: string;
  carrierCode: string;
  trackingNumber: string;
}

export type OrderItemStatus = 'READY' | 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CONFIRMED' | 'CANCELED';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'PARTIAL_REFUNDED' | 'REFUNDED';

export interface OrderItemResponse {
  productUuid: string;
  productName: string;
  productPrice: number;
  imageUrl: string;
  itemStatus: OrderItemStatus;
  carrierName?: string;
  trackingNumber?: string;
}

export interface OrderResponse {
  orderUuid: string;
  userUuid: string;
  totalAmount: number;
  refundedAmount: number;
  orderStatus: OrderStatus;
  orderedAt: string;
  recipient: string;
  contactNumber: string;
  address: string;
  items: OrderItemResponse[];
}

export interface OrderListResponse {
  orderUuid: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: {
    productUuid: string;
    productName: string;
    productPrice: number;
    imageUrl: string;
    itemStatus: OrderItemStatus;
  }[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
