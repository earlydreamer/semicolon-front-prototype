/**
 * 주문서 작성 페이지
 */

import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useUserStore } from "../stores/useUserStore";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import OrderItemList from "../components/features/order/OrderItemList";
import ShippingInfoForm from "../components/features/order/ShippingInfoForm";
import OrderSummary from "../components/features/order/OrderSummary";
import DepositUseForm from "../components/features/order/DepositUseForm";
import { CouponSelector } from "../components/features/order/CouponSelector";
import {
  calculateCouponDiscount,
  type UserCoupon,
} from "../components/features/order/couponUtils";
import { useToast } from "../components/common/Toast";
import type { AxiosError } from "axios";
import { AddressSelectionModal } from "../components/features/address/AddressSelectionModal";
import { addressService } from "../services/addressService";

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const balance = useUserStore((state) => state.balance);
  const fetchBalance = useUserStore((state) => state.fetchBalance);

  const {
    orderItems,
    shippingInfo,
    depositUseAmount,
    setShippingInfo,
    setOrderUuid,
    setOrderResponseItems,
    setCouponUuid,
    setCouponDiscountAmount,
    setDepositUseAmount,
    getOrderSummary,
  } = useOrderStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCoupon | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    setCouponUuid(null);
    setCouponDiscountAmount(0);
  }, [setCouponUuid, setCouponDiscountAmount]);

  // 로그인 유저 기본 배송지 또는 정보 바인딩
  useEffect(() => {
    if (user && !shippingInfo) {
      const fetchDefaultAddress = async () => {
        try {
          const defaultAddr = await addressService.getDefaultAddress();
          if (defaultAddr) {
            setShippingInfo(defaultAddr);
          } else {
            setShippingInfo({
              id: 0,
              name: "기본 배송지",
              isDefault: true,
              recipient: user.nickname || "",
              phone: "",
              zonecode: "",
              address: "",
              detailAddress: "",
            });
          }
        } catch {
          // 기본 배송지가 없는 경우 사용자 정보로 초기화
          setShippingInfo({
            id: 0,
            name: "기본 배송지",
            isDefault: true,
            recipient: user.nickname || "",
            phone: "",
            zonecode: "",
            address: "",
            detailAddress: "",
          });
        }
      };
      fetchDefaultAddress();
    }
  }, [user, shippingInfo, setShippingInfo]);

  // 주문할 상품이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (orderItems.length === 0) {
      showToast("주문할 상품이 없습니다.", "error");
      navigate("/", { replace: true });
    }
  }, [orderItems, navigate, showToast]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBalance();
  }, [isAuthenticated, fetchBalance]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (orderItems.length === 0) {
    return null; // useEffect에서 처리됨
  }

  const { totalProductPrice, totalShippingFee, finalPrice } = getOrderSummary();

  // 쿠폰 할인 계산
  const couponDiscount = calculateCouponDiscount(
    selectedCoupon,
    totalProductPrice,
  );
  const finalPriceWithCoupon = finalPrice;

  // 배송지 유효성 검사
  const isFormValid = !!(
    shippingInfo?.recipient &&
    shippingInfo?.phone &&
    shippingInfo?.zonecode &&
    shippingInfo?.address &&
    shippingInfo?.detailAddress
  );

  const handlePayment = async () => {
    if (!isFormValid || !shippingInfo) return;

    setIsLoading(true);

    try {
      // 주소록 저장 옵션이 체크된 경우 주소록에 추가 (ID가 0이거나 없을 때만 신규 저장)
      if (saveAddress && (!shippingInfo.id || shippingInfo.id === 0)) {
        try {
          await addressService.addAddress({
            name: shippingInfo.name || "최근 사용 배송지",
            recipient: shippingInfo.recipient,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            detailAddress: shippingInfo.detailAddress,
            zonecode: shippingInfo.zonecode,
          });
        } catch (_error) {
          console.warn(
            "Address saving failed, but proceeding with order:",
            _error,
          );
        }
      }

      // 백엔드 주문 생성 API 호출
      const orderRequest = {
        address: `${shippingInfo.address} ${shippingInfo.detailAddress}`,
        recipient: shippingInfo.recipient,
        contactNumber: shippingInfo.phone,
        items: orderItems.map((item) => ({
          productUuid: item.productUuid,
          sellerUuid: item.sellerUuid,
          productName: item.title,
          productPrice: item.price,
          imageUrl: item.thumbnailUrl || "",
        })),
      };

      const orderService = (await import("../services/orderService"))
        .orderService;
      const response = await orderService.createOrder(orderRequest);

      setOrderUuid(response.orderUuid);
      setOrderResponseItems(response.items);
      setCouponUuid(selectedCoupon?.uuid || null);

      navigate("/checkout");
    } catch (error: unknown) {
      console.error("Order creation failed:", error);
      const message =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "주문 생성에 실패했습니다.";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-5 pb-16 min-[360px]:py-6 min-[360px]:pb-20">
      <div className="mx-auto max-w-6xl px-3 min-[360px]:px-4">
        {/* 헤더 */}
        <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900 min-[360px]:text-xl">
            주문서 작성
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[360px]:gap-6 lg:grid-cols-3">
          {/* 왼쪽: 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 배송지 정보 */}
            <ShippingInfoForm
              shippingInfo={shippingInfo}
              onUpdate={setShippingInfo}
              onSelectAddressbook={() => setIsAddressModalOpen(true)}
              saveAddress={saveAddress}
              onSaveAddressChange={setSaveAddress}
            />

            {/* 주문 상품 */}
            <OrderItemList items={orderItems} />

            <CouponSelector
              orderAmount={totalProductPrice}
              selectedCoupon={selectedCoupon}
              onSelectCoupon={(coupon: UserCoupon | null) => {
                setSelectedCoupon(coupon);
                setCouponUuid(coupon?.uuid ?? null);
                setCouponDiscountAmount(
                  coupon
                    ? calculateCouponDiscount(coupon, totalProductPrice)
                    : 0,
                );
              }}
            />

            {/* 예치금 사용 */}
            <DepositUseForm
              balance={balance?.balance || 0}
              useAmount={depositUseAmount}
              onUseAmountChange={setDepositUseAmount}
              maxUseAmount={finalPriceWithCoupon}
            />
          </div>

          {/* 오른쪽: 결제 요약 (Sticky) */}
          <div className="lg:col-span-1">
            <OrderSummary
              productPrice={totalProductPrice}
              shippingFee={totalShippingFee}
              couponDiscount={couponDiscount}
              depositUseAmount={depositUseAmount}
              finalPrice={Math.max(0, finalPriceWithCoupon - depositUseAmount)}
              disabled={!isFormValid}
              onPayment={handlePayment}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <AddressSelectionModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={setShippingInfo}
      />
    </div>
  );
};

export default OrderPage;
