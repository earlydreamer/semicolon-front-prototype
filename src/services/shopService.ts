import api from "../utils/api";
import { API_ENDPOINTS, API_BASE_URL } from "../constants/apiEndpoints";
import type {
  SaleStatus,
  ProductListItem,
  ConditionStatus,
  VisibilityStatus,
  ProductDetailResponse,
} from "../types/product";

const unwrapProductDetail = (payload: unknown): ProductDetailResponse => {
  const direct = payload as ProductDetailResponse;
  if (direct && typeof direct === "object" && "productUuid" in direct) {
    return direct;
  }

  const wrapped = payload as { data?: ProductDetailResponse };
  if (
    wrapped?.data &&
    typeof wrapped.data === "object" &&
    "productUuid" in wrapped.data
  ) {
    return wrapped.data;
  }

  throw new Error("Unexpected createProduct response shape");
};

export interface ProductCreateRequest {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  imageUrls: string[];
  tags?: string[];
}

export interface ProductUpdateRequest {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  visibilityStatus: VisibilityStatus;
  imageUrls: string[];
  tags?: string[];
}

export interface ShopResponse {
  shopUuid: string;
  sellerUuid: string;
  nickname: string;
  intro: string;
  salesCount: number;
  activeListingCount: number;
  averageRating: number;
  reviewCount: number;
}

export interface ShopProductListResponse {
  items: ProductListItem[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
}

export const shopService = {
  getMyShop: async (): Promise<ShopResponse> => {
    const response = await api.get<ShopResponse>(API_ENDPOINTS.SHOPS.ME);
    return response.data;
  },

  getShop: async (shopUuid: string): Promise<ShopResponse> => {
    const response = await api.get<ShopResponse>(
      `${API_ENDPOINTS.SHOPS.BASE}/${shopUuid}`,
    );
    return response.data;
  },

  getShopProducts: async (
    shopUuid: string,
    params?: { saleStatus?: SaleStatus; page?: number; size?: number },
  ): Promise<ShopProductListResponse> => {
    const response = await api.get<ShopProductListResponse>(
      `${API_ENDPOINTS.SHOPS.BASE}/${shopUuid}/products`,
      { params },
    );
    return response.data;
  },

  getMyShopProducts: async (params?: {
    saleStatus?: SaleStatus;
    page?: number;
    size?: number;
  }): Promise<ShopProductListResponse> => {
    const response = await api.get<ShopProductListResponse>(
      `${API_ENDPOINTS.SHOPS.ME}/products`,
      {
        params,
      },
    );
    return response.data;
  },

  createProduct: async (
    data: ProductCreateRequest,
  ): Promise<ProductDetailResponse> => {
    const response = await api.post(`${API_BASE_URL}/seller/products`, data);
    return unwrapProductDetail(response.data);
  },

  updateProduct: async (
    productUuid: string,
    data: ProductUpdateRequest,
  ): Promise<void> => {
    await api.patch(`${API_BASE_URL}/seller/products/${productUuid}`, data);
  },

  deleteProduct: async (productUuid: string): Promise<void> => {
    await api.delete(`${API_BASE_URL}/seller/products/${productUuid}`);
  },
};
