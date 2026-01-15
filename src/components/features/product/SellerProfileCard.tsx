/**
 * 판매자 프로필 컴포넌트
 * 
 * ProductDetailPage에서 분리된 판매자 정보 표시 컴포넌트
 */

import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface Seller {
  id: string;
  nickname: string;
  avatar?: string;
  rating: number;
  activeListingCount: number;
  salesCount: number;
  intro?: string;
}

interface SellerProfileCardProps {
  seller: Seller;
}

export const SellerProfileCard = ({ seller }: SellerProfileCardProps) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
            <img 
              src={seller.avatar || `https://ui-avatars.com/api/?name=${seller.nickname}&background=random`} 
              alt={seller.nickname} 
              className="h-full w-full object-cover" 
            />
          </div>
          <div>
            <Link to={`/shop/${seller.id}`} className="font-bold text-gray-900 hover:underline">
              {seller.nickname}
            </Link>
            <div className="text-sm text-gray-500">
              상품 {seller.activeListingCount} • 판매 {seller.salesCount}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star className="h-4 w-4 fill-current" />
              {seller.rating.toFixed(1)} / 5.0
            </div>
            <div className="text-xs text-gray-400">판매자 신뢰지수</div>
          </div>
          <Link to={`/shop/${seller.id}`}>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              상점 보기
            </Button>
          </Link>
        </div>
      </div>
      {/* 판매자 소개 */}
      {seller.intro && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          {seller.intro}
        </div>
      )}
    </div>
  );
};
