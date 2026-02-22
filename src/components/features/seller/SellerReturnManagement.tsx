import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { returnService } from '@/services/returnService';
import { ReturnActionModal } from './ReturnActionModal';
import type { ReturnStatus } from '@/types/return';

// Mock Data Type
interface MockReturnRequest {
  returnRequestUuid: string;
  orderUuid: string;
  productName: string;
  buyerName: string;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
}

// Temporary Mock Data
const MOCK_RETURNS: MockReturnRequest[] = [
  {
    returnRequestUuid: 'mock-return-1',
    orderUuid: 'order-1',
    productName: '빈티지 카메라',
    buyerName: '사용자A',
    reason: '상품 외관에 스크래치가 너무 많습니다.',
    status: 'REQUESTED',
    createdAt: '2026-02-21T10:00:00Z'
  },
  {
    returnRequestUuid: 'mock-return-2',
    orderUuid: 'order-2',
    productName: '캠핑용 텐트',
    buyerName: '사용자B',
    reason: '색상이 화면과 너무 다릅니다.',
    status: 'SHIPPED', // 구매자가 운송장 등록 완료한 상태
    createdAt: '2026-02-20T15:30:00Z'
  }
];

const STATUS_LABELS: Record<ReturnStatus, { text: string; color: string }> = {
  REQUESTED: { text: '반품 요청됨', color: 'bg-yellow-100 text-yellow-800' },
  SELLER_APPROVED: { text: '1차 승인완료 (발송대기)', color: 'bg-blue-100 text-blue-800' },
  SELLER_REJECTED: { text: '1차 거절됨', color: 'bg-red-100 text-red-800' },
  SHIPPED: { text: '반품 발송됨', color: 'bg-purple-100 text-purple-800' },
  FINAL_APPROVED: { text: '환불 승인됨 (완료)', color: 'bg-green-100 text-green-800' },
  FINAL_REJECTED: { text: '환불 거절됨', color: 'bg-red-100 text-red-800' }
};

export const SellerReturnManagement = () => {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<MockReturnRequest[]>(MOCK_RETURNS);
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'approve' | 'reject';
    requireReason: boolean;
    onSubmit: (reason?: string) => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'approve',
    requireReason: false,
    onSubmit: async () => {},
  });

  const openApproveModal = (ret: MockReturnRequest) => {
    const isFirstApprove = ret.status === 'REQUESTED';
    
    setModalConfig({
      isOpen: true,
      title: isFirstApprove ? '반품 1차 승인' : '환불 최종 승인',
      description: isFirstApprove 
        ? '반품 요청을 승인하시겠습니까? 구매자가 상품을 발송할 수 있게 됩니다.'
        : '상품을 성공적으로 수령하셨나요? 환불을 최종 승인합니다.',
      actionType: 'approve',
      requireReason: false,
      onSubmit: async () => {
        if (isFirstApprove) {
          await returnService.approveBySeller(ret.returnRequestUuid);
          updateReturnStatus(ret.returnRequestUuid, 'SELLER_APPROVED');
        } else {
          await returnService.approveReturn(ret.returnRequestUuid);
          updateReturnStatus(ret.returnRequestUuid, 'FINAL_APPROVED');
        }
        showToast('성공적으로 승인되었습니다.', 'success');
      }
    });
  };

  const openRejectModal = (ret: MockReturnRequest) => {
    const isFirstReject = ret.status === 'REQUESTED';
    
    setModalConfig({
      isOpen: true,
      title: isFirstReject ? '반품 1차 거절' : '환불 최종 거절',
      description: isFirstReject 
        ? '반품 요청을 거절하시겠습니까? 거절 사유를 반드시 입력해야 합니다.'
        : '수령한 상품에 이상이 있나요? 환불을 거절합니다.',
      actionType: 'reject',
      requireReason: true,
      onSubmit: async (reason) => {
        if (isFirstReject) {
          await returnService.rejectBySeller(ret.returnRequestUuid, { reason: reason || '' });
          updateReturnStatus(ret.returnRequestUuid, 'SELLER_REJECTED');
        } else {
          await returnService.rejectFinalReturn(ret.returnRequestUuid, { reason: reason || '' });
          updateReturnStatus(ret.returnRequestUuid, 'FINAL_REJECTED');
        }
        showToast('성공적으로 거절 처리되었습니다.', 'success');
      }
    });
  };

  const updateReturnStatus = (uuid: string, newStatus: ReturnStatus) => {
    setReturns(prev => 
      prev.map(r => r.returnRequestUuid === uuid ? { ...r, status: newStatus } : r)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
        <h2 className="font-bold text-neutral-900">반품/환불 관리</h2>
        <span className="text-sm text-neutral-500">총 {returns.length}건</span>
      </div>

      <div className="divide-y divide-neutral-100">
        {returns.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-sm">
            진행 중인 반품 요청이 없습니다.
          </div>
        ) : (
          returns.map((ret) => (
            <div key={ret.returnRequestUuid} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_LABELS[ret.status].color}`}>
                    {STATUS_LABELS[ret.status].text}
                  </span>
                  <span className="text-xs text-neutral-500">{new Date(ret.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-xs text-neutral-400">주문번호: {ret.orderUuid}</span>
              </div>
              
              <div className="mb-3">
                <p className="font-medium text-neutral-900">{ret.productName}</p>
                <p className="text-sm text-neutral-600 mt-1">구매자: {ret.buyerName}</p>
                <div className="mt-2 p-3 bg-neutral-100 rounded text-sm text-neutral-700">
                  <span className="font-semibold text-neutral-900 mr-2">반품 사유:</span>
                  {ret.reason}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {ret.status === 'REQUESTED' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openRejectModal(ret)}>1차 거절</Button>
                    <Button size="sm" onClick={() => openApproveModal(ret)}>1차 승인</Button>
                  </>
                )}
                {ret.status === 'SHIPPED' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openRejectModal(ret)}>환불 거절</Button>
                    <Button size="sm" onClick={() => openApproveModal(ret)}>환불 승인</Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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
