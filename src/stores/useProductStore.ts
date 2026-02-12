import { create } from 'zustand';
import { productService } from '../services/productService';
import type { 
  CategoryResponse, 
  ProductListItem, 
  ProductDetailResponse,
  ProductListResponse 
} from '../types/product';

interface ProductState {
  categories: CategoryResponse[];
  featuredProducts: ProductListItem[];
  productList: ProductListResponse | null;
  currentProduct: ProductDetailResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchFeaturedProducts: (size?: number) => Promise<void>;
  fetchProducts: (params: {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortType?: 'LATEST' | 'LIKES' | 'PRICE_LOW' | 'PRICE_HIGH';
    page: number;
    size: number;
  }) => Promise<void>;
  fetchProductDetail: (productUuid: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  categories: [],
  featuredProducts: [],
  productList: null,
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Fetch categories failed:', error);
    }
  },

  fetchFeaturedProducts: async (size = 20) => {
    set({ isLoading: true, error: null }); // Clear error on retry
    try {
      const featuredProducts = await productService.getFeaturedProducts(size);
      set({ featuredProducts, isLoading: false });
    } catch {
      set({ error: '추천 상품을 불러오는데 실패했습니다.', isLoading: false });
    }
  },

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null }); // Clear error on retry
    try {
      const productList = await productService.getProducts(params);
      set({ productList, isLoading: false });
    } catch {
      set({ error: '상품 목록을 불러오는데 실패했습니다.', isLoading: false });
    }
  },

  fetchProductDetail: async (productUuid) => {
    set({ isLoading: true, currentProduct: null, error: null }); // Clear error on retry
    try {
      const currentProduct = await productService.getProductDetail(productUuid);
      set({ currentProduct, isLoading: false });
    } catch {
      set({ error: '상품 정보를 불러오는데 실패했습니다.', isLoading: false });
    }
  },
}));
