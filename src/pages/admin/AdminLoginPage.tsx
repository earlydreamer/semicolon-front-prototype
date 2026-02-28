/**
 * 관리자 로그인 페이지
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/stores/useAuthStore';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { loginAdmin, logout } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAdmin({ email, password }, autoLogin);
      const { isAdminAuthenticated } = useAuthStore.getState();

      if (!isAdminAuthenticated) {
        logout();
        setError('관리자 권한이 없는 계정입니다.');
        return;
      }

      navigate('/admin');
    } catch (loginError) {
      console.error('관리자 로그인 실패:', loginError);
      setError('로그인 정보가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
          <p className="text-neutral-400 mt-2">덕쿠 관리자 페이지</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} noValidate className="bg-neutral-800 rounded-xl p-6 shadow-xl">
          <div className="space-y-4">
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일을 입력해 주세요…"
              autoComplete="username"
              spellCheck={false}
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
            />
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요…"
              autoComplete="current-password"
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
            />
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-500 bg-neutral-700 text-primary-500 focus:ring-primary-500"
              />
              자동 로그인
            </label>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400" role="alert" aria-live="polite">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full mt-6"
            size="lg"
            isLoading={isLoading}
          >
            로그인
          </Button>
        </form>

        {/* 푸터 */}
        <p className="text-center text-neutral-500 text-sm mt-6">
          일반 사용자 페이지로{' '}
          <Link to="/" className="text-primary-400 hover:underline">
            돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;

