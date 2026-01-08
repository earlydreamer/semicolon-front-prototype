import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { SignupForm } from '@/components/features/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900">회원가입</h1>
          <p className="mt-2 text-neutral-600">
            세미콜론의 회원이 되어 다양한 혜택을 누려보세요.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <SignupForm />
        </Card>

        <p className="text-center text-sm text-neutral-600">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-500"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
