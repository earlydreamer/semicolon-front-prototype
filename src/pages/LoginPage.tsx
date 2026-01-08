import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { SocialLoginButtons } from '@/components/features/auth/SocialLoginButtons';

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900">로그인</h1>
          <p className="mt-2 text-neutral-600">
            세미콜론에 오신 것을 환영합니다!
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <LoginForm />
          
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-neutral-200" />
            <span className="px-4 text-xs text-neutral-500">또는</span>
            <div className="flex-1 border-t border-neutral-200" />
          </div>

          <SocialLoginButtons />
        </Card>

        <p className="text-center text-sm text-neutral-600">
          계정이 없으신가요?{' '}
          <Link
            to="/signup"
            className="font-semibold text-primary-600 hover:text-primary-500"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
