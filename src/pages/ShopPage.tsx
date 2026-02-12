import { useState, useEffect } from 'react';
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
const PAGE_SIZE = 20;

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
  const [statusCounts, setStatusCounts] = useState<Record<TabType, number>>({
    all: 0,
    ON_SALE: 0,
    RESERVED: 0,
    SOLD_OUT: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const shopId = sanitizeUrlParam(rawShopId);

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId || !isValidId(shopId)) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [shopRes, reviewRes, reviewSummary, followers] = await Promise.all([
          shopService.getShop(shopId),
          reviewService.getSellerReviews(shopId, { page: 0, size: 20 }),
          reviewService.getSellerReviewSummary(shopId),
          followService.getSellerFollowers(shopId),
        ]);

        setShop({
          shopUuid: shopRes.shopUuid,
          nickname: `${shopRes.shopUuid.slice(0, 8)} 상점`,
          intro: shopRes.intro,
        });

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

  useEffect(() => {
    const loadCounts = async () => {
      if (!shopId || !isValidId(shopId)) return;
      try {
        const [allRes, onSaleRes, reservedRes, soldOutRes] = await Promise.all([
          shopService.getShopProducts(shopId, { page: 0, size: 1 }),
          shopService.getShopProducts(shopId, { saleStatus: 'ON_SALE', page: 0, size: 1 }),
          shopService.getShopProducts(shopId, { saleStatus: 'RESERVED', page: 0, size: 1 }),
          shopService.getShopProducts(shopId, { saleStatus: 'SOLD_OUT', page: 0, size: 1 }),
        ]);

        setStatusCounts({
          all: allRes.totalCount ?? 0,
          ON_SALE: onSaleRes.totalCount ?? 0,
          RESERVED: reservedRes.totalCount ?? 0,
          SOLD_OUT: soldOutRes.totalCount ?? 0,
        });
      } catch (error) {
        console.error('Failed to load shop product counts:', error);
      }
    };

    loadCounts();
  }, [shopId]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!shopId || !isValidId(shopId)) return;
      setProductsLoading(true);
      setShopProducts([]);
      try {
        const response = await shopService.getShopProducts(shopId, {
          saleStatus: activeTab === 'all' ? undefined : activeTab,
          page: 0,
          size: PAGE_SIZE,
        });

        setShopProducts(response.items || []);
        setPage(response.page ?? 0);
        setHasNext(response.hasNext ?? false);
      } catch (error) {
        console.error('Failed to load shop products:', error);
        setShopProducts([]);
        setHasNext(false);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [shopId, activeTab]);

  const handleLoadMore = async () => {
    if (!shopId || !hasNext || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const response = await shopService.getShopProducts(shopId, {
        saleStatus: activeTab === 'all' ? undefined : activeTab,
        page: page + 1,
        size: PAGE_SIZE,
      });

      setShopProducts((prev) => [...prev, ...(response.items || [])]);
      setPage(response.page ?? page + 1);
      setHasNext(response.hasNext ?? false);
    } catch (error) {
      console.error('Failed to load more shop products:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

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
    <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-6xl space-y-5 px-3 min-[360px]:space-y-6 min-[360px]:px-4">
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

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex overflow-x-auto border-b border-neutral-200 bg-neutral-50 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative min-w-[84px] flex-1 py-3 text-xs font-medium transition-colors min-[360px]:text-sm ${
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
              products={shopProducts}
              shopName={shop.nickname}
              statusFilter={activeTab === 'all' ? 'ON_SALE' : activeTab}
            />
            {productsLoading && <div className="py-6 text-center text-sm text-neutral-500">불러오는 중...</div>}
            {hasNext && !productsLoading && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetchingMore}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                >
                  {isFetchingMore ? '불러오는 중...' : '더보기'}
                </button>
              </div>
            )}
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
