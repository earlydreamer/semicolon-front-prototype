import { useState, useMemo, useCallback, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/components/common/Toast';
import type { AdminProductListItem } from '@/types/admin';
import type { SaleStatus } from '@/types/product';

export type FilterStatus = 'all' | SaleStatus;

export const useAdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  // 검색 쿼리 디바운싱
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
      setErrorMessage('상품 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // 외부 클릭 시 메뉴 닫기
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

  const toggleMenu = useCallback((productId: string) => {
    setOpenMenuId((prev) => (prev === productId ? null : productId));
  }, []);

  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  const suspendProduct = useCallback(async (productUuid: string) => {
    try {
      await adminService.suspendAdminProduct(productUuid);
      showToast('상품 판매가 정지되었습니다.', 'success');
      void loadProducts();
    } catch (error) {
      showToast('상품 정지에 실패했습니다.', 'error');
      console.error(error);
    }
  }, [loadProducts, showToast]);

  const deleteProduct = useCallback(async (productUuid: string) => {
    try {
      await adminService.deleteAdminProduct(productUuid);
      showToast('상품이 삭제되었습니다.', 'success');
      void loadProducts();
    } catch (error) {
      showToast('상품 삭제에 실패했습니다.', 'error');
      console.error(error);
    }
  }, [loadProducts, showToast]);

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    products: filteredProducts,
    totalCount,
    openMenuId,
    isLoading,
    errorMessage,
    loadProducts,
    toggleMenu,
    closeMenu,
    showToast,
    suspendProduct,
    deleteProduct,
  };
};
