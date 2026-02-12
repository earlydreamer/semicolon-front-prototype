import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();

  const verified = searchParams.get('verified') === 'true';
  const email = searchParams.get('email') || '';
  const message =
    searchParams.get('message') ||
    (verified ? '이메일 인증이 완료되었습니다.' : '이메일 인증에 실패했습니다.');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg p-8">
        {verified ? (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">이메일 인증 완료</h1>
            <p className="text-neutral-600">{message}</p>
            {email && <p className="text-sm text-neutral-500 break-all">{email}</p>}
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                로그인 하러 가기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
              !
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">이메일 인증 실패</h1>
            <p className="text-neutral-600">{message}</p>
            <div className="flex gap-3">
              <Link to="/signup" className="w-1/2">
                <Button variant="outline" className="w-full">
                  회원가입으로
                </Button>
              </Link>
              <Link to="/login" className="w-1/2">
                <Button className="w-full">로그인으로</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
