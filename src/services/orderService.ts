import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { 
  OrderCreateRequest, 
  OrderResponse, 
  OrderListResponse, 
  PageResponse,
  UpdateShippingInfoRequest,
  DeliveryInfoRequest,
  OrderItemStatus
} from '../types/order';

export const orderService = {
  /**
   * 주문 생성
   */
  createOrder: async (request: OrderCreateRequest): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>(API_ENDPOINTS.ORDERS.DEFAULT, request);
    return response.data;
  },

  /**
   * 내 주문 목록 조회
   */
  getMyOrders: async (page = 0, size = 10): Promise<PageResponse<OrderListResponse>> => {
    const response = await api.get<PageResponse<OrderListResponse>>(API_ENDPOINTS.ORDERS.ME, {
        params: { page, size }
    });
    return response.data;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (orderUuid: string): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`${API_ENDPOINTS.ORDERS.DEFAULT}/${orderUuid}`);
    return response.data;
  },

  /**
   * 주문 배송지 정보 수정
   */
  updateShippingInfo: async (orderUuid: string, data: UpdateShippingInfoRequest): Promise<void> => {
    await api.put(`${API_ENDPOINTS.ORDERS.DEFAULT}/${orderUuid}/shipping-info`, data);
  },

  /**
   * 주문 아이템 배송 정보 수정 (판매자용)
   */
  updateDeliveryInfo: async (orderItemUuid: string, data: DeliveryInfoRequest): Promise<void> => {
    await api.put(`${API_ENDPOINTS.ORDERS.DEFAULT}/items/${orderItemUuid}/delivery-info`, data);
  },

  /**
   * 주문 아이템 상태 변경
   */
  updateOrderItemStatus: async (orderItemUuid: string, status: OrderItemStatus): Promise<void> => {
    await api.put(`${API_ENDPOINTS.ORDERS.DEFAULT}/items/${orderItemUuid}/status`, null, {
      params: { status }
    });
  }
};
