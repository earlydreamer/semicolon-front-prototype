import { useEffect, useMemo, useState } from 'react';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import Check from 'lucide-react/dist/esm/icons/check';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import X from 'lucide-react/dist/esm/icons/x';
import { couponService } from '@/services/couponService';
import { useToast } from '@/components/common/Toast';
import type { UserCoupon } from './couponUtils';

interface CouponSelectorProps {
  orderAmount: number;
  selectedCoupon: UserCoupon | null;
  onSelectCoupon: (coupon: UserCoupon | null) => void;
}

export function CouponSelector({ orderAmount, selectedCoupon, onSelectCoupon }: CouponSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      try {
        const list = await couponService.getMyCoupons();
        setCoupons(list);
      } catch (error) {
        console.error('Failed to load coupons:', error);
        showToast('쿠폰 목록을 불러오지 못했습니다.', 'error');
        setCoupons([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, [showToast]);

  const availableCoupons = useMemo(
    () => coupons.filter((coupon) => orderAmount >= coupon.minimumOrderAmount),
    [coupons, orderAmount]
  );

  useEffect(() => {
    if (!selectedCoupon) return;
    const stillValid = availableCoupons.some((coupon) => coupon.uuid === selectedCoupon.uuid);
    if (!stillValid) {
      onSelectCoupon(null);
    }
  }, [availableCoupons, selectedCoupon, onSelectCoupon]);

  const calculateDiscount = (coupon: UserCoupon): number => {
    return Math.min(coupon.discountAmount, orderAmount);
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

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
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

      {isOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50 p-4 space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            쿠폰 코드 직접 입력 기능은 준비중입니다.
          </div>

          {isLoading ? (
            <p className="text-sm text-neutral-500 text-center py-4">쿠폰을 불러오는 중입니다.</p>
          ) : availableCoupons.length > 0 ? (
            <div className="space-y-2">
              {availableCoupons.map((coupon) => {
                const discount = calculateDiscount(coupon);
                const isSelected = selectedCoupon?.uuid === coupon.uuid;

                return (
                  <button
                    key={coupon.uuid}
                    onClick={() => handleSelectCoupon(coupon)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{coupon.couponName}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formatCurrency(coupon.minimumOrderAmount)}원 이상
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 font-bold">-{formatCurrency(discount)}원</span>
                        {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">사용 가능한 쿠폰이 없습니다.</p>
          )}

          {coupons.length > availableCoupons.length && (
            <p className="text-xs text-neutral-400 text-center">
              최소 주문 금액 미달로 사용 불가능한 쿠폰이 {coupons.length - availableCoupons.length}개 있습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
