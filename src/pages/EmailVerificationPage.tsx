import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { authService } from '@/services/authService';

type VerificationState = 'loading' | 'success' | 'failure';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerificationState>('loading');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('인증 결과를 확인하는 중입니다.');

  useEffect(() => {
    const resultToken = searchParams.get('resultToken');
    if (!resultToken) {
      setState('failure');
      setMessage('올바른 인증 경로로 접근해 주세요.');
      return;
    }

    let isMounted = true;

    authService
      .verifyEmailResult(resultToken)
      .then((result) => {
        if (!isMounted) {
          return;
        }

        if (result.verified) {
          setState('success');
          setEmail(result.email ?? '');
          setMessage('이메일 인증이 완료되었습니다.');
          return;
        }

        setState('failure');
        setMessage('이메일 인증에 실패했습니다. 다시 시도해 주세요.');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setState('failure');
        setMessage('인증 결과 확인에 실패했습니다. 다시 시도해 주세요.');
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  if (state === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-3 py-8 min-[360px]:px-4 min-[360px]:py-12">
        <Card className="w-full max-w-lg p-5 min-[360px]:p-8">
          <div className="text-center space-y-5">
            <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">이메일 인증 확인</h1>
            <p className="text-neutral-600">{message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-3 py-8 min-[360px]:px-4 min-[360px]:py-12">
      <Card className="w-full max-w-lg p-5 min-[360px]:p-8">
        {state === 'success' ? (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
              ✓
            </div>
            <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">이메일 인증 완료</h1>
            <p className="text-neutral-600">{message}</p>
            {email && <p className="text-sm text-neutral-500 break-all">{email}</p>}
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                로그인하러 가기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
              !
            </div>
            <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">이메일 인증 실패</h1>
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
