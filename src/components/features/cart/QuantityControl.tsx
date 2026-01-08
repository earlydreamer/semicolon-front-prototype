/**
 * 수량 조절 컴포넌트
 * - 최소 1개, 최대 99개
 */

interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantityControl = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityControlProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="w-8 h-8 flex items-center justify-center rounded-md
                   bg-neutral-100 hover:bg-neutral-200 
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors text-neutral-700 font-medium"
        aria-label="수량 감소"
      >
        −
      </button>
      
      <span className="w-10 text-center font-medium text-neutral-900">
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="w-8 h-8 flex items-center justify-center rounded-md
                   bg-neutral-100 hover:bg-neutral-200
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors text-neutral-700 font-medium"
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
