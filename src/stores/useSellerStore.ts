import { create } from 'zustand';
import type { SaleStatus, ConditionStatus } from '@/types/product';
import { shopService } from '@/services/shopService';

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

  addProduct: (data: ProductFormData) => SellerProduct;
  updateProduct: (id: string, data: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  updateSaleStatus: (id: string, status: SaleStatus) => void;
  updateTrackingInfo: (id: string, info: { number: string; company: string }) => void;
  initSellerProducts: (userId: string) => Promise<void>;

  getProductById: (id: string) => SellerProduct | undefined;
  getProductsByStatus: (status: SaleStatus | 'all') => SellerProduct[];

  getStats: () => {
    total: number;
    onSale: number;
    reserved: number;
    soldOut: number;
    totalRevenue: number;
  };
}

export const useSellerStore = create<SellerState>((set, get) => ({
  products: [],

  addProduct: (data: ProductFormData) => {
    const newProduct: SellerProduct = {
      id: `product-${Date.now()}`,
      categoryId: data.categoryId,
      sellerId: 'me',
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
          : p,
      ),
    }));
  },

  deleteProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  updateSaleStatus: (id: string, status: SaleStatus) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, saleStatus: status, updatedAt: new Date().toISOString() } : p,
      ),
    }));
  },

  updateTrackingInfo: (id: string, info: { number: string; company: string }) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              trackingNumber: info.number,
              deliveryCompany: info.company,
              saleStatus: 'SOLD_OUT',
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    }));
  },

  initSellerProducts: async () => {
    try {
      const response = await shopService.getMyShopProducts({ page: 0, size: 100 });
      const mapped: SellerProduct[] = (response.items || []).map((item) => ({
        id: item.productUuid,
        categoryId: '',
        sellerId: 'me',
        title: item.title,
        description: '',
        price: item.price,
        shippingFee: 0,
        conditionStatus: 'NO_WEAR',
        saleStatus: item.saleStatus || 'ON_SALE',
        viewCount: item.viewCount || 0,
        likeCount: item.likeCount || 0,
        commentCount: item.commentCount || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        image: item.thumbnailUrl || '',
        images: item.thumbnailUrl ? [item.thumbnailUrl] : [],
        isSafe: true,
      }));

      set({ products: mapped });
    } catch (error) {
      console.error('Failed to initialize seller products:', error);
      set({ products: [] });
    }
  },

  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByStatus: (status: SaleStatus | 'all') => {
    const products = get().products;
    if (status === 'all') return products;
    return products.filter((p) => p.saleStatus === status);
  },

  getStats: () => {
    const products = get().products;
    let onSale = 0;
    let reserved = 0;
    let soldOut = 0;
    let totalRevenue = 0;

    for (const p of products) {
      if (p.saleStatus === 'ON_SALE') onSale++;
      else if (p.saleStatus === 'RESERVED') reserved++;
      else if (p.saleStatus === 'SOLD_OUT') {
        soldOut++;
        totalRevenue += p.price;
      }
    }

    return {
      total: products.length,
      onSale,
      reserved,
      soldOut,
      totalRevenue,
    };
  },
}));
