import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import { sanitizeUrlParam, isValidId } from '../utils/sanitize';

import ShopHeader from '../components/features/shop/ShopHeader';
import ShopStats from '../components/features/shop/ShopStats';
import ShopProductList from '../components/features/shop/ShopProductList';
import { ReviewList } from '../components/features/review/ReviewList';
import type { ProductListItem } from '@/types/product';
import type { Review } from '@/components/features/review/ReviewCard';
import { shopService } from '@/services/shopService';
import { reviewService } from '@/services/reviewService';
import { followService } from '@/services/followService';

type TabType = 'all' | 'ON_SALE' | 'RESERVED' | 'SOLD_OUT';

const TABS: { key: TabType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'ON_SALE', label: '판매중' },
  { key: 'RESERVED', label: '예약중' },
  { key: 'SOLD_OUT', label: '판매완료' },
];

const ShopPage = () => {
  const { shopId: rawShopId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [shop, setShop] = useState<{ shopUuid: string; nickname: string; intro?: string } | null>(null);
  const [shopProducts, setShopProducts] = useState<ProductListItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const shopId = sanitizeUrlParam(rawShopId);

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId || !isValidId(shopId)) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [shopRes, reviewRes, reviewSummary, followers, productRes] = await Promise.all([
          shopService.getShop(shopId),
          reviewService.getSellerReviews(shopId, { page: 0, size: 20 }),
          reviewService.getSellerReviewSummary(shopId),
          followService.getSellerFollowers(shopId),
          shopService.getShopProducts(shopId, { page: 0, size: 100 }),
        ]);

        setShop({
          shopUuid: shopRes.shopUuid,
          nickname: `${shopRes.shopUuid.slice(0, 8)} 상점`,
          intro: shopRes.intro,
        });

        setShopProducts(productRes.items || []);
        setFollowerCount(followers.length);
        setRating(reviewSummary.avgRating || 0);

        const mappedReviews: Review[] = (reviewRes.items || []).map((item) => ({
          id: item.reviewUuid,
          rating: item.rating,
          content: item.content,
          buyer: {
            nickname: item.buyerUuid.slice(0, 8),
          },
          productTitle: `상품 ${item.productUuid.slice(0, 8)}`,
          createdAt: item.createdAt,
        }));

        setReviews(mappedReviews);
      } catch (error) {
        console.error('Failed to load shop page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [shopId]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, ON_SALE: 0, RESERVED: 0, SOLD_OUT: 0 };
    for (const p of shopProducts) {
      counts.all++;
      if (p.saleStatus === 'ON_SALE') counts.ON_SALE++;
      else if (p.saleStatus === 'RESERVED') counts.RESERVED++;
      else if (p.saleStatus === 'SOLD_OUT') counts.SOLD_OUT++;
    }
    return counts;
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return shopProducts;
    return shopProducts.filter((p) => p.saleStatus === activeTab);
  }, [shopProducts, activeTab]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">로딩중...</div>;
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-16">
        <p className="text-lg text-neutral-500 mb-4">상점을 찾을 수 없습니다</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 pb-20">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft className="w-4 h-4" />
          돌아가기
        </Link>

        <ShopHeader shop={shop} />

        <ShopStats
          salesCount={statusCounts.SOLD_OUT}
          activeListingCount={statusCounts.ON_SALE}
          followerCount={followerCount}
          rating={rating}
        />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="flex border-b border-neutral-200 bg-neutral-50">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-primary-600 bg-white'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
                <span className={`ml-1 text-xs ${
                  activeTab === tab.key ? 'text-primary-500' : 'text-neutral-400'
                }`}>
                  {statusCounts[tab.key]}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            <ShopProductList
              products={filteredProducts}
              shopName={shop.nickname}
              statusFilter={activeTab === 'all' ? 'ON_SALE' : activeTab}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-lg font-semibold text-neutral-900">거래 후기</h2>
          </div>
          <div className="p-4">
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
