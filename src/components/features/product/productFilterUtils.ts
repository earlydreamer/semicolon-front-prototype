import type { SaleStatus } from '@/types/product';

export const SALE_STATUS_OPTIONS: { value: SaleStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ON_SALE', label: '판매중' },
  { value: 'RESERVED', label: '예약중' },
  { value: 'SOLD_OUT', label: '판매완료' },
];

export interface ProductFilterState {
  minPrice: number;
  maxPrice: number;
  status: SaleStatus | 'all';
  categoryId?: string;
}

export const getActiveFilterCount = (filters: ProductFilterState, showCategory = false): number => {
  return [
    showCategory && filters.categoryId,
    filters.minPrice > 0,
    filters.maxPrice > 0,
    filters.status !== 'all',
  ].filter(Boolean).length;
};
