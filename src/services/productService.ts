import api from "../utils/api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type {
  CategoryResponse,
  ProductListResponse,
  ProductListItem,
  ProductDetailResponse,
  PresignedUrlResponse,
  ImageUploadResponse,
} from "../types/product";
import axios from "axios";

const resolveApiOrigin = (): string => {
  const configured = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  if (configured && configured !== "/") {
    return configured.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location.hostname === "dukku.shop") {
    return "https://api.dukku.shop";
  }

  return "";
};

const API_ORIGIN = resolveApiOrigin();

export const productService = {
  /**
   * 카테고리 목록을 조회합니다.
   */
  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
    );
    return response.data;
  },

  /**
   * 추천 상품 목록을 조회합니다.
   */
  getFeaturedProducts: async (size = 20): Promise<ProductListItem[]> => {
    const response = await api.get<ProductListItem[]>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/featured`,
      {
        params: { size },
      },
    );
    return response.data;
  },

  /**
   * 상품 목록을 조회합니다.
   */
  getProducts: async (params: {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortType?: "LATEST" | "LIKES" | "PRICE_LOW" | "PRICE_HIGH";
    page: number;
    size: number;
  }): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(
      API_ENDPOINTS.PRODUCTS.BASE,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * 상품 상세 정보를 조회합니다.
   */
  getProductDetail: async (
    productUuid: string,
  ): Promise<ProductDetailResponse> => {
    const response = await api.get<ProductDetailResponse>(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${productUuid}`,
    );
    return response.data;
  },

  /**
   * S3 업로드를 위한 Presigned URL을 요청합니다.
   */
  getPresignedUrl: async (extension: string): Promise<string> => {
    const response = await api.get<PresignedUrlResponse>(
      API_ENDPOINTS.PRODUCTS.IMAGE_PRESIGNED_URL,
      {
        params: { extension },
      },
    );

    const payload = response.data;
    const presignedUrl = payload.presignedUrl ?? payload.url;

    if (!presignedUrl) {
      throw new Error("Presigned URL is missing in response");
    }

    return presignedUrl;
  },

  /**
   * S3에 파일을 직접 업로드합니다.
   */
  uploadImageToS3: async (
    presignedUrl: string,
    file: File,
    contentType?: string,
  ): Promise<void> => {
    if (!presignedUrl || presignedUrl === "undefined") {
      throw new Error("Invalid presigned URL");
    }

    // Presigned URL은 axios 인스턴스(공통 설정/인증 헤더 포함) 대신
    // 기본 axios를 사용하여 헤더 충돌을 방지합니다.
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": contentType || file.type || "application/octet-stream",
      },
    });
  },

  uploadImageViaBackend: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ImageUploadResponse>(
      API_ENDPOINTS.PRODUCTS.IMAGE_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.url;
  },

  buildPublicImageUrl: (key: string): string => {
    return `${API_ORIGIN}${API_ENDPOINTS.PRODUCTS.IMAGE_PUBLIC}?key=${encodeURIComponent(key)}`;
  },

  normalizeImageUrl: (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) {
      return trimmed;
    }

    if (
      trimmed.startsWith("/api/") ||
      /^https?:\/\//i.test(trimmed) ||
      trimmed.startsWith("blob:")
    ) {
      return trimmed;
    }

    if (trimmed.startsWith("products/")) {
      return productService.buildPublicImageUrl(trimmed);
    }

    if (/^[^/]+\.(s3\.)[a-z0-9-]+\.amazonaws\.com\/products\//i.test(trimmed)) {
      const withScheme = `https://${trimmed}`;
      const key = productService.extractImageKey(withScheme);
      return key ? productService.buildPublicImageUrl(key) : withScheme;
    }

    return trimmed;
  },

  extractImageKey: (url: string): string | null => {
    try {
      const parsed = new URL(url, window.location.origin);

      if (parsed.pathname === "/api/v1/products/images/public") {
        const key = parsed.searchParams.get("key");
        return key && key.startsWith("products/") ? key : null;
      }

      if (parsed.hostname.includes(".s3.") && parsed.pathname.startsWith("/products/")) {
        return parsed.pathname.replace(/^\/+/, "");
      }

      if (parsed.pathname.startsWith("/products/")) {
        return parsed.pathname.replace(/^\/+/, "");
      }
    } catch {
      return null;
    }

    return null;
  },

  deleteUploadedImage: async (url: string): Promise<void> => {
    const key = productService.extractImageKey(url);
    if (!key) {
      return;
    }

    await api.delete(API_ENDPOINTS.PRODUCTS.IMAGE_BASE, {
      params: { key },
    });
  },

  shouldFallbackToBackendUpload: (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    if (error.response?.status === 403) {
      return true;
    }

    const code = error.code || "";
    const message = error.message || "";
    if (code === "ERR_NETWORK") {
      return true;
    }

    return (
      message.toLowerCase().includes("network error") ||
      message.toLowerCase().includes("cors")
    );
  },
};

