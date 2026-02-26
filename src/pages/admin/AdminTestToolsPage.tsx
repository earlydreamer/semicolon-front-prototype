import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Search from 'lucide-react/dist/esm/icons/search';
import Wallet from 'lucide-react/dist/esm/icons/wallet';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import User from 'lucide-react/dist/esm/icons/user';
import PackageSearch from 'lucide-react/dist/esm/icons/package-search';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { couponService } from '@/services/couponService';
import { adminTestService, type AdminTestUserLookupResponse } from '@/services/adminTestService';
import type { CouponResponse } from '@/types/coupon';
import { orderService } from '@/services/orderService';
import type { OrderItemStatus, OrderResponse, OrderStatus } from '@/types/order';
import { parseHttpError } from '@/utils/httpError';

const ORDER_ITEM_STATUSES: OrderItemStatus[] = [
  'PAYMENT_COMPLETED',
  'PREPARING_SHIPMENT',
  'SHIPPED',
  'DELIVERED',
  'CONFIRMED',
  'CANCEL_REQUESTED',
  'CANCEL_IN_PROGRESS',
  'CANCELED',
  'REFUND_REQUESTED',
  'REFUND_IN_PROGRESS',
  'REFUND_COMPLETED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'SETTLEMENT_COMPLETED',
];

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PAYMENT_FAILED',
  'CANCELED',
  'PARTIAL_REFUNDED',
];

export default function AdminTestToolsPage() {
  const [email, setEmail] = useState('');
  const [targetUser, setTargetUser] = useState<AdminTestUserLookupResponse | null>(null);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [selectedCouponUuid, setSelectedCouponUuid] = useState('');
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [orderUuid, setOrderUuid] = useState('');
  const [selectedOrderItemUuid, setSelectedOrderItemUuid] = useState('');
  const [selectedOrderItemStatus, setSelectedOrderItemStatus] = useState<OrderItemStatus>('SHIPPED');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>('PAID');
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isGrantingDeposit, setIsGrantingDeposit] = useState(false);
  const [isIssuingCoupon, setIsIssuingCoupon] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isUpdatingOrderStatuses, setIsUpdatingOrderStatuses] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const list = await couponService.getAdminCoupons();
        setCoupons(list);
      } catch (error) {
        console.error('Failed to load coupons for admin test tools:', error);
      }
    };

    loadCoupons();
  }, []);

  const handleLookupUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      showToast('이메일을 입력해 주세요.', 'error');
      return;
    }

    setIsLookingUp(true);
    try {
      const user = await adminTestService.findUserByEmail(email.trim());
      setTargetUser(user);
      showToast('대상 사용자 조회 완료', 'success');
    } catch (error) {
      setTargetUser(null);
      showToast(parseHttpError(error, '사용자 조회에 실패했어요.'), 'error');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleGrantDeposit = async (event: FormEvent) => {
    event.preventDefault();
    if (!targetUser) {
      showToast('먼저 사용자 이메일 조회를 완료해 주세요.', 'error');
      return;
    }
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      showToast('지급 금액은 1원 이상이어야 합니다.', 'error');
      return;
    }

    setIsGrantingDeposit(true);
    try {
      await adminTestService.grantDepositToUser(targetUser.userUuid, depositAmount);
      showToast('예치금 지급 요청 완료', 'success');
    } catch (error) {
      showToast(parseHttpError(error, '예치금 지급에 실패했어요.'), 'error');
    } finally {
      setIsGrantingDeposit(false);
    }
  };

  const handleIssueCoupon = async (event: FormEvent) => {
    event.preventDefault();
    if (!targetUser) {
      showToast('먼저 사용자 이메일 조회를 완료해 주세요.', 'error');
      return;
    }
    if (!selectedCouponUuid) {
      showToast('지급할 쿠폰을 선택해 주세요.', 'error');
      return;
    }

    setIsIssuingCoupon(true);
    try {
      await adminTestService.issueCouponToUser(selectedCouponUuid, targetUser.userUuid);
      showToast('쿠폰 지급 요청 완료', 'success');
    } catch (error) {
      showToast(parseHttpError(error, '쿠폰 지급에 실패했어요.'), 'error');
    } finally {
      setIsIssuingCoupon(false);
    }
  };

  const handleFindOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!orderUuid.trim()) {
      showToast('주문 UUID를 입력해 주세요.', 'error');
      return;
    }

    setIsLoadingOrder(true);
    try {
      const order = await orderService.getOrder(orderUuid.trim());
      setOrderDetail(order);
      setSelectedOrderItemUuid(order.items[0]?.orderItemUuid ?? '');
      setSelectedOrderItemStatus(order.items[0]?.itemStatus ?? 'SHIPPED');
      setSelectedOrderStatus(order.orderStatus);
      showToast('주문 조회 완료', 'success');
    } catch (error) {
      setOrderDetail(null);
      setSelectedOrderItemUuid('');
      showToast(parseHttpError(error, '주문 조회에 실패했어요.'), 'error');
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handleUpdateOrderStatuses = async (event: FormEvent) => {
    event.preventDefault();
    if (!orderDetail) {
      showToast('먼저 주문 조회를 완료해 주세요.', 'error');
      return;
    }
    if (!selectedOrderItemUuid) {
      showToast('주문 아이템을 선택해 주세요.', 'error');
      return;
    }

    setIsUpdatingOrderStatuses(true);
    try {
      await Promise.all([
        orderService.updateOrderItemStatus(selectedOrderItemUuid, selectedOrderItemStatus),
        adminTestService.updateOrderStatus(orderDetail.orderUuid, selectedOrderStatus),
      ]);

      const refreshed = await orderService.getOrder(orderDetail.orderUuid);
      setOrderDetail(refreshed);
      setSelectedOrderStatus(refreshed.orderStatus);
      const refreshedItem = refreshed.items.find((item) => item.orderItemUuid === selectedOrderItemUuid);
      if (refreshedItem) {
        setSelectedOrderItemStatus(refreshedItem.itemStatus);
      }
      showToast('주문/주문아이템 상태 동시 변경 완료', 'success');
    } catch (error) {
      showToast(parseHttpError(error, '주문 상태 동시 변경에 실패했어요.'), 'error');
    } finally {
      setIsUpdatingOrderStatuses(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">테스트 도구</h1>
        <p className="text-neutral-500 mt-1">이메일 기반으로 사용자를 찾고 테스트 지급 작업을 실행합니다.</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        임시 운영 페이지입니다. 운영 환경에서는 내부 API 연동 정책을 먼저 확인해 주세요.
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-neutral-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-neutral-900">대상 사용자 조회</h2>
        </div>

        <form onSubmit={handleLookupUser} className="space-y-3">
          <label htmlFor="target-email" className="block text-sm font-medium text-neutral-700">
            사용자 이메일
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="target-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              required
            />
            <Button type="submit" isLoading={isLookingUp} leftIcon={<Search className="h-4 w-4" aria-hidden="true" />}>
              조회
            </Button>
          </div>
        </form>

        {targetUser && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <p>
              <span className="font-semibold">UUID:</span> {targetUser.userUuid}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {targetUser.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {targetUser.role}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-neutral-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-neutral-900">특정 사용자 예치금 지급</h2>
        </div>

        <form onSubmit={handleGrantDeposit} className="space-y-3">
          <label htmlFor="deposit-amount" className="block text-sm font-medium text-neutral-700">
            지급 금액 (원)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="deposit-amount"
              type="number"
              min={1}
              step={1}
              value={depositAmount}
              onChange={(event) => setDepositAmount(Number(event.target.value))}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              required
            />
            <Button type="submit" isLoading={isGrantingDeposit} disabled={!targetUser}>
              지급 실행
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Ticket className="h-5 w-5 text-neutral-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-neutral-900">특정 사용자 쿠폰 지급</h2>
        </div>

        <form onSubmit={handleIssueCoupon} className="space-y-3">
          <label htmlFor="issue-coupon-uuid" className="block text-sm font-medium text-neutral-700">
            지급할 쿠폰
          </label>
          <select
            id="issue-coupon-uuid"
            value={selectedCouponUuid}
            onChange={(event) => setSelectedCouponUuid(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            required
          >
            <option value="">쿠폰 선택</option>
            {coupons.map((coupon) => (
              <option key={coupon.uuid} value={coupon.uuid}>
                {coupon.couponName} ({coupon.status}) - {coupon.uuid}
              </option>
            ))}
          </select>

          <Button type="submit" isLoading={isIssuingCoupon} disabled={!targetUser}>
            쿠폰 지급 실행
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <PackageSearch className="h-5 w-5 text-neutral-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-neutral-900">테스트용 주문 상태 변경</h2>
        </div>

        <form onSubmit={handleFindOrder} className="space-y-3">
          <label htmlFor="target-order-uuid" className="block text-sm font-medium text-neutral-700">
            주문 UUID
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="target-order-uuid"
              type="text"
              value={orderUuid}
              onChange={(event) => setOrderUuid(event.target.value)}
              placeholder="주문 UUID 입력"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              required
            />
            <Button type="submit" isLoading={isLoadingOrder}>
              주문 조회
            </Button>
          </div>
        </form>

        {orderDetail && (
          <div className="mt-4 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-sm text-neutral-700">
              <p>
                <span className="font-semibold">주문 상태:</span> {orderDetail.orderStatus}
              </p>
              <p>
                <span className="font-semibold">주문자 UUID:</span> {orderDetail.userUuid}
              </p>
            </div>

            <form onSubmit={handleUpdateOrderStatuses} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-3">
              <div>
                <label htmlFor="target-order-status" className="block text-sm font-medium text-neutral-700 mb-1">
                  변경할 주문 전체 상태
                </label>
                <select
                  id="target-order-status"
                  value={selectedOrderStatus}
                  onChange={(event) => setSelectedOrderStatus(event.target.value as OrderStatus)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  required
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="target-order-item" className="block text-sm font-medium text-neutral-700 mb-1">
                  주문 아이템
                </label>
                <select
                  id="target-order-item"
                  value={selectedOrderItemUuid}
                  onChange={(event) => {
                    const nextOrderItemUuid = event.target.value;
                    setSelectedOrderItemUuid(nextOrderItemUuid);
                    const selectedItem = orderDetail.items.find((item) => item.orderItemUuid === nextOrderItemUuid);
                    if (selectedItem) {
                      setSelectedOrderItemStatus(selectedItem.itemStatus);
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">아이템 선택</option>
                  {orderDetail.items.map((item) => (
                    <option key={item.orderItemUuid} value={item.orderItemUuid}>
                      {item.productName} | {item.orderItemUuid} | 현재: {item.itemStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="target-order-item-status" className="block text-sm font-medium text-neutral-700 mb-1">
                  변경할 상태
                </label>
                <select
                  id="target-order-item-status"
                  value={selectedOrderItemStatus}
                  onChange={(event) => setSelectedOrderItemStatus(event.target.value as OrderItemStatus)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  required
                >
                  {ORDER_ITEM_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" isLoading={isUpdatingOrderStatuses}>
                주문/주문아이템 상태 동시 변경 실행
              </Button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
