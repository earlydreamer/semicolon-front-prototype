import { useState, useEffect, useCallback, useRef } from 'react';
import { addressService } from '../../../services/addressService';
import { AddressItem } from './AddressItem';
import { AddressFormModal } from './AddressFormModal';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import type { Address } from '../../../types/address';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

interface AddressListProps {
  selectable?: boolean;
  onSelect?: (address: Address) => void;
}

export const AddressList = ({ selectable = false, onSelect }: AddressListProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  
  const { showToast } = useToast();
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchAddresses = useCallback(async (page: number, append = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await addressService.getMyAddresses(page, 10);
      console.log('[DEBUG] getMyAddresses response:', response);

      // 데이터 추출 로직 개선: PageResponse 구조 또는 배열 구조 대응
      let rawItems: any[] = [];
      if (Array.isArray(response)) {
        rawItems = response;
      } else if (response && Array.isArray(response.content)) {
        rawItems = response.content;
      }

      const newItems: Address[] = rawItems.map((item: any) => ({
        id: item.id,
        name: item.name || (item.isDefault || item.default ? '기본 배송지' : '배송지'),
        recipient: item.recipient || '',
        phone: item.phone || '',
        address: item.address || '',
        detailAddress: item.detailAddress || '',
        zonecode: item.zonecode || '',
        isDefault: Boolean(item.isDefault || item.default)
      }));

      console.log('[DEBUG] Parsed items:', newItems);
      
      if (append) {
        setAddresses(prev => [...(prev || []), ...newItems]);
      } else {
        setAddresses(newItems);
      }
      setIsLastPage(response?.last ?? (Array.isArray(response) ? true : true));
      setCurrentPage(response?.number ?? (Array.isArray(response) ? 0 : 0));
    } catch (error) {
      console.error('[DEBUG] fetchAddresses error:', error);
      showToast('주소록을 불러오는 데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, showToast]);

  useEffect(() => {
    fetchAddresses(0);
  }, []);

  useEffect(() => {
    if (isLastPage || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchAddresses(currentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, isLastPage, isLoading, fetchAddresses]);

  const handleAddClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      await addressService.deleteAddress(deleteTargetId);
      showToast('삭제되었습니다.', 'success');
      fetchAddresses(0);
    } catch (error) {
      showToast('삭제에 실패했습니다.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      showToast('기본 배송지로 설정되었습니다.', 'success');
      fetchAddresses(0);
    } catch (error) {
      showToast('설정에 실패했습니다.', 'error');
    }
  };

  const handleFormSubmit = async (data: Omit<Address, 'id' | 'isDefault'>) => {
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, data);
        showToast('수정되었습니다.', 'success');
      } else {
        await addressService.addAddress(data);
        showToast('저장되었습니다.', 'success');
      }
      fetchAddresses(0);
    } catch (error) {
      showToast('저장에 실패했습니다.', 'error');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">등록된 배송지 {(addresses || []).length}개</p>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>배송지 추가</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {addresses.map(address => (
          <AddressItem
            key={address.id}
            address={address}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onSetDefault={handleSetDefault}
            selectable={selectable}
            onSelect={onSelect}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      )}

      <div ref={observerTarget} className="h-4" />

      {(addresses || []).length === 0 && !isLoading && (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <p className="text-neutral-500 mb-4">등록된 주소가 없습니다.</p>
          <button
            onClick={handleAddClick}
            className="text-primary-600 font-bold hover:underline"
          >
            첫 배송지 추가하기
          </button>
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
        title={editingAddress ? '배송지 수정' : '배송지 추가'}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="배송지 삭제"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-neutral-600 text-sm">
            이 배송지를 삭제하시겠습니까?
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteTargetId(null)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
