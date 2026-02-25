import { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Button } from "../../common/Button";
import type { Address } from "../../../types/address";

/** 숫자만 추출 후 한국 전화번호 형식으로 하이픈 삽입 */
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(digits.length - 4)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const PHONE_REGEX = /^01[016789]-\d{3,4}-\d{4}$/;

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Address, "id" | "isDefault">) => Promise<void>;
  initialData?: Address | null;
  title?: string;
}

interface DaumPostcodeData {
  address: string;
  zonecode: string;
}

const KAKAO_POSTCODE_URL =
  "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "배송지 등록",
}: AddressFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Address, "id" | "isDefault">>({
    name: initialData?.name || "",
    recipient: initialData?.recipient || "",
    phone: initialData?.phone || "",
    zonecode: initialData?.zonecode || "",
    address: initialData?.address || "",
    detailAddress: initialData?.detailAddress || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        recipient: initialData.recipient,
        phone: initialData.phone,
        zonecode: initialData.zonecode || "",
        address: initialData.address,
        detailAddress: initialData.detailAddress,
      });
    } else {
      setFormData({
        name: "",
        recipient: "",
        phone: "",
        zonecode: "",
        address: "",
        detailAddress: "",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.daum?.Postcode) {
      const script = document.createElement("script");
      script.src = KAKAO_POSTCODE_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formatted = formatPhone(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      if (phoneError) setPhoneError("");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        setFormData((prev) => ({
          ...prev,
          address: data.address,
          zonecode: data.zonecode,
        }));
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(formData.phone)) {
      setPhoneError("올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)");
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            배송지명 (선택)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 우리집, 회사"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              수령인
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              required
              placeholder="이름"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              연락처
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="010-1234-5678"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent ${
                phoneError
                  ? "border-red-400 focus:ring-red-400"
                  : "border-neutral-200 focus:ring-primary-500"
              }`}
            />
            {phoneError && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {phoneError}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-neutral-700">
            주소
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="zonecode"
              value={formData.zonecode}
              readOnly
              required
              placeholder="우편번호"
              className="w-32 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddressSearch}
              className="shrink-0"
            >
              주소 검색
            </Button>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            readOnly
            required
            placeholder="기본 주소"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
          />
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            required
            placeholder="상세 주소"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 font-bold"
          >
            취소
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1 font-bold"
          >
            저장하기
          </Button>
        </div>
      </form>
    </Modal>
  );
};
