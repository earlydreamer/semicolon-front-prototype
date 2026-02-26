/**
 * 내 상점 설정 페이지
 */

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import MyShopInfo from '@/components/features/seller/MyShopInfo';

const MyShopSettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <Link
          to="/seller"
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          판매 관리로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">내 상점 설정</h1>
        <p className="text-neutral-500 mt-1">상점 정보를 수정하세요</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="space-y-6">
        <MyShopInfo />
      </div>
    </div>
  );
};

export default MyShopSettingsPage;
