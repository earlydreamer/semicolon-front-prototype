/**
 * 배송지 선택 컴포넌트
 */

import { useState, useEffect } from 'react';
import { MOCK_ADDRESSES, type Address } from '../../../mocks/address';
import { Button } from '../../common/Button';
import { MapPin, Check } from 'lucide-react';

interface AddressSelectorProps {
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
}

const AddressSelector = ({ selectedAddress, onSelect }: AddressSelectorProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  // 기본 배송지 자동 선택
  useEffect(() => {
    if (!selectedAddress) {
      const defaultAddr = MOCK_ADDRESSES.find((addr) => addr.isDefault);
      if (defaultAddr) {
        onSelect(defaultAddr);
      }
    }
  }, [selectedAddress, onSelect]);

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
            <p className="text-neutral-500 mb-2">새 배송지 입력 기능은 준비 중입니다.</p>
            <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>
              기존 배송지 선택하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_ADDRESSES.map((address) => (
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
