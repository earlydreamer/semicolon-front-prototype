import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export function SocialLoginButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSocialLogin = (provider: string) => {
    setModalMessage(`${provider} 로그인은 준비 중입니다.`);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="w-full bg-[#FEE500] text-neutral-900 border-[#FEE500] hover:bg-[#FDD835]"
        onClick={() => handleSocialLogin('Kakao')}
      >
        Kakao로 시작하기
      </Button>
      <Button
        variant="outline"
        className="w-full bg-[#03C75A] text-white border-[#03C75A] hover:bg-[#02B351]"
        onClick={() => handleSocialLogin('Naver')}
      >
        Naver로 시작하기
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialLogin('Google')}
      >
        Google로 시작하기
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="알림"
        size="sm"
      >
        <div className="text-center py-4">
          <p className="text-neutral-700 font-medium mb-6">
            {modalMessage}
          </p>
          <Button onClick={() => setIsModalOpen(false)} className="w-full font-bold">
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
}
