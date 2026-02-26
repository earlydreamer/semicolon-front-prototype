import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const loginSchema = z.object({
  loginId: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  autoLogin: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/components/common/Toast';
import { useLikeStore } from '@/stores/useLikeStore';
import { useFollowStore } from '@/stores/useFollowStore';
import { useSellerStore } from '@/stores/useSellerStore';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToast();
  const initUserLikes = useLikeStore((state) => state.initUserLikes);
  const initFollowing = useFollowStore((state) => state.initFollowing);
  const initSellerProducts = useSellerStore((state) => state.initSellerProducts);

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
    
    try {
      const result = await login(data.loginId, data.password);
      
      if (result.success) {
        // 유저별 초기 데이터(찜, 팔로우) 로드
        const { user } = useAuthStore.getState();
        if (user) {
          initUserLikes(user.id);
          initFollowing(user.id);
          initSellerProducts(user.id);
        }
        
        showToast('로그인 성공', 'success');
        navigate('/');
      } else {
        showToast(result.message || 'ID 또는 비밀번호를 확인해주세요.', 'error');
      }
    } catch (error) {
      showToast('로그인 중 문제가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="아이디"
        type="text"
        placeholder="user1 ~ user20"
        error={errors.loginId?.message}
        {...register('loginId')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="testuser (테스트용)"
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
