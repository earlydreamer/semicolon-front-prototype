/**
 * 관리자 로그인 페이지
 * 
 * [IMPORTANT] 보안 관련 주의사항
 * - 현재는 프론트엔드 Mock 처리로 임시 구현
 * - 실제 프로덕션에서는 다음 사항 필수 적용:
 *   1. 별도 서브도메인(admin.example.com)으로 분리
 *   2. 백엔드 API 레벨 권한 검사 (JWT 토큰 기반)
 *   3. IP 화이트리스트, 2FA 등 추가 보안 레이어
 *   4. 프론트엔드 가드만으로는 보안 불충분 (API 직접 호출 방지 불가)
 * 
 * [MOCK] 테스트 계정: admin / admin123
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/stores/useAuthStore';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const AdminLoginPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { adminLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // [MOCK] 0.5초 딜레이 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = adminLogin(adminId, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('관리자 계정 정보가 올바르지 않습니다.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
          <p className="text-neutral-400 mt-2">덕쿠 관리자 페이지</p>
        </div>

        {/* 보안 경고 */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">⚠️ 개발 환경 (Mock)</p>
              <p className="text-yellow-300/70">
                테스트 계정: admin / admin123
              </p>
            </div>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-6 shadow-xl">
          <div className="space-y-4">
            <Input
              label="관리자 ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="관리자 ID를 입력하세요"
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
            />
            <Input
              type="password"
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
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
