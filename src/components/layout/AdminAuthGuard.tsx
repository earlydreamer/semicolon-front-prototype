/**
 * 관리자 인증 가드 컴포넌트
 * 
 * [IMPORTANT] 보안 관련 주의사항
 * - 이 가드는 프론트엔드에서만 동작하는 임시 보호막입니다.
 * - 실제 보안은 백엔드 API 레벨에서 필수 구현해야 합니다.
 * - 악의적인 사용자는 브라우저 개발자 도구로 이 가드를 우회할 수 있습니다.
 * 
 * [TODO] 프로덕션 배포 전 필수 작업:
 * 1. 관리자 페이지를 별도 서브도메인(admin.example.com)으로 분리
 * 2. 백엔드 API 모든 관리자 엔드포인트에 권한 검사 미들웨어 적용
 * 3. JWT 토큰 기반 인증, 토큰 만료 시간 설정
 * 4. 선택적: IP 화이트리스트, 2FA, 로그인 시도 제한
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const AdminAuthGuard = () => {
  const { isAdminAuthenticated } = useAuthStore();
  const location = useLocation();

  // 관리자 인증이 안 되어 있으면 관리자 로그인 페이지로 리다이렉트
  if (!isAdminAuthenticated) {
    // 현재 위치를 state로 저장해서 로그인 후 원래 페이지로 복귀 가능하게 함
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminAuthGuard;
