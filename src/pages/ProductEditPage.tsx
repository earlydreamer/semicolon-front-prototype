/**
 * 상품 수정 페이지
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSellerStore } from "@/stores/useSellerStore";
import { useToast } from "@/components/common/Toast";
import ProductForm, {
  type ProductFormValues,
} from "@/components/features/seller/ProductForm";
import { sanitizeUrlParam, isValidId } from "@/utils/sanitize";
import { productService } from "@/services/productService";

const ProductEditPage = () => {
  const { productId: rawProductId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { updateProduct } = useSellerStore();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [defaultValues, setDefaultValues] =
    useState<Partial<ProductFormValues> | null>(null);
  const [seenImages, setSeenImages] = useState<string[]>([]);

  const productId = sanitizeUrlParam(rawProductId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || !isValidId(productId)) {
        showToast("유효하지 않은 상품입니다.", "error");
        navigate("/seller", { replace: true });
        return;
      }

      try {
        setIsPageLoading(true);
        const product = await productService.getProductDetail(productId);

        setDefaultValues({
          title: product.title,
          categoryId: String(product.category?.id ?? ""),
          price: product.price,
          shippingFee: product.shippingFee,
          conditionStatus: product.conditionStatus,
          tags: product.tagNames ?? [],
          description: product.description,
          images: (product.imageUrls ?? [])
            .map((url) => productService.normalizeImageUrl(url))
            .filter((url) => !!url),
          purchaseDate: "",
          usePeriod: "",
          detailedCondition: "",
        });
        setSeenImages(
          (product.imageUrls ?? [])
            .map((url) => productService.normalizeImageUrl(url))
            .filter((url) => !!url)
        );
      } catch (error) {
        console.error("Failed to load product detail for edit:", error);
        showToast("상품 정보를 불러오지 못했어요.", "error");
        navigate("/seller", { replace: true });
      } finally {
        setIsPageLoading(false);
      }
    };

    if (!isAuthenticated) {
      return;
    }

    loadProduct();
  }, [isAuthenticated, productId, navigate, showToast]);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!productId) return;

    try {
      setIsSubmitting(true);

      await updateProduct(productId, {
        title: data.title,
        categoryId: data.categoryId,
        price: data.price,
        shippingFee: data.shippingFee,
        conditionStatus: data.conditionStatus,
        tags: data.tags,
        purchaseDate: data.purchaseDate,
        usePeriod: data.usePeriod,
        detailedCondition: data.detailedCondition,
        description: data.description,
        images: data.images,
      });

      const removedImageUrls = seenImages.filter(
        (url) => !data.images.includes(url)
      );
      if (removedImageUrls.length > 0) {
        await Promise.allSettled(
          removedImageUrls.map((url) => productService.deleteUploadedImage(url))
        );
      }

      showToast("상품이 수정됐어요.", "success");
      navigate("/seller");
    } catch (error) {
      console.error("Failed to update product:", error);
      showToast("상품 수정에 실패했어요.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isPageLoading || !defaultValues) {
    return (
      <div className="container mx-auto max-w-2xl px-3 py-5 min-[360px]:px-4 min-[360px]:py-6">
        <p className="text-neutral-500">상품 정보를 불러오는 중이에요...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-3 py-5 min-[360px]:px-4 min-[360px]:py-6">
      <div className="mb-6">
        <Link
          to="/seller"
          className="mb-4 inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="h-4 w-4" />
          판매 관리로 돌아가기
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">
          상품 수정
        </h1>
        <p className="mt-1 text-neutral-500">{defaultValues.title}</p>
      </div>

      <ProductForm
        defaultValues={defaultValues}
        onImagesChange={setSeenImages}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ProductEditPage;
