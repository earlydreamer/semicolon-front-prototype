/**
 * 판매자 주문 목록 + 운송장 입력/수정 컴포넌트
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
import {
  openNaverTrackingSearch,
  sanitizeTrackingNumber,
  validateTrackingNumber,
} from "@/utils/shippingTracking";

// 판매자가 운송장을 입력/수정할 수 있는 상태
const SHIPPABLE_STATUSES: OrderItemStatus[] = [
  "PAYMENT_COMPLETED",
  "PREPARING_SHIPMENT",
];

// 판매자가 수동으로 변경할 수 있는 상태 전이
const STATUS_TRANSITIONS: Partial<
  Record<OrderItemStatus, { label: string; next: OrderItemStatus }>
> = {
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
  { name: "GS25 편의점택배", code: "gs25" },
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
      .catch(() => showToast("판매 주문 목록을 불러오지 못했어요.", "error"))
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
      showToast("상태를 변경했어요.", "success");
      fetchItems();
    } catch {
      showToast("상태 변경에 실패했어요.", "error");
    }
  };

  const handleDeliverySubmit = async (orderItemUuid: string) => {
    if (!deliveryForm.carrierName || !deliveryForm.trackingNumber) {
      showToast("택배사와 운송장 번호를 입력해 주세요.", "error");
      return;
    }

    const validation = validateTrackingNumber(
      deliveryForm.carrierCode,
      deliveryForm.carrierName,
      deliveryForm.trackingNumber,
    );
    if (!validation.valid) {
      showToast(validation.hint, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const req: DeliveryInfoRequest = {
        carrierName: deliveryForm.carrierName,
        carrierCode: deliveryForm.carrierCode,
        trackingNumber: sanitizeTrackingNumber(deliveryForm.trackingNumber),
      };
      await orderService.updateDeliveryInfo(orderItemUuid, req);
      showToast("운송장을 저장했어요.", "success");
      setOpenDeliveryForm(null);
      setDeliveryForm({ carrierName: "", carrierCode: "", trackingNumber: "" });
      fetchItems();
    } catch {
      showToast("운송장 저장에 실패했어요.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">판매 주문 관리</h2>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">판매 주문 관리</h2>

      {items.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-8">판매 주문이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const rawStatus = (item.itemStatus as unknown as string) || "";
            const normalizedStatus = (
              rawStatus && rawStatus in ORDER_ITEM_STATUS_LABELS
                ? rawStatus
                : "PAYMENT_COMPLETED"
            ) as OrderItemStatus;

            const statusInfo = ORDER_ITEM_STATUS_LABELS[normalizedStatus] ?? {
              text: item.itemStatus,
              className: "bg-neutral-100 text-neutral-600",
            };
            const transition = STATUS_TRANSITIONS[normalizedStatus];
            const canInputDelivery = SHIPPABLE_STATUSES.includes(normalizedStatus);
            const isFormOpen = openDeliveryForm === item.orderItemUuid;
            const trackingValidation = validateTrackingNumber(
              item.carrierCode,
              item.carrierName,
              item.trackingNumber,
            );

            return (
              <div
                key={item.orderItemUuid}
                className="border border-neutral-200 rounded-xl p-4 space-y-3"
              >
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
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600 space-y-1.5">
                  <p className="text-neutral-500">{item.orderedAt?.slice(0, 10)} 주문</p>
                  <p className="flex items-start gap-2">
                    <span className="font-medium text-neutral-700 shrink-0">주문번호</span>
                    <span className="font-mono text-[11px] leading-relaxed break-all">
                      {item.orderUuid}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">수령인:</span>{" "}
                    {item.recipient} ({item.contactNumber})
                  </p>
                  <p>
                    <span className="font-medium">배송지:</span> {item.buyerAddress}
                  </p>
                </div>

                {item.trackingNumber && (
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 flex items-center justify-between">
                    <span>
                      <span className="font-medium">{item.carrierName}</span>{" "}
                      {item.trackingNumber}
                      {!trackingValidation.valid && (
                        <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-600">
                          유효하지 않은 운송장
                        </span>
                      )}
                    </span>
                    <button
                      className="text-blue-500 hover:underline disabled:text-neutral-400 disabled:no-underline"
                      disabled={!trackingValidation.valid}
                      onClick={() => {
                        const result = openNaverTrackingSearch(
                          item.carrierName,
                          item.trackingNumber,
                          item.carrierCode,
                        );
                        if (!result.opened) {
                          showToast(result.hint, "error");
                        }
                      }}
                    >
                      조회
                    </button>
                  </div>
                )}

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
                      {normalizedStatus === "PREPARING_SHIPMENT"
                        ? "운송장 수정"
                        : "운송장 입력"}
                    </Button>
                  )}
                </div>

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
                        {isSubmitting ? "저장 중..." : "저장"}
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

