/**
 * 판매자 상품 카드 (판매자 관리용)
 */

import { Link } from 'react-router-dom';
import { Eye, Heart, MessageCircle, MoreVertical } from 'lucide-react';
import type { SaleStatus } from '@/mocks/products';
import { useSellerStore } from '@/stores/useSellerStore';
import { useToast } from '@/components/common/Toast';
import { useState, useRef, useEffect } from 'react';

interface SellerProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    saleStatus: SaleStatus;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
  };
}

const STATUS_LABELS: Record<SaleStatus, { text: string; className: string }> = {
  ON_SALE: { text: '판매중', className: 'bg-blue-100 text-blue-700' },
  RESERVED: { text: '예약중', className: 'bg-yellow-100 text-yellow-700' },
  SOLD_OUT: { text: '판매완료', className: 'bg-green-100 text-green-700' },
  HIDDEN: { text: '숨김', className: 'bg-neutral-100 text-neutral-700' },
  BLOCKED: { text: '차단됨', className: 'bg-red-100 text-red-700' },
};

const SellerProductCard = ({ product }: SellerProductCardProps) => {
  const { updateSaleStatus, deleteProduct } = useSellerStore();
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (status: SaleStatus) => {
    updateSaleStatus(product.id, status);
    showToast(`상태가 '${STATUS_LABELS[status].text}'(으)로 변경되었습니다`);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProduct(product.id);
      showToast('상품이 삭제되었습니다', 'error');
    }
    setShowMenu(false);
  };

  const statusLabel = STATUS_LABELS[product.saleStatus];
  const timeAgo = getTimeAgo(product.createdAt);

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
      {/* 이미지 */}
      <Link 
        to={`/products/${product.id}`}
        className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.id}`} className="flex-1 min-w-0">
            <h4 className="font-medium text-neutral-900 truncate hover:text-primary-600">
              {product.title}
            </h4>
          </Link>
          
          {/* 더보기 메뉴 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                <Link
                  to={`/seller/products/${product.id}/edit`}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  수정
                </Link>
                {product.saleStatus !== 'ON_SALE' && (
                  <button
                    onClick={() => handleStatusChange('ON_SALE')}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-neutral-100"
                  >
                    판매중으로 변경
                  </button>
                )}
                {product.saleStatus !== 'RESERVED' && (
                  <button
                    onClick={() => handleStatusChange('RESERVED')}
                    className="w-full text-left px-3 py-2 text-sm text-yellow-600 hover:bg-neutral-100"
                  >
                    예약중으로 변경
                  </button>
                )}
                {product.saleStatus !== 'SOLD_OUT' && (
                  <button
                    onClick={() => handleStatusChange('SOLD_OUT')}
                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-neutral-100"
                  >
                    판매완료로 변경
                  </button>
                )}
                <hr className="my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-sm text-error-600 hover:bg-neutral-100"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusLabel.className}`}>
            {statusLabel.text}
          </span>
          <span className="text-sm font-bold text-neutral-900">
            {product.price.toLocaleString()}원
          </span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {product.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {product.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {product.commentCount}
          </span>
          <span className="ml-auto">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

// 시간 포맷 헬퍼
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default SellerProductCard;
