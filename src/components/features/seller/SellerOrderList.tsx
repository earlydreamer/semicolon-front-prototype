/**
 * 판매자 판매 주문 목록 + 운송장 입력 컴포넌트
 */

import { useEffect, useState, useCallback } from "react";
import { orderService } from "@/services/orderService";
import type {
  SellerOrderItemResponse,
  DeliveryInfoRequest,
  OrderItemStatus,
} from "@/types/order";
import { ORDER_ITEM_STATUS_LABELS } from "@/constants/labels";
import { formatPrice } from "@/utils/formatPrice";
import { useToast } from "@/components/common/Toast";
import { Button } from "@/components/common/Button";

// 판매자가 운송장을 입력할 수 있는 상태
const SHIPPABLE_STATUSES: OrderItemStatus[] = [
  "PAYMENT_COMPLETED",
  "PREPARING_SHIPMENT",
];

// 판매자가 상태를 변경할 수 있는 상태 목록
const STATUS_TRANSITIONS: Partial<
  Record<OrderItemStatus, { label: string; next: OrderItemStatus }>
> = {
  PAYMENT_COMPLETED: { label: "배송 준비 시작", next: "PREPARING_SHIPMENT" },
  PREPARING_SHIPMENT: { label: "배송 시작", next: "SHIPPED" },
};

interface DeliveryFormState {
  carrierName: string;
  carrierCode: string;
  trackingNumber: string;
}

const CARRIER_OPTIONS = [
  { name: "CJ대한통운", code: "cj" },
  { name: "한진택배", code: "hanjin" },
  { name: "롯데택배", code: "lotte" },
  { name: "우체국택배", code: "epost" },
  { name: "GS25편의점택배", code: "gs25" },
];

export default function SellerOrderList() {
  const { showToast } = useToast();
  const [items, setItems] = useState<SellerOrderItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeliveryForm, setOpenDeliveryForm] = useState<string | null>(null); // orderItemUuid
  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormState>({
    carrierName: "",
    carrierCode: "",
    trackingNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = useCallback(() => {
    setIsLoading(true);
    orderService
      .getSellerOrderItems()
      .then(setItems)
      .catch(() => showToast("판매 주문을 불러오는데 실패했습니다.", "error"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleStatusChange = async (
    orderItemUuid: string,
    nextStatus: OrderItemStatus,
  ) => {
    try {
      await orderService.updateOrderItemStatus(orderItemUuid, nextStatus);
      showToast("상태가 변경되었습니다.", "success");
      fetchItems();
    } catch {
      showToast("상태 변경에 실패했습니다.", "error");
    }
  };

  const handleDeliverySubmit = async (orderItemUuid: string) => {
    if (!deliveryForm.carrierName || !deliveryForm.trackingNumber) {
      showToast("택배사와 운송장 번호를 입력해주세요.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const req: DeliveryInfoRequest = {
        carrierName: deliveryForm.carrierName,
        carrierCode: deliveryForm.carrierCode,
        trackingNumber: deliveryForm.trackingNumber,
      };
      await orderService.updateDeliveryInfo(orderItemUuid, req);
      // 운송장 입력 시 자동으로 SHIPPED 상태로 변경
      await orderService.updateOrderItemStatus(orderItemUuid, "SHIPPED");
      showToast("운송장이 등록되었습니다.", "success");
      setOpenDeliveryForm(null);
      setDeliveryForm({ carrierName: "", carrierCode: "", trackingNumber: "" });
      fetchItems();
    } catch {
      showToast("운송장 등록에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          판매 주문 관리
        </h2>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        판매 주문 관리
      </h2>

      {items.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-8">
          판매 주문이 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const statusInfo = ORDER_ITEM_STATUS_LABELS[item.itemStatus] ?? {
              text: item.itemStatus,
              className: "bg-neutral-100 text-neutral-600",
            };
            const transition = STATUS_TRANSITIONS[item.itemStatus];
            const canInputDelivery = SHIPPABLE_STATUSES.includes(
              item.itemStatus,
            );
            const isFormOpen = openDeliveryForm === item.orderItemUuid;

            return (
              <div
                key={item.orderItemUuid}
                className="border border-neutral-200 rounded-xl p-4 space-y-3"
              >
                {/* 상품 정보 */}
                <div className="flex gap-3 items-start">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-neutral-100"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                        {item.productName}
                      </p>
                      <span
                        className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-neutral-900 mt-1">
                      {formatPrice(item.productPrice)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.orderedAt?.slice(0, 10)} 주문
                    </p>
                  </div>
                </div>

                {/* 배송지 정보 */}
                <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600 space-y-1">
                  <p>
                    <span className="font-medium">수령인:</span>{" "}
                    {item.recipient} ({item.contactNumber})
                  </p>
                  <p>
                    <span className="font-medium">배송지:</span>{" "}
                    {item.buyerAddress}
                  </p>
                </div>

                {/* 등록된 운송장 */}
                {item.trackingNumber && (
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 flex items-center justify-between">
                    <span>
                      <span className="font-medium">{item.carrierName}</span>{" "}
                      {item.trackingNumber}
                    </span>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        window.open(
                          `https://search.naver.com/search.naver?query=${encodeURIComponent(item.carrierName ?? "")}+${encodeURIComponent(item.trackingNumber ?? "")}`,
                          "_blank",
                        )
                      }
                    >
                      조회
                    </button>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2 flex-wrap">
                  {transition && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(item.orderItemUuid, transition.next)
                      }
                    >
                      {transition.label}
                    </Button>
                  )}
                  {canInputDelivery && !isFormOpen && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpenDeliveryForm(item.orderItemUuid);
                        setDeliveryForm({
                          carrierName: item.carrierName ?? "",
                          carrierCode: item.carrierCode ?? "",
                          trackingNumber: item.trackingNumber ?? "",
                        });
                      }}
                    >
                      운송장 입력
                    </Button>
                  )}
                </div>

                {/* 운송장 입력 폼 */}
                {isFormOpen && (
                  <div className="border-t border-neutral-100 pt-3 space-y-2">
                    <p className="text-xs font-medium text-neutral-700">
                      운송장 정보 입력
                    </p>
                    <select
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={deliveryForm.carrierCode}
                      onChange={(e) => {
                        const carrier = CARRIER_OPTIONS.find(
                          (c) => c.code === e.target.value,
                        );
                        setDeliveryForm((f) => ({
                          ...f,
                          carrierCode: e.target.value,
                          carrierName: carrier?.name ?? "",
                        }));
                      }}
                    >
                      <option value="">택배사 선택</option>
                      {CARRIER_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="운송장 번호"
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={deliveryForm.trackingNumber}
                      onChange={(e) =>
                        setDeliveryForm((f) => ({
                          ...f,
                          trackingNumber: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDeliverySubmit(item.orderItemUuid)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "등록 중..." : "등록 및 배송 시작"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenDeliveryForm(null)}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
