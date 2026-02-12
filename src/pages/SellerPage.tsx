/**
 * 판매 관리 페이지
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import SellerDashboard from '@/components/features/seller/SellerDashboard';
import SellerProductList from '@/components/features/seller/SellerProductList';

const SellerPage = () => {
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
    <div className="container mx-auto max-w-4xl px-3 py-5 min-[360px]:px-4 min-[360px]:py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">판매 관리</h1>
        <p className="text-neutral-500 mt-1">상품을 등록하고 판매 현황을 관리하세요</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="space-y-6">
        <SellerDashboard />
        <SellerProductList />
      </div>
    </div>
  );
};

export default SellerPage;
