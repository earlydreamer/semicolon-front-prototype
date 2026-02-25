import { create } from "zustand";
import type {
  SaleStatus,
  ConditionStatus,
  ProductListItem,
} from "@/types/product";
import { shopService } from "@/services/shopService";
import { productService } from "@/services/productService";

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
  isLoading: boolean;

  addProduct: (data: ProductFormData) => Promise<SellerProduct>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSaleStatus: (id: string, status: SaleStatus) => Promise<void>;
  updateTrackingInfo: (
    id: string,
    info: { number: string; company: string },
  ) => Promise<void>;
  initSellerProducts: (status?: SaleStatus) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  hasNext: boolean;
  currentPage: number;
  activeStatus: SaleStatus | "all";

  getProductById: (id: string) => SellerProduct | undefined;
  getProductsByStatus: (status: SaleStatus | "all") => SellerProduct[];

  getStats: () => {
    total: number;
    onSale: number;
    reserved: number;
    soldOut: number;
    totalRevenue: number;
  };
}

const isUploadedImageUrl = (value: string): boolean => {
  const url = value.trim();
  return /^https?:\/\//.test(url) || url.startsWith("/api/");
};

const sanitizeImageUrls = (images: string[]): string[] =>
  images
    .map((image) => productService.normalizeImageUrl(image))
    .filter(isUploadedImageUrl);

const hasValidProductId = (id: string | undefined | null): id is string =>
  !!id && id !== "undefined" && id !== "null";

const getProductId = (item: ProductListItem): string => {
  const fallbackId = (item as ProductListItem & { id?: string }).id;
  return item.productUuid || fallbackId || "";
};

const mapToSellerProduct = (item: ProductListItem): SellerProduct => ({
  id: getProductId(item),
  categoryId: "",
  sellerId: "me",
  title: item.title,
  description: "",
  price: item.price,
  shippingFee: 0,
  conditionStatus: "NO_WEAR",
  saleStatus: item.saleStatus || "ON_SALE",
  viewCount: item.viewCount || 0,
  likeCount: item.likeCount || 0,
  commentCount: item.commentCount || 0,
  createdAt: item.createdAt || new Date().toISOString(),
  image: item.thumbnailUrl || "",
  images: item.thumbnailUrl ? [item.thumbnailUrl] : [],
  isSafe: true,
});

export const useSellerStore = create<SellerState>((set, get) => ({
  products: [],
  isLoading: false,
  hasNext: false,
  currentPage: 0,
  activeStatus: "all",

  addProduct: async (data: ProductFormData) => {
    const imageUrls = sanitizeImageUrls(data.images);
    const response = await shopService.createProduct({
      categoryId: Number(data.categoryId),
      title: data.title,
      description: data.description,
      price: data.price,
      shippingFee: data.shippingFee,
      conditionStatus: data.conditionStatus,
      imageUrls,
    });
    if (!response.productUuid) {
      throw new Error("Product UUID is missing in create response");
    }

    const newProduct: SellerProduct = {
      id: response.productUuid,
      categoryId: data.categoryId,
      sellerId: "me",
      title: data.title,
      description: data.description,
      price: data.price,
      shippingFee: data.shippingFee,
      conditionStatus: data.conditionStatus,
      saleStatus: "ON_SALE",
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      image: imageUrls[0] || "",
      images: imageUrls,
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

  updateProduct: async (id: string, data: Partial<ProductFormData>) => {
    if (!hasValidProductId(id)) return;
    const currentProduct = get().products.find((p) => p.id === id);
    if (!currentProduct) return;
    const imageUrls = sanitizeImageUrls(data.images ?? currentProduct.images);

    await shopService.updateProduct(id, {
      categoryId: Number(data.categoryId ?? currentProduct.categoryId),
      title: data.title ?? currentProduct.title,
      description: data.description ?? currentProduct.description,
      price: data.price ?? currentProduct.price,
      shippingFee: data.shippingFee ?? currentProduct.shippingFee,
      conditionStatus: data.conditionStatus ?? currentProduct.conditionStatus,
      visibilityStatus: "VISIBLE",
      imageUrls,
    });

    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              image: imageUrls[0] ?? p.image,
              images: imageUrls,
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    }));
  },

  deleteProduct: async (id: string) => {
    if (!hasValidProductId(id)) return;
    const prevProducts = get().products;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));

    try {
      await shopService.deleteProduct(id);
    } catch (error) {
      set({ products: prevProducts });
      throw error;
    }
  },

  updateSaleStatus: async (id: string, status: SaleStatus) => {
    if (!hasValidProductId(id)) return;
    const currentProduct = get().products.find((p) => p.id === id);
    if (!currentProduct) return;
    const prevProducts = get().products;

    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, saleStatus: status, updatedAt: new Date().toISOString() }
          : p,
      ),
    }));

    try {
      await shopService.updateProduct(id, {
        categoryId: Number(currentProduct.categoryId),
        title: currentProduct.title,
        description: currentProduct.description,
        price: currentProduct.price,
        shippingFee: currentProduct.shippingFee,
        conditionStatus: currentProduct.conditionStatus,
        visibilityStatus: "VISIBLE",
        imageUrls: currentProduct.images,
      });
    } catch (error) {
      set({ products: prevProducts });
      throw error;
    }
  },

  updateTrackingInfo: async (
    id: string,
    info: { number: string; company: string },
  ) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              trackingNumber: info.number,
              deliveryCompany: info.company,
              saleStatus: "SOLD_OUT",
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    }));
  },

  initSellerProducts: async (status?: SaleStatus) => {
    try {
      const activeStatus = status || "all";
      set({ isLoading: true, activeStatus, currentPage: 0 });

      const response = await shopService.getMyShopProducts({
        page: 0,
        size: 50,
        saleStatus: status,
      });

      const mapped = (response.items || []).map(mapToSellerProduct);

      set({
        products: mapped,
        hasNext: response.hasNext,
        currentPage: 0,
      });
    } catch (error) {
      console.error("Failed to initialize seller products:", error);
      set({ products: [], hasNext: false });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreProducts: async () => {
    const { currentPage, hasNext, isLoading, activeStatus } = get();
    if (!hasNext || isLoading) return;

    try {
      set({ isLoading: true });
      const nextPage = currentPage + 1;
      const response = await shopService.getMyShopProducts({
        page: nextPage,
        size: 50,
        saleStatus:
          activeStatus === "all" ? undefined : (activeStatus as SaleStatus),
      });

      const mapped = (response.items || []).map(mapToSellerProduct);

      set((state) => ({
        products: [...state.products, ...mapped],
        currentPage: nextPage,
        hasNext: response.hasNext,
      }));
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByStatus: (status: SaleStatus | "all") => {
    const products = get().products;
    if (status === "all") return products;
    return products.filter((p) => p.saleStatus === status);
  },

  getStats: () => {
    const products = get().products;
    let onSale = 0;
    let reserved = 0;
    let soldOut = 0;
    let totalRevenue = 0;

    for (const p of products) {
      if (p.saleStatus === "ON_SALE") onSale++;
      else if (p.saleStatus === "RESERVED") reserved++;
      else if (p.saleStatus === "SOLD_OUT") {
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


