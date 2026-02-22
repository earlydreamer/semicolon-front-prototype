import { useEffect, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
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
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '올바른 이메일 형식을 입력해 주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다.'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((value) => value, {
      message: '이용약관 동의가 필요합니다.',
    }),
    privacyAccepted: z.boolean().refine((value) => value, {
      message: '개인정보 처리방침 동의가 필요합니다.',
    }),
    marketingAccepted: z.boolean().optional(),
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
  const [agreementModalType, setAgreementModalType] = useState<'terms' | 'privacy' | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const email = watch('email');
  const termsAccepted = watch('termsAccepted');
  const privacyAccepted = watch('privacyAccepted');
  const marketingAccepted = watch('marketingAccepted');
  const isAllAgreed = Boolean(termsAccepted && privacyAccepted && marketingAccepted);

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

  const handleAllAgreementChange = (checked: boolean) => {
    setValue('termsAccepted', checked, { shouldValidate: true, shouldDirty: true });
    setValue('privacyAccepted', checked, { shouldValidate: true, shouldDirty: true });
    setValue('marketingAccepted', checked, { shouldValidate: true, shouldDirty: true });
  };

  const openAgreementModal = (type: 'terms' | 'privacy') => {
    setAgreementModalType(type);
  };

  const closeAgreementModal = () => {
    setAgreementModalType(null);
  };

  const agreeAndCloseModal = () => {
    if (!agreementModalType) {
      return;
    }

    setValue(agreementModalType === 'terms' ? 'termsAccepted' : 'privacyAccepted', true, {
      shouldValidate: true,
      shouldDirty: true,
    });
    closeAgreementModal();
  };

  const onInvalid = (formErrors: FieldErrors<SignupSchema>) => {
    if (formErrors.email) return setFocus('email');
    if (formErrors.nickname) return setFocus('nickname');
    if (formErrors.password) return setFocus('password');
    if (formErrors.confirmPassword) return setFocus('confirmPassword');
    if (formErrors.termsAccepted || formErrors.privacyAccepted) return setFocus('termsAccepted');
  };

  const agreementErrorMessage = errors.termsAccepted?.message || errors.privacyAccepted?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
      <Input
        label="이메일"
        type="email"
        placeholder="name@example.com…"
        autoComplete="email"
        spellCheck={false}
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
        placeholder="표시할 닉네임을 입력해 주세요…"
        autoComplete="nickname"
        spellCheck={false}
        error={errors.nickname?.message}
        {...register('nickname')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="영문, 숫자, 특수문자를 포함해 입력해 주세요…"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요…"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div
        className="space-y-2 rounded-md border border-neutral-200 p-3"
        role="group"
        aria-labelledby="signup-agreements-title"
        aria-describedby={agreementErrorMessage ? 'signup-agreements-error' : undefined}
      >
        <p id="signup-agreements-title" className="sr-only">
          약관 동의
        </p>
        <label className="flex cursor-pointer items-start gap-2 border-b border-neutral-100 pb-2 text-sm font-semibold text-neutral-800">
          <input
            type="checkbox"
            checked={isAllAgreed}
            onChange={(event) => handleAllAgreementChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span>전체 동의</span>
        </label>

        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            id="terms-accepted"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            {...register('termsAccepted')}
          />
          <label htmlFor="terms-accepted" className="flex-1 cursor-pointer">
            (필수) 이용약관 동의
          </label>
          <button
            type="button"
            onClick={() => openAgreementModal('terms')}
            className="shrink-0 underline hover:text-primary-600"
          >
            보기
          </button>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            id="privacy-accepted"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            {...register('privacyAccepted')}
          />
          <label htmlFor="privacy-accepted" className="flex-1 cursor-pointer">
            (필수) 개인정보 처리방침 동의
          </label>
          <button
            type="button"
            onClick={() => openAgreementModal('privacy')}
            className="shrink-0 underline hover:text-primary-600"
          >
            보기
          </button>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            id="marketing-accepted"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            {...register('marketingAccepted')}
          />
          <label htmlFor="marketing-accepted" className="cursor-pointer">
            (선택) 마케팅 정보 수신 동의
          </label>
        </div>

        {agreementErrorMessage && (
          <p id="signup-agreements-error" role="alert" className="text-sm text-error-600">
            {agreementErrorMessage}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={isSubmitting} size="lg">
        가입하기
      </Button>

      <Modal
        isOpen={agreementModalType !== null}
        onClose={closeAgreementModal}
        title={agreementModalType === 'privacy' ? '개인정보 처리방침' : '이용약관'}
        size="lg"
      >
        <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
          {agreementModalType === 'terms' ? (
            <>
              <h3 className="text-base font-bold text-neutral-900">제1조 (목적)</h3>
              <p>
                본 약관은 회사가 운영하는 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및
                책임사항을 규정함을 목적으로 합니다.
              </p>
              <h3 className="text-base font-bold text-neutral-900">제2조 (정의)</h3>
              <p>
                본 서비스는 중고거래 및 관련 기능을 제공하며, 회원은 본 약관에 동의하고 서비스를
                이용하는 자를 의미합니다.
              </p>
              <h3 className="text-base font-bold text-neutral-900">제3조 (약관의 효력 및 변경)</h3>
              <p>
                회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전
                공지합니다.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-neutral-900">1. 개인정보 수집 및 이용 목적</h3>
              <p>
                회원 가입 및 관리, 서비스 제공, 고객 상담 처리를 위해 필요한 개인정보를 수집하고
                이용합니다.
              </p>
              <h3 className="text-base font-bold text-neutral-900">2. 수집하는 개인정보 항목</h3>
              <p>
                필수 항목은 이메일, 비밀번호, 닉네임이며, 선택 항목은 프로필 정보 등이 포함될 수
                있습니다.
              </p>
              <h3 className="text-base font-bold text-neutral-900">3. 개인정보 보유 기간</h3>
              <p>
                수집 및 이용 목적 달성 후에는 지체 없이 파기하며, 관련 법령에 따라 보관이 필요한
                경우 해당 기간 동안 보관합니다.
              </p>
            </>
          )}

          <Button type="button" className="w-full" onClick={agreeAndCloseModal}>
            동의하고 닫기
          </Button>
        </div>
      </Modal>

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
