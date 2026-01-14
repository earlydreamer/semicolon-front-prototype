/**
 * 판매자 상품 관리 Store (Zustand)
 */

import { create } from 'zustand';
import { MOCK_PRODUCTS, type SaleStatus, type ConditionStatus } from '@/mocks/products';

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
  trackingNumber?: string;
  deliveryCompany?: string;
}

interface SellerState {
  products: SellerProduct[];
  
  // Actions
  addProduct: (data: ProductFormData) => SellerProduct;
  updateProduct: (id: string, data: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  updateSaleStatus: (id: string, status: SaleStatus) => void;
  updateTrackingInfo: (id: string, info: { number: string; company: string }) => void;
  initSellerProducts: (userId: string) => void;
  
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
  // 초기 상태는 빈 배열, 로그인 시 initSellerProducts 호출로 채워짐
  products: [],
  
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
   * 운송장 정보 업데이트
   */
  updateTrackingInfo: (id: string, info: { number: string; company: string }) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id 
          ? { 
              ...p, 
              trackingNumber: info.number, 
              deliveryCompany: info.company,
              saleStatus: 'SOLD_OUT', // 운송장 입력 시 판매완료(배송중) 처리
              updatedAt: new Date().toISOString() 
            } 
          : p
      ),
    }));
  }, // Added missing comma here
  /**
   * 유저별 판매 상품 초기화
   */
  initSellerProducts: (userId: string) => {
    const userProducts = MOCK_PRODUCTS.filter(p => p.seller.userId === userId);
    set({
      products: userProducts.map(p => ({
        ...p,
        // SellerProduct 인터페이스에 맞게 변환 (필요한 경우)
      })) as SellerProduct[]
    });
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
