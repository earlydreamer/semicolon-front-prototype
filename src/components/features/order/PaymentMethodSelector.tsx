/**
 * 결제 수단 선택 컴포넌트
 */

import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Check from 'lucide-react/dist/esm/icons/check';
import Building from 'lucide-react/dist/esm/icons/building';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'CARD', label: '신용/체크카드', icon: CreditCard },
  { id: 'EASY', label: '간편결제', icon: Smartphone }, // 카카오페이, 토스페이 등
  { id: 'V_BANK', label: '무통장입금', icon: Building },
];

const PaymentMethodSelector = ({ selectedMethod, onSelect }: PaymentMethodSelectorProps) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
        <h3 className="font-bold text-neutral-900">결제 수단</h3>
      </div>
      
      <div className="p-5 grid grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
              ${
                selectedMethod === method.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200'
              }`}
          >
            <method.icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-primary-500' : 'text-neutral-400'}`} />
            <span className="text-sm font-medium">{method.label}</span>
            {selectedMethod === method.id && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* 결제 수단별 추가 안내 (Mock) */}
      {selectedMethod && (
        <div className="px-5 pb-5">
           <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-500">
             {selectedMethod === 'CARD' && '모든 카드사 무이자 할부 혜택을 제공합니다.'}
             {selectedMethod === 'EASY' && '카카오페이, 토스페이, 네이버페이를 지원합니다.'}
             {selectedMethod === 'V_BANK' && '입금 확인 후 배송이 시작됩니다.'}
           </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
