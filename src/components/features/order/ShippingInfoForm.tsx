import { useState, useEffect } from 'react';
import type { Address } from '@/types/address';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

// 카카오 우편번호 API 전역 타입 선언입니다.
declare global {
  interface Window {
    daum: any;
  }
}

interface ShippingInfoFormProps {
  shippingInfo: Address | null;
  onUpdate: (info: Address) => void;
}

const KAKAO_POSTCODE_URL = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const ShippingInfoForm = ({ shippingInfo, onUpdate }: ShippingInfoFormProps) => {
  // 배송지 폼 상태입니다.
  const [formData, setFormData] = useState<Address>(
    shippingInfo || {
      id: 'manual',
      name: '기본 배송지',
      recipient: '',
      phone: '',
      zipCode: '',
      address: '',
      detailAddress: '',
      isDefault: false,
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 카카오 우편번호 스크립트를 로드합니다.
  useEffect(() => {
    if (window.daum && window.daum.Postcode) return;

    const script = document.createElement('script');
    script.src = KAKAO_POSTCODE_URL;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // 입력 필드 변경 핸들러입니다.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  // 주소 검색 핸들러입니다.
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      setModalMessage('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      setIsModalOpen(true);
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const updatedData = {
          ...formData,
          address: data.address,
          zipCode: data.zonecode,
        };

        setFormData(updatedData);
        onUpdate(updatedData);
      },
    }).open();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-bold text-neutral-900">배송지 정보</h3>
        </div>

        <div className="p-5 space-y-4">
          {/* 수령인 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">수령인</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="이름을 입력해 주세요"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="숫자만 입력해 주세요"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 주소 검색 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-700">주소</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                readOnly
                placeholder="우편번호"
                className="w-32 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none"
              />
              <button
                type="button"
                className="px-4 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shrink-0 text-sm"
                onClick={handleAddressSearch}
              >
                주소 검색
              </button>
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly
              placeholder="기본 주소 (주소 검색 후 자동 입력됩니다)"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none"
            />
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="상세 주소를 입력해 주세요"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* 안내 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="안내" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-neutral-700 font-medium mb-6 leading-relaxed">{modalMessage}</p>
          <Button onClick={() => setIsModalOpen(false)} className="w-full font-bold">
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShippingInfoForm;
