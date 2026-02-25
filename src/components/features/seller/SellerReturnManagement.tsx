import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { returnService } from "@/services/returnService";
import { ReturnActionModal } from "./ReturnActionModal";
import type { SellerReturnResponse, ReturnStatus } from "@/types/return";

const STATUS_LABELS: Record<ReturnStatus, { text: string; color: string }> = {
  RETURN_REQUESTED: {
    text: "반품 요청됨",
    color: "bg-yellow-100 text-yellow-800",
  },
  RETURN_SELLER_APPROVED: {
    text: "1차 승인 (발송 대기)",
    color: "bg-blue-100 text-blue-800",
  },
  RETURN_SHIPPED: {
    text: "반품 발송됨",
    color: "bg-purple-100 text-purple-800",
  },
  RETURN_APPROVED: {
    text: "환불 승인됨",
    color: "bg-green-100 text-green-800",
  },
  RETURN_COMPLETED: { text: "반품 완료", color: "bg-green-100 text-green-800" },
  RETURN_REJECTED_BEFORE_SHIPMENT: {
    text: "1차 거절됨",
    color: "bg-red-100 text-red-800",
  },
  RETURN_REJECTED_AFTER_SHIPMENT: {
    text: "환불 거절됨",
    color: "bg-red-100 text-red-800",
  },
  RETURN_REJECTED: { text: "반품 거절됨", color: "bg-red-100 text-red-800" },
};

export const SellerReturnManagement = () => {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<SellerReturnResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      returnService
        .getSellerReturns()
        .then(setReturns)
        .catch(() => showToast("반품 목록을 불러오는데 실패했습니다.", "error"))
        .finally(() => setIsLoading(false));
    },
    [showToast],
  );

  useEffect(() => {
    Promise.resolve().then(() => fetchReturns(false));
  }, [fetchReturns]);

  const openApproveModal = (ret: SellerReturnResponse) => {
    const isFirstApprove = ret.status === "RETURN_REQUESTED";

    setModalConfig({
      isOpen: true,
      title: isFirstApprove ? "반품 1차 승인" : "환불 최종 승인",
      description: isFirstApprove
        ? "반품 요청을 승인하시겠습니까? 구매자가 상품을 발송할 수 있게 됩니다."
        : "상품을 성공적으로 수령하셨나요? 환불을 최종 승인합니다.",
      actionType: "approve",
      requireReason: false,
      onSubmit: async () => {
        if (isFirstApprove) {
          await returnService.approveBySeller(ret.returnRequestUuid);
        } else {
          await returnService.approveReturn(ret.returnRequestUuid);
        }
        showToast("성공적으로 승인되었습니다.", "success");
        fetchReturns();
      },
    });
  };

  const openRejectModal = (ret: SellerReturnResponse) => {
    const isFirstReject = ret.status === "RETURN_REQUESTED";

    setModalConfig({
      isOpen: true,
      title: isFirstReject ? "반품 1차 거절" : "환불 최종 거절",
      description: isFirstReject
        ? "반품 요청을 거절하시겠습니까? 거절 사유를 반드시 입력해야 합니다."
        : "수령한 상품에 이상이 있나요? 환불을 거절합니다.",
      actionType: "reject",
      requireReason: true,
      onSubmit: async (reason) => {
        if (isFirstReject) {
          await returnService.rejectBySeller(ret.returnRequestUuid, {
            reason: reason || "",
          });
        } else {
          await returnService.rejectFinalReturn(ret.returnRequestUuid, {
            reason: reason || "",
          });
        }
        showToast("성공적으로 거절 처리되었습니다.", "success");
        fetchReturns();
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
        <h2 className="font-bold text-neutral-900">반품/환불 관리</h2>
        <span className="text-sm text-neutral-500">총 {returns.length}건</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {returns.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              진행 중인 반품 요청이 없습니다.
            </div>
          ) : (
            returns.map((ret) => {
              const statusInfo = STATUS_LABELS[ret.status] ?? {
                text: ret.status,
                color: "bg-neutral-100 text-neutral-600",
              };
              return (
                <div
                  key={ret.returnRequestUuid}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {ret.createdAt?.slice(0, 10)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 truncate max-w-[140px]">
                      주문: {ret.orderUuid}
                    </span>
                  </div>

                  {/* 반품 상품 목록 */}
                  <div className="mb-2 space-y-1">
                    {ret.returnItems.map((item) => (
                      <div
                        key={item.orderItemUuid}
                        className="flex justify-between text-sm"
                      >
                        <span className="font-medium text-neutral-900 truncate flex-1">
                          {item.productName}
                        </span>
                        <span className="text-neutral-500 ml-2 shrink-0">
                          환불 {item.refundAmount.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 반품 사유 */}
                  <div className="mt-2 p-3 bg-neutral-100 rounded text-sm text-neutral-700">
                    <span className="font-semibold text-neutral-900 mr-2">
                      반품 사유:
                    </span>
                    {ret.reason}
                  </div>

                  {/* 반품 운송장 (구매자 발송 후) */}
                  {ret.trackingNumber && (
                    <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                      반품 택배: {ret.carrierName} {ret.trackingNumber}
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex justify-end gap-2 mt-3">
                    {ret.status === "RETURN_REQUESTED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRejectModal(ret)}
                        >
                          1차 거절
                        </Button>
                        <Button size="sm" onClick={() => openApproveModal(ret)}>
                          1차 승인
                        </Button>
                      </>
                    )}
                    {ret.status === "RETURN_SHIPPED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRejectModal(ret)}
                        >
                          환불 거절
                        </Button>
                        <Button size="sm" onClick={() => openApproveModal(ret)}>
                          환불 승인
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <ReturnActionModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        actionType={modalConfig.actionType}
        requireReason={modalConfig.requireReason}
        onSubmit={modalConfig.onSubmit}
      />
    </div>
  );
};
