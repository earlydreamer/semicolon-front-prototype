import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { useToast } from '@/components/common/Toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/useAuthStore';
import { parseHttpError } from '@/utils/httpError';
import {
  getRemainingVerificationCooldown,
  markVerificationEmailSent,
} from '@/utils/verificationCooldown';

const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해 주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다.'),
    confirmPassword: z.string(),
    nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [remainingCooldown, setRemainingCooldown] = useState(0);

  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [isVerifyRequiredModalOpen, setIsVerifyRequiredModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const email = watch('email');

  useEffect(() => {
    if (!email) {
      setRemainingCooldown(0);
      return;
    }

    setRemainingCooldown(getRemainingVerificationCooldown(email));
    const timer = setInterval(() => {
      setRemainingCooldown(getRemainingVerificationCooldown(email));
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const handleSendVerificationEmail = async () => {
    const isValidEmail = await trigger('email');
    if (!isValidEmail) {
      showToast('이메일 형식을 먼저 확인해 주세요.', 'error');
      return;
    }

    const targetEmail = getValues('email');
    if (remainingCooldown > 0) {
      showToast(`인증 메일은 ${remainingCooldown}초 후 다시 보낼 수 있습니다.`, 'info');
      return;
    }

    setIsSendingVerification(true);
    try {
      await authService.sendVerificationEmail(targetEmail);
      markVerificationEmailSent(targetEmail);
      setRemainingCooldown(getRemainingVerificationCooldown(targetEmail));
      setIsSentModalOpen(true);
    } catch (error) {
      showToast(parseHttpError(error, '인증 메일 발송에 실패했습니다.'), 'error');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const onSubmit = async (data: SignupSchema) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message = parseHttpError(error, '회원가입 중 문제가 발생했습니다.');
      if (message.includes('이메일 인증이 필요합니다')) {
        setIsVerifyRequiredModalOpen(true);
      } else {
        showToast(message, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationButtonLabel =
    remainingCooldown > 0 ? `인증 메일 발송 (${remainingCooldown}s)` : '인증 메일 발송';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        isLoading={isSendingVerification}
        disabled={isSendingVerification || remainingCooldown > 0}
        onClick={handleSendVerificationEmail}
      >
        {verificationButtonLabel}
      </Button>

      <Input
        label="닉네임"
        placeholder="닉네임을 입력해 주세요"
        error={errors.nickname?.message}
        {...register('nickname')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" className="w-full mt-6" isLoading={isSubmitting} size="lg">
        가입하기
      </Button>

      <Modal
        isOpen={isSentModalOpen}
        onClose={() => setIsSentModalOpen(false)}
        title="인증 메일 발송 완료"
        size="sm"
      >
        <div className="text-center py-2">
          <p className="text-neutral-700">
            인증 메일을 보냈습니다. 메일의 인증 링크를 클릭한 뒤 가입하기를 눌러 주세요.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isVerifyRequiredModalOpen}
        onClose={() => setIsVerifyRequiredModalOpen(false)}
        title="이메일 인증 필요"
        size="sm"
      >
        <div className="text-center py-2">
          <p className="text-neutral-700">
            아직 이메일 인증이 완료되지 않았습니다. 먼저 메일 인증을 완료해 주세요.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/login');
        }}
        title="가입 완료"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-xl font-bold">✓</span>
          </div>
          <p className="text-neutral-700 font-medium mb-6">회원가입이 성공적으로 완료되었습니다.</p>
          <Button
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate('/login');
            }}
            className="w-full font-bold"
          >
            로그인하러 가기
          </Button>
        </div>
      </Modal>
    </form>
  );
}
