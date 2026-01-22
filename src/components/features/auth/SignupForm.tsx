import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { useNavigate } from 'react-router-dom';

const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        '영문, 숫자, 특수문자를 포함해야 합니다.'
      ),
    confirmPassword: z.string(),
    name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
    phone: z
      .string()
      .regex(/^01[0-9]\d{7,8}$/, '올바른 휴대폰 번호 형식이 아닙니다. (- 제외)'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);
    // Mock API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('[MOCK] Signup attempt:', data);
    setIsModalOpen(true);
    setIsLoading(false);
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
        label="이름"
        placeholder="홍길동"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="휴대폰 번호"
        placeholder="01012345678"
        helperText="- 없이 숫자만 입력해주세요"
        error={errors.phone?.message}
        maxLength={11}
        {...register('phone')}
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
        placeholder="비밀번호를 다시 입력해주세요"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      
      <Button type="submit" className="w-full mt-6" isLoading={isLoading} size="lg">
        가입하기
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/login');
        }}
        title="가입 완료"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-xl font-bold">✓</span>
          </div>
          <p className="text-neutral-700 font-medium mb-6">
            회원가입이 성공적으로 완료되었습니다!
          </p>
          <Button 
            onClick={() => {
              setIsModalOpen(false);
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
