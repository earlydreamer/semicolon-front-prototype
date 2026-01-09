/**
 * 주문 페이지 쿠폰 선택 컴포넌트
 */

import { useState } from 'react';
import { Ticket, Check, ChevronDown, ChevronUp, X } from 'lucide-react';

type DiscountType = 'FIXED' | 'PERCENT';

interface UserCoupon {
  id: string;
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
}

// Mock 사용자 보유 쿠폰
const MOCK_USER_COUPONS: UserCoupon[] = [
  {
    id: 'coupon_1',
    name: '신규가입 환영 쿠폰',
    code: 'WELCOME2026',
    discountType: 'FIXED',
    discountValue: 5000,
    minOrderAmount: 30000,
    validUntil: '2026-12-31',
  },
  {
    id: 'coupon_2',
    name: '봄맞이 10% 할인',
    code: 'SPRING10',
    discountType: 'PERCENT',
    discountValue: 10,
    minOrderAmount: 50000,
    maxDiscount: 10000,
    validUntil: '2026-03-31',
  },
];

interface CouponSelectorProps {
  orderAmount: number;
  selectedCoupon: UserCoupon | null;
  onSelectCoupon: (coupon: UserCoupon | null) => void;
}

export function CouponSelector({ orderAmount, selectedCoupon, onSelectCoupon }: CouponSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  // 사용 가능한 쿠폰 필터링
  const availableCoupons = MOCK_USER_COUPONS.filter(
    (coupon) => orderAmount >= coupon.minOrderAmount
  );

  // 할인 금액 계산
  const calculateDiscount = (coupon: UserCoupon): number => {
    if (coupon.discountType === 'FIXED') {
      return coupon.discountValue;
    } else {
      const discount = Math.floor(orderAmount * (coupon.discountValue / 100));
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  const handleSelectCoupon = (coupon: UserCoupon) => {
    onSelectCoupon(coupon);
    setIsOpen(false);
  };

  const handleRemoveCoupon = () => {
    onSelectCoupon(null);
  };

  const handleApplyCode = () => {
    // Mock: 코드 입력으로 쿠폰 적용
    const foundCoupon = MOCK_USER_COUPONS.find(
      (c) => c.code.toUpperCase() === codeInput.toUpperCase()
    );
    if (foundCoupon) {
      if (orderAmount >= foundCoupon.minOrderAmount) {
        onSelectCoupon(foundCoupon);
        setCodeInput('');
        setIsOpen(false);
      } else {
        alert(`최소 주문 금액 ${formatCurrency(foundCoupon.minOrderAmount)}원 이상이어야 합니다.`);
      }
    } else {
      alert('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50"
      >
        <div className="flex items-center gap-3">
          <Ticket className="w-5 h-5 text-primary-500" />
          <span className="font-medium">쿠폰 적용</span>
        </div>
        
        {selectedCoupon ? (
          <div className="flex items-center gap-2">
            <span className="text-primary-600 font-semibold">
              -{formatCurrency(calculateDiscount(selectedCoupon))}원
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCoupon();
              }}
              className="p-1 text-neutral-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-neutral-500">
            <span className="text-sm">사용 가능 {availableCoupons.length}개</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </button>

      {/* 쿠폰 선택 패널 */}
      {isOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50 p-4 space-y-4">
          {/* 쿠폰 코드 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="쿠폰 코드 입력"
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={handleApplyCode}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
            >
              적용
            </button>
          </div>

          {/* 보유 쿠폰 목록 */}
          {availableCoupons.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">보유 쿠폰</p>
              {availableCoupons.map((coupon) => {
                const discount = calculateDiscount(coupon);
                const isSelected = selectedCoupon?.id === coupon.id;
                
                return (
                  <button
                    key={coupon.id}
                    onClick={() => handleSelectCoupon(coupon)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{coupon.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formatCurrency(coupon.minOrderAmount)}원 이상 | ~{coupon.validUntil}까지
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 font-bold">
                          -{formatCurrency(discount)}원
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">
              사용 가능한 쿠폰이 없습니다.
            </p>
          )}

          {/* 사용 불가 쿠폰 안내 */}
          {MOCK_USER_COUPONS.length > availableCoupons.length && (
            <p className="text-xs text-neutral-400 text-center">
              최소 주문 금액 미달로 사용 불가능한 쿠폰이 {MOCK_USER_COUPONS.length - availableCoupons.length}개 있습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// 할인 금액 계산 유틸 함수 export
export function calculateCouponDiscount(coupon: UserCoupon | null, orderAmount: number): number {
  if (!coupon) return 0;
  
  if (coupon.discountType === 'FIXED') {
    return coupon.discountValue;
  } else {
    const discount = Math.floor(orderAmount * (coupon.discountValue / 100));
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  }
}

export type { UserCoupon };
