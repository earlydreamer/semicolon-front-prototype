import { useState, useEffect } from 'react';
import type { Address } from '@/types/address';
import { userService } from '@/services/userService';
import { Button } from '../../common/Button';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Check from 'lucide-react/dist/esm/icons/check';

interface AddressSelectorProps {
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
}

const AddressSelector = ({ selectedAddress, onSelect }: AddressSelectorProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const list = await userService.getMyAddresses();
        const mapped = list.map((addr) => ({
          id: String(addr.id),
          name: addr.isDefault ? '기본 배송지' : '배송지',
          recipient: addr.receiverName,
          phone: addr.receiverPhone,
          address: addr.address1,
          detailAddress: addr.address2,
          zipCode: addr.zipcode,
          isDefault: addr.isDefault,
        }));

        setAddresses(mapped);

        if (!selectedAddress) {
          const defaultAddr = mapped.find((addr) => addr.isDefault) || mapped[0];
          if (defaultAddr) {
            onSelect(defaultAddr);
          }
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
        setAddresses([]);
      }
    };

    loadAddresses();
  }, [onSelect, selectedAddress]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
        <h3 className="font-bold text-neutral-900">배송지 정보</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {isAddingNew ? '목록 선택' : '+ 새 배송지'}
        </Button>
      </div>

      <div className="p-5">
        {isAddingNew ? (
          <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
            <p className="text-neutral-500 mb-2">새 배송지 입력 기능은 준비중입니다.</p>
            <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>
              기존 배송지 선택하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => onSelect(address)}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary-200
                  ${
                    selectedAddress?.id === address.id
                      ? 'border-primary-500 bg-primary-50/10'
                      : 'border-neutral-100 bg-neutral-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0
                    ${selectedAddress?.id === address.id ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                    {selectedAddress?.id === address.id ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900">{address.name}</span>
                      {address.isDefault && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-200 text-neutral-600 rounded">
                          기본
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-900 mb-0.5">
                      {address.recipient} ({address.phone})
                    </p>
                    <p className="text-sm text-neutral-600">
                      [{address.zipCode}] {address.address} {address.detailAddress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelector;
