import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLikeStore } from '@/stores/useLikeStore';
import { useToast } from '@/components/common/Toast';
import { authService } from '@/services/authService';
import { parseHttpError } from '@/utils/httpError';
import {
  getRemainingVerificationCooldown,
  markVerificationEmailSent,
} from '@/utils/verificationCooldown';

const loginSchema = z.object({
  email: z.string().email('이메일 형식을 확인해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
  autoLogin: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToast();
  const fetchUserLikes = useLikeStore((state) => state.fetchUserLikes);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { autoLogin: false },
  });

  const handleVerificationRequired = async (email: string) => {
    const remaining = getRemainingVerificationCooldown(email);
    if (remaining > 0) {
      showToast(`인증 메일은 ${remaining}초 후 다시 보낼 수 있습니다.`, 'info');
      navigate(`/email/pending?email=${encodeURIComponent(email)}`);
      return;
    }

    await authService.sendVerificationEmail(email);
    markVerificationEmailSent(email);
    showToast('이메일 인증이 필요합니다. 인증 안내 페이지로 이동합니다.', 'info');
    navigate(`/email/pending?email=${encodeURIComponent(email)}`);
  };

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      await login({ email: data.email, password: data.password });

      const { user } = useAuthStore.getState();
      if (user) {
        await fetchUserLikes(user.id);
      }

      showToast('로그인에 성공했습니다.', 'success');
      navigate('/');
    } catch (error) {
      const message = parseHttpError(error, '로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');

      if (message.includes('이메일 인증이 필요합니다')) {
        try {
          await handleVerificationRequired(data.email);
        } catch (sendError) {
          showToast(parseHttpError(sendError, '인증 메일 재발송에 실패했습니다.'), 'error');
        }
      } else {
        showToast(message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해 주세요"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoLogin"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          {...register('autoLogin')}
        />
        <label htmlFor="autoLogin" className="text-sm font-medium text-neutral-700">
          자동 로그인
        </label>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
        로그인
      </Button>
    </form>
  );
}
