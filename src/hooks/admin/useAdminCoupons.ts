import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/components/common/Toast';
import { couponService } from '@/services/couponService';
import type { CouponResponse, CouponStatus } from '@/types/coupon';
import type { CouponFormData } from '@/components/features/admin/CouponFormPanel';

const EMPTY_FORM: CouponFormData = {
  couponName: '',
  discountAmount: 0,
  minimumOrderAmount: 0,
  validFrom: '',
  totalQuantity: 1,
};

const toLocalDateTimeInput = (isoString: string) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoString = (localDateTime: string) => new Date(localDateTime).toISOString();

export const useAdminCoupons = () => {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponResponse | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const loadCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await couponService.getAdminCoupons();
      setCoupons(list);
    } catch (error) {
      console.error('Failed to load admin coupons:', error);
      showToast('쿠폰 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingCoupon(null);
    setShowForm(false);
  }, []);

  const filteredCoupons = useMemo(() => {
    if (statusFilter === 'all') return coupons;
    return coupons.filter((coupon) => coupon.status === statusFilter);
  }, [coupons, statusFilter]);

  const handleEdit = useCallback((coupon: CouponResponse) => {
    setEditingCoupon(coupon);
    setFormData({
      couponName: coupon.couponName,
      discountAmount: coupon.discountAmount,
      minimumOrderAmount: coupon.minimumOrderAmount,
      validFrom: toLocalDateTimeInput(coupon.validFrom),
      totalQuantity: coupon.totalQuantity,
    });
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.validFrom) {
      showToast('시작 일시를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateAdminCouponDraft(editingCoupon.uuid, {
          couponName: formData.couponName,
          discountAmount: formData.discountAmount,
          minimumOrderAmount: formData.minimumOrderAmount,
          validFrom: toIsoString(formData.validFrom),
        });
        showToast('쿠폰 초안이 수정되었습니다.', 'success');
      } else {
        await couponService.createAdminCoupon({
          couponName: formData.couponName,
          discountAmount: formData.discountAmount,
          minimumOrderAmount: formData.minimumOrderAmount,
          validFrom: toIsoString(formData.validFrom),
          totalQuantity: formData.totalQuantity,
        });
        showToast('새 쿠폰이 생성되었습니다.', 'success');
      }

      await loadCoupons();
      resetForm();
    } catch (error) {
      console.error('Failed to submit coupon:', error);
      showToast('쿠폰 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingCoupon, loadCoupons, resetForm, showToast]);

  const handleActivate = useCallback(async (couponUuid: string) => {
    try {
      await couponService.activateAdminCoupon(couponUuid);
      showToast('쿠폰이 활성화되었습니다.', 'success');
      await loadCoupons();
    } catch (error) {
      console.error('Failed to activate coupon:', error);
      showToast('활성화 처리 중 오류가 발생했습니다.', 'error');
    }
  }, [loadCoupons, showToast]);

  return {
    coupons: filteredCoupons,
    showForm,
    editingCoupon,
    formData,
    isSubmitting,
    statusFilter,
    isLoading,
    setShowForm,
    setFormData,
    setStatusFilter,
    resetForm,
    handleEdit,
    handleSubmit,
    handleActivate,
  };
};
