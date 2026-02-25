import { Modal } from '../../common/Modal';
import { AddressList } from './AddressList';
import type { Address } from '../../../types/address';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

export const AddressSelectionModal = ({
  isOpen,
  onClose,
  onSelect
}: AddressSelectionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="배송지 선택" size="lg">
      <div className="py-2">
        <AddressList selectable onSelect={(address) => {
          onSelect(address);
          onClose();
        }} />
      </div>
    </Modal>
  );
};
