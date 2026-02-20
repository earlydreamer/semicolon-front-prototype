import { useCallback, useEffect, useMemo, useState } from 'react';
import Search from 'lucide-react/dist/esm/icons/search';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { formatPrice } from '@/utils/formatPrice';
import { SALE_STATUS_LABELS } from '@/constants';
import { useToast } from '@/components/common/Toast';
import { adminService } from '@/services/adminService';
import type { AdminProductListItem } from '@/types/admin';
import type { SaleStatus } from '@/types/product';
import { Button } from '@/components/common/Button';

type FilterStatus = 'all' | SaleStatus;

const STATUS_COLORS: Record<SaleStatus, string> = {
  ON_SALE: 'bg-green-100 text-green-700',
  RESERVED: 'bg-yellow-100 text-yellow-700',
  SOLD_OUT: 'bg-neutral-100 text-neutral-700',
};

const parseDate = (value: string) => {
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const AdminProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await adminService.getAdminProducts({
        page: 0,
        size: 100,
        keyword: debouncedQuery || undefined,
      });
      setProducts(response.items ?? []);
      setTotalCount(response.totalCount ?? response.items.length);
    } catch (error) {
      console.error('Failed to load admin products:', error);
      setErrorMessage('상품 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!openMenuId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-admin-product-menu]')) {
        setOpenMenuId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenuId]);

  const filteredProducts = useMemo(() => {
    if (filterStatus === 'all') return products;
    return products.filter((product) => product.saleStatus === filterStatus);
  }, [filterStatus, products]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      <div className="p-4 border-b border-neutral-200 space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
            <p>
              상품 조회는 실데이터 연동 완료되었습니다. 판매 정지/삭제는 관리자 API 미구현으로 준비중입니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="admin-product-search" className="sr-only">
              상품명 검색
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              id="admin-product-search"
              name="q"
              type="search"
              placeholder="상품명 검색…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <label htmlFor="admin-product-status-filter" className="sr-only">
            상태 필터
          </label>
          <select
            id="admin-product-status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="ON_SALE">판매중</option>
            <option value="RESERVED">예약중</option>
            <option value="SOLD_OUT">판매완료</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-neutral-500" role="status" aria-live="polite">
          상품 목록을 불러오는 중입니다…
        </div>
      ) : errorMessage ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <Button variant="outline" onClick={() => void loadProducts()}>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상품</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">판매자</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">가격</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">상태</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase px-4 py-3">등록일</th>
                  <th className="text-right text-xs font-medium text-neutral-500 uppercase px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => (
                  <tr key={product.productUuid} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnailUrl ? (
                          <img
                            src={product.thumbnailUrl}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-neutral-100" aria-hidden="true" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-xs text-neutral-500">UUID: {product.productUuid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-900">{product.sellerNickname || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-900">
                        {formatPrice(product.price)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[product.saleStatus as SaleStatus] || STATUS_COLORS.ON_SALE}`}>
                        {SALE_STATUS_LABELS[product.saleStatus as SaleStatus] || product.saleStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-500">
                        {product.createdAt
                          ? (parseDate(product.createdAt)?.toLocaleDateString('ko-KR') ?? '-')
                          : '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block" data-admin-product-menu>
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === product.productUuid ? null : product.productUuid)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label={`${product.title} 관리 메뉴 열기`}
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === product.productUuid}
                          aria-controls={`admin-product-menu-${product.productUuid}`}
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                        </button>

                        {openMenuId === product.productUuid && (
                          <div
                            id={`admin-product-menu-${product.productUuid}`}
                            role="menu"
                            aria-label={`${product.title} 관리 메뉴`}
                            className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-neutral-200 z-10"
                          >
                            <a
                              href={`/products/${product.productUuid}`}
                              target="_blank"
                              rel="noreferrer"
                              role="menuitem"
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                              상품 보기
                            </a>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                showToast('판매 정지 API가 아직 구현되지 않았습니다.', 'info');
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-neutral-50"
                            >
                              <Pause className="w-4 h-4" aria-hidden="true" />
                              판매 정지
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                showToast('상품 삭제 API가 아직 구현되지 않았습니다.', 'info');
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              검색 결과가 없습니다.
            </div>
          )}

          <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              총 {new Intl.NumberFormat('ko-KR').format(totalCount)}개 상품
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductList;
