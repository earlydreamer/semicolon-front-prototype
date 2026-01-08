import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  autoLogin: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

// ... (Schema definition remains same)

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      autoLogin: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    // [MOCK] API Call Simulation
    console.log('[MOCK] Login Request:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // [MOCK] Login Success
    login({
      id: 'mock-user-001',
      email: data.email,
      name: 'Mock User',
    });
    
    alert('로그인되었습니다. (Mock)');
    setIsLoading(false);
    navigate('/'); // Redirect to Home
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
        placeholder="비밀번호를 입력해주세요"
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
