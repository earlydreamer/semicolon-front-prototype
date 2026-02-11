import { useState, useEffect } from 'react';
import type { Address } from '@/types/address';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

// 移댁뭅???고렪踰덊샇 API ????뺤쓽
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
  // 珥덇린 ?곹깭 ?ㅼ젙
  const [formData, setFormData] = useState<Address>(
    shippingInfo || {
      id: 'manual',
      name: '湲곕낯 諛곗넚吏',
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

  // ?ㅽ겕由쏀듃 ?숈쟻 濡쒕뱶
  useEffect(() => {
    if (window.daum && window.daum.Postcode) return;

    const script = document.createElement('script');
    script.src = KAKAO_POSTCODE_URL;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 而댄룷?뚰듃 ?몃쭏?댄듃 ???ㅽ겕由쏀듃 ?쒓굅 ?щ????좏깮?ы빆?대굹, 
      // ?ㅼ쨷 濡쒕뵫 諛⑹?瑜??꾪빐 蹂댄넻 洹몃?濡???
    };
  }, []);

  // ?낅젰 ?몃뱾??
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  // 移댁뭅???고렪踰덊샇 寃???몃뱾??
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      setModalMessage('二쇱냼 寃???쒕퉬?ㅻ? 遺덈윭?ㅻ뒗 以묒엯?덈떎. ?좎떆 ???ㅼ떆 ?쒕룄?댁＜?몄슂.');
      setIsModalOpen(true);
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        // 二쇱냼 ?좏깮 ??泥섎━ (?꾨줈紐?二쇱냼 ?곗꽑)
        const fullAddress = data.address;
        const zipCode = data.zonecode;

        const updatedData = {
          ...formData,
          address: fullAddress,
          zipCode: zipCode,
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
          <h3 className="font-bold text-neutral-900">諛곗넚吏 ?뺣낫</h3>
        </div>

        <div className="p-5 space-y-4">
          {/* ?섎졊??*/}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              ?섎졊??
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="?대쫫???낅젰?댁＜?몄슂"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* ?곕씫泥?*/}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              ?곕씫泥?
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="?レ옄留??낅젰?댁＜?몄슂"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 二쇱냼 寃??*/}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-700">
              二쇱냼
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                readOnly
                placeholder="?고렪踰덊샇"
                className="w-32 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none"
              />
              <button
                type="button"
                className="px-4 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shrink-0 text-sm"
                onClick={handleAddressSearch}
              >
                二쇱냼 寃??
              </button>
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly
              placeholder="湲곕낯 二쇱냼 (二쇱냼 寃?됱쓣 ?댁슜?댁＜?몄슂)"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none"
            />
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="?곸꽭 二쇱냼瑜??낅젰?댁＜?몄슂"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* ?뚮┝ 紐⑤떖 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="?뚮┝"
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
            ?뺤씤
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShippingInfoForm;

