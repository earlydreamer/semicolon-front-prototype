import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { SafeImage } from "@/components/common/SafeImage";
import { useToast } from "@/components/common/Toast";
import { ReturnActionModal } from "./ReturnActionModal";
import { orderService } from "@/services/orderService";
import { returnService } from "@/services/returnService";
import type { OrderItemStatus } from "@/types/order";
import type { ReturnStatus, SellerReturnResponse } from "@/types/return";
import { parseHttpError } from "@/utils/httpError";

const STATUS_LABELS: Record<ReturnStatus, { text: string; color: string }> = {
  RETURN_REQUESTED: { text: "반품 요청됨", color: "bg-yellow-100 text-yellow-800" },
  RETURN_SELLER_APPROVED: { text: "1차 승인(발송 대기)", color: "bg-blue-100 text-blue-800" },
  RETURN_SHIPPED: { text: "반품 발송됨", color: "bg-purple-100 text-purple-800" },
  RETURN_RECEIVED: { text: "반송품 수령 확인", color: "bg-indigo-100 text-indigo-800" },
  RETURN_APPROVED: { text: "환불 승인됨", color: "bg-green-100 text-green-800" },
  RETURN_COMPLETED: { text: "반품 완료", color: "bg-green-100 text-green-800" },
  RETURN_REJECTED_BEFORE_SHIPMENT: { text: "1차 거절됨", color: "bg-red-100 text-red-800" },
  RETURN_REJECTED_AFTER_SHIPMENT: { text: "환불 거절됨", color: "bg-red-100 text-red-800" },
  RETURN_REJECTED: { text: "반품 거절됨", color: "bg-red-100 text-red-800" },
};

export const SellerReturnManagement = () => {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<SellerReturnResponse[]>([]);
  const [orderItemImageMap, setOrderItemImageMap] = useState<Record<string, string>>({});
  const [orderItemStatusMap, setOrderItemStatusMap] = useState<Record<string, OrderItemStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [syncingReturnRequestUuid, setSyncingReturnRequestUuid] = useState<string | null>(null);
  const [receivingReturnRequestUuid, setReceivingReturnRequestUuid] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: "approve" | "reject";
    requireReason: boolean;
    onSubmit: (reason?: string) => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionType: "approve",
    requireReason: false,
    onSubmit: async () => {},
  });

  const fetchReturns = useCallback(
    (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      return Promise.all([returnService.getSellerReturns(), orderService.getSellerOrderItems()])
        .then(([returnList, sellerOrderItems]) => {
          setReturns(returnList);
          const imageMap: Record<string, string> = {};
          const statusMap: Record<string, OrderItemStatus> = {};

          sellerOrderItems.forEach((item) => {
            if (item.imageUrl) {
              imageMap[item.orderItemUuid] = item.imageUrl;
            }
            statusMap[item.orderItemUuid] = item.itemStatus;
          });

          setOrderItemImageMap(imageMap);
          setOrderItemStatusMap(statusMap);
        })
        .catch((error) => showToast(parseHttpError(error, "반품 목록을 불러오지 못했어요."), "error"))
        .finally(() => setIsLoading(false));
    },
    [showToast],
  );

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const syncSellerApprovedReturn = async (ret: SellerReturnResponse) => {
    try {
      setSyncingReturnRequestUuid(ret.returnRequestUuid);
      await returnService.approveBySeller(ret.returnRequestUuid);
      showToast("상태 동기화를 완료했어요.", "success");
      await fetchReturns(false);
    } catch (error) {
      showToast(parseHttpError(error, "상태 동기화에 실패했어요."), "error");
    } finally {
      setSyncingReturnRequestUuid(null);
    }
  };

  const receiveReturnBySeller = async (ret: SellerReturnResponse) => {
    try {
      setReceivingReturnRequestUuid(ret.returnRequestUuid);
      await returnService.receiveBySeller(ret.returnRequestUuid);
      showToast("반송품 수령 확인이 완료됐어요.", "success");
      await fetchReturns(false);
    } catch (error) {
      showToast(parseHttpError(error, "반송품 수령 확인에 실패했어요."), "error");
    } finally {
      setReceivingReturnRequestUuid(null);
    }
  };

  const openApproveModal = (ret: SellerReturnResponse) => {
    const isFirstApprove = ret.status === "RETURN_REQUESTED";
    const isFinalApprove = ret.status === "RETURN_RECEIVED";
    if (!isFirstApprove && !isFinalApprove) return;

    setModalConfig({
      isOpen: true,
      title: isFirstApprove ? "반품 1차 승인" : "환불 최종 승인",
      description: isFirstApprove
        ? "반품 요청을 승인하시겠어요? 구매자가 반품 운송장을 등록할 수 있게 됩니다."
        : "구매자 반송 물품 확인 후 환불을 최종 승인합니다.",
      actionType: "approve",
      requireReason: false,
      onSubmit: async () => {
        if (isFirstApprove) {
          await returnService.approveBySeller(ret.returnRequestUuid);
          showToast("반품 1차 승인을 완료했어요.", "success");
        } else {
          await returnService.approveReturn(ret.returnRequestUuid);
          showToast("환불 최종 승인을 완료했어요.", "success");
        }
        await fetchReturns(false);
      },
    });
  };

  const openRejectModal = (ret: SellerReturnResponse) => {
    const isFirstReject = ret.status === "RETURN_REQUESTED" || ret.status === "RETURN_SELLER_APPROVED";
    const isFinalReject = ret.status === "RETURN_RECEIVED";
    if (!isFirstReject && !isFinalReject) return;

    setModalConfig({
      isOpen: true,
      title: isFirstReject ? "반품 1차 거절" : "환불 최종 거절",
      description: isFirstReject
        ? "반품 요청을 거절합니다. 거절 사유를 반드시 입력해 주세요."
        : "반송 물품 확인 후 환불을 거절합니다. 거절 사유를 입력해 주세요.",
      actionType: "reject",
      requireReason: true,
      onSubmit: async (reason) => {
        if (isFirstReject) {
          await returnService.rejectBySeller(ret.returnRequestUuid, { reason: reason || "" });
          showToast("반품 1차 거절을 완료했어요.", "success");
        } else {
          await returnService.rejectFinalReturn(ret.returnRequestUuid, { reason: reason || "" });
          showToast("환불 최종 거절을 완료했어요.", "success");
        }
        await fetchReturns(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">반품/환불 관리</h2>
        <span className="text-sm text-neutral-500">총 {returns.length}건</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          {returns.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-8">진행 중인 반품 요청이 없습니다.</p>
          ) : (
            returns.map((ret) => {
              const statusInfo = STATUS_LABELS[ret.status] ?? {
                text: ret.status,
                color: "bg-neutral-100 text-neutral-600",
              };
              const representativeItem = ret.returnItems[0];
              const representativeImageUrl =
                representativeItem &&
                representativeItem.imageUrl &&
                representativeItem.imageUrl !== "null" &&
                representativeItem.imageUrl !== "undefined"
                  ? representativeItem.imageUrl
                  : representativeItem
                    ? orderItemImageMap[representativeItem.orderItemUuid]
                    : undefined;
              const needsStatusSync =
                ret.status === "RETURN_SELLER_APPROVED" &&
                ret.returnItems.some(
                  (item) => orderItemStatusMap[item.orderItemUuid] !== "REFUND_IN_PROGRESS",
                );

              return (
                <div key={ret.returnRequestUuid} className="border border-neutral-200 rounded-xl p-4 space-y-3">
                  <section className="rounded-lg border border-neutral-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-neutral-500">주문 정보</p>
                    <div className="space-y-2">
                      {representativeItem && (
                        <div className="flex items-center gap-2">
                          <SafeImage
                            src={representativeImageUrl}
                            alt={representativeItem.productName}
                            className="h-10 w-10 rounded object-cover bg-neutral-100"
                          />
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {representativeItem.productName}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        <span className="text-xs text-neutral-500">{ret.createdAt?.slice(0, 10)}</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        <span className="font-medium text-neutral-700 mr-1">주문번호</span>
                        <span className="font-mono break-all">{ret.orderUuid}</span>
                      </p>
                    </div>
                  </section>

                  <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-neutral-500">반품 정보</p>
                    <div className="space-y-1">
                      {ret.returnItems.map((item) => (
                        <div key={item.orderItemUuid} className="flex justify-between text-sm">
                          <span className="font-medium text-neutral-900 truncate flex-1">{item.productName}</span>
                          <span className="text-neutral-500 ml-2 shrink-0">
                            환불 {item.refundAmount.toLocaleString()}원
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded bg-white p-3 text-sm text-neutral-700">
                      <span className="font-semibold text-neutral-900 mr-2">반품 사유:</span>
                      {ret.reason}
                    </div>
                    {ret.trackingNumber && (
                      <div className="mt-2 rounded bg-purple-50 p-2 text-xs text-purple-700">
                        반품 택배: {ret.carrierName} {ret.trackingNumber}
                      </div>
                    )}
                  </section>

                  <div className="flex justify-end gap-2 mt-3">
                    {needsStatusSync && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncSellerApprovedReturn(ret)}
                        disabled={syncingReturnRequestUuid === ret.returnRequestUuid}
                      >
                        상태 동기화
                      </Button>
                    )}
                    {(ret.status === "RETURN_REQUESTED" || ret.status === "RETURN_SELLER_APPROVED") && (
                      <Button size="sm" variant="outline" onClick={() => openRejectModal(ret)}>
                        거절
                      </Button>
                    )}
                    {ret.status === "RETURN_REQUESTED" && (
                      <Button size="sm" onClick={() => openApproveModal(ret)}>
                        승인
                      </Button>
                    )}
                    {ret.status === "RETURN_SHIPPED" && (
                      <Button
                        size="sm"
                        onClick={() => receiveReturnBySeller(ret)}
                        disabled={receivingReturnRequestUuid === ret.returnRequestUuid}
                      >
                        {receivingReturnRequestUuid === ret.returnRequestUuid ? "처리 중..." : "수령 확인"}
                      </Button>
                    )}
                    {ret.status === "RETURN_RECEIVED" && (
                      <Button size="sm" onClick={() => openApproveModal(ret)}>
                        환불 승인
                      </Button>
                    )}
                  </div>
                  {ret.status === "RETURN_SHIPPED" && (
                    <p className="text-right text-xs text-neutral-500">
                      반송품 수령 확인 후 최종 처리할 수 있어요.
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <ReturnActionModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        actionType={modalConfig.actionType}
        requireReason={modalConfig.requireReason}
        onSubmit={async (reason) => {
          try {
            await modalConfig.onSubmit(reason);
          } catch (error) {
            showToast(parseHttpError(error, "반품 처리에 실패했어요."), "error");
            throw error;
          }
        }}
      />
    </div>
  );
};
