import { Button } from '@/components/common/Button';

export function SocialLoginButtons() {
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인은 준비 중입니다.`);
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
    </div>
  );
}
