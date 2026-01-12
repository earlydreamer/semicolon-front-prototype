/**
 * 판매자 상품 관리 Store (Zustand)
 */

import { create } from 'zustand';
import type { SaleStatus, ConditionStatus } from '@/mocks/products';
import { MOCK_SALES_PRODUCTS } from '@/mocks/users';

// 상품 등록/수정 폼 데이터
export interface ProductFormData {
  title: string;
  categoryId: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  purchaseDate?: string;
  usePeriod?: string;
  detailedCondition?: string;
  description: string;
  images: string[];
}

// 판매자 상품 (Product 타입과 유사하지만 seller 정보 제외)
export interface SellerProduct {
  id: string;
  categoryId: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  saleStatus: SaleStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  image: string;
  images: string[];
  isSafe: boolean;
  purchaseDate?: string;
  usePeriod?: string;
  detailedCondition?: string;
}

interface SellerState {
  products: SellerProduct[];
  
  // Actions
  addProduct: (data: ProductFormData) => SellerProduct;
  updateProduct: (id: string, data: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  updateSaleStatus: (id: string, status: SaleStatus) => void;
  
  // Getters
  getProductById: (id: string) => SellerProduct | undefined;
  getProductsByStatus: (status: SaleStatus | 'all') => SellerProduct[];
  
  // Stats
  getStats: () => {
    total: number;
    onSale: number;
    reserved: number;
    soldOut: number;
    totalRevenue: number;
  };
}

export const useSellerStore = create<SellerState>((set, get) => ({
  // 초기 Mock 데이터
  products: MOCK_SALES_PRODUCTS.map(p => ({
    ...p,
    conditionStatus: p.conditionStatus as ConditionStatus,
    saleStatus: p.saleStatus as SaleStatus,
  })) as SellerProduct[],
  
  /**
   * 상품 등록
   */
  addProduct: (data: ProductFormData) => {
    const newProduct: SellerProduct = {
      id: `product-${Date.now()}`,
      categoryId: data.categoryId,
      sellerId: 'u1', // 현재 유저
      title: data.title,
      description: data.description,
      price: data.price,
      shippingFee: data.shippingFee,
      conditionStatus: data.conditionStatus,
      saleStatus: 'ON_SALE',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      image: data.images[0] || '',
      images: data.images,
      isSafe: true,
      purchaseDate: data.purchaseDate,
      usePeriod: data.usePeriod,
      detailedCondition: data.detailedCondition,
    };
    
    set((state) => ({
      products: [newProduct, ...state.products],
    }));
    
    return newProduct;
  },
  
  /**
   * 상품 수정
   */
  updateProduct: (id: string, data: Partial<ProductFormData>) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              image: data.images?.[0] ?? p.image,
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  },
  
  /**
   * 상품 삭제
   */
  deleteProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
  
  /**
   * 판매 상태 변경
   */
  updateSaleStatus: (id: string, status: SaleStatus) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, saleStatus: status, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },
  
  /**
   * ID로 상품 조회
   */
  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },
  
  /**
   * 상태별 상품 조회
   */
  getProductsByStatus: (status: SaleStatus | 'all') => {
    const products = get().products;
    if (status === 'all') return products;
    return products.filter((p) => p.saleStatus === status);
  },
  
  /**
   * 통계 조회
   */
  getStats: () => {
    const products = get().products;
    const soldProducts = products.filter((p) => p.saleStatus === 'SOLD_OUT');
    
    return {
      total: products.length,
      onSale: products.filter((p) => p.saleStatus === 'ON_SALE').length,
      reserved: products.filter((p) => p.saleStatus === 'RESERVED').length,
      soldOut: soldProducts.length,
      totalRevenue: soldProducts.reduce((sum, p) => sum + p.price, 0),
    };
  },
}));
