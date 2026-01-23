import { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

interface DepositUseFormProps {
  balance: number;      // 보유 잔액
  useAmount: number;    // 사용 중인 금액
  onUseAmountChange: (amount: number) => void;
  maxUseAmount: number; // 현재 주문에서 최대로 사용 가능한 금액 (최종 결제액 이하)
}

const DepositUseForm = ({
  balance,
  useAmount,
  onUseAmountChange,
  maxUseAmount,
}: DepositUseFormProps) => {
  const [inputValue, setInputValue] = useState(useAmount === 0 ? '' : useAmount.toString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 외부에서 useAmount가 바뀌면 (예: 초기화) 입력값도 동기화
  useEffect(() => {
    if (useAmount === 0) {
      setInputValue('');
    } else {
      setInputValue(useAmount.toString());
    }
  }, [useAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const handleApply = () => {
    const numValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
    
    // 1. 보유 잔액 초과 체크
    if (numValue > balance) {
      setModalMessage('보유 예치금이 부족합니다.');
      setIsModalOpen(true);
      return;
    }

    // 2. 주문 금액 초과 체크
    if (numValue > maxUseAmount) {
      setModalMessage(`최종 결제 금액(${maxUseAmount.toLocaleString()}원)을 초과하여 예치금을 사용할 수 없습니다.`);
      setIsModalOpen(true);
      
      // 주문 금액만큼만 적용하도록 자동 조정
      onUseAmountChange(maxUseAmount);
      setInputValue(maxUseAmount.toString());
      return;
    }
    
    onUseAmountChange(numValue);
    setInputValue(numValue.toString());
  };

  const handleUseAll = () => {
    const allIn = Math.min(balance, maxUseAmount);
    setInputValue(allIn.toString());
  };

  // 현재 입력된 값과 실제 적용된 값이 다른지 확인
  const isApplied = useAmount > 0 && useAmount === parseInt(inputValue || '0', 10);

  return (
    <>
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900">예치금 사용</h3>
          <span className="text-sm text-neutral-500">
            보유 잔액 <span className="font-semibold text-neutral-700">{balance.toLocaleString()}원</span>
          </span>
        </div>
        
        <div className="p-5">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-right font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">원</span>
              </div>
              <button
                onClick={handleApply}
                className={`px-6 py-3 rounded-xl font-bold transition-colors shrink-0 ${
                  isApplied 
                  ? 'bg-neutral-100 text-neutral-400 cursor-default' 
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {isApplied ? '적용됨' : '적용'}
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleUseAll}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-700 underline underline-offset-4"
              >
                보유 잔액 전액 사용
              </button>
            </div>
          </div>
          
          {useAmount > 0 && isApplied && (
            <p className="mt-3 text-sm text-primary-600 font-medium">
              현재 <span className="font-bold">{useAmount.toLocaleString()}원</span>이 적용되었습니다.
            </p>
          )}
          
          <p className="mt-2 text-xs text-neutral-400">
            * 예치금은 상품 금액 및 배송비를 포함한 최종 결제 금액까지만 사용 가능합니다.
          </p>
        </div>
      </div>

      {/* 경고 모달 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="알림"
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-neutral-700 font-medium mb-6 leading-relaxed">
            {modalMessage}
          </p>
          <Button 
            onClick={() => setIsModalOpen(false)}
            className="w-full font-bold"
          >
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DepositUseForm;
