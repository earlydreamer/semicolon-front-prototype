import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { authService } from '@/services/authService';
import { useToast } from '@/components/common/Toast';
import { parseHttpError } from '@/utils/httpError';
import {
  getRemainingVerificationCooldown,
  getVerificationCooldownSeconds,
  markVerificationEmailSent,
} from '@/utils/verificationCooldown';

export default function EmailVerificationPendingPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const email = searchParams.get('email') || '';
  const [remaining, setRemaining] = useState(() => getRemainingVerificationCooldown(email));

  useEffect(() => {
    setRemaining(getRemainingVerificationCooldown(email));
    const timer = setInterval(() => {
      setRemaining(getRemainingVerificationCooldown(email));
    }, 1000);
    return () => clearInterval(timer);
  }, [email]);

  const handleResend = async () => {
    if (!email) {
      showToast('이메일 정보가 없습니다. 다시 회원가입/로그인을 시도해주세요.', 'error');
      return;
    }

    if (remaining > 0) {
      showToast(`인증 메일은 ${remaining}초 후 다시 보낼 수 있습니다.`, 'info');
      return;
    }

    setIsResending(true);
    try {
      await authService.sendVerificationEmail(email);
      markVerificationEmailSent(email);
      setRemaining(getVerificationCooldownSeconds());
      showToast('인증 메일을 다시 발송했습니다.', 'success');
    } catch (error) {
      showToast(parseHttpError(error, '인증 메일 재발송에 실패했습니다.'), 'error');
    } finally {
      setIsResending(false);
    }
  };

  const resendButtonLabel =
    remaining > 0 ? `인증 메일 다시 보내기 (${remaining}s)` : '인증 메일 다시 보내기';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-3 py-8 min-[360px]:px-4 min-[360px]:py-12">
      <Card className="w-full max-w-lg p-5 min-[360px]:p-8">
        <div className="text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-2xl">
            @
          </div>
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">이메일 인증이 필요합니다</h1>
          <p className="text-neutral-600">
            인증 메일을 발송했습니다. 메일의 인증 링크를 클릭한 뒤 다시 진행해주세요.
          </p>
          {email && <p className="text-sm text-neutral-500 break-all">{email}</p>}

          <Button
            className="w-full"
            onClick={handleResend}
            isLoading={isResending}
            disabled={isResending || remaining > 0}
          >
            {resendButtonLabel}
          </Button>

          <div className="flex gap-3">
            <Link to="/signup" className="w-1/2">
              <Button variant="outline" className="w-full">
                회원가입
              </Button>
            </Link>
            <Link to="/login" className="w-1/2">
              <Button className="w-full">로그인</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
