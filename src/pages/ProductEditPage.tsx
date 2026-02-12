/**
 * 상품 수정 페이지
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSellerStore } from '@/stores/useSellerStore';
import { useToast } from '@/components/common/Toast';
import ProductForm, { type ProductFormValues } from '@/components/features/seller/ProductForm';
import { sanitizeUrlParam, isValidId } from '@/utils/sanitize';

const ProductEditPage = () => {
  const { productId: rawProductId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getProductById, updateProduct } = useSellerStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // URL 파라미터 검증 (XSS 방지)
  const productId = sanitizeUrlParam(rawProductId);
  const product = isValidId(productId) ? getProductById(productId) : undefined;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!product && productId) {
      showToast('상품을 찾을 수 없습니다', 'error');
      navigate('/seller');
    }
  }, [product, productId, navigate, showToast]);

  const handleSubmit = (data: ProductFormValues) => {
    if (!productId) return;

    setIsLoading(true);

    updateProduct(productId, {
      title: data.title,
      categoryId: data.categoryId,
      price: data.price,
      shippingFee: data.shippingFee,
      conditionStatus: data.conditionStatus,
      purchaseDate: data.purchaseDate,
      usePeriod: data.usePeriod,
      detailedCondition: data.detailedCondition,
      description: data.description,
      images: data.images,
    });

    showToast('상품이 수정되었습니다', 'success');
    navigate('/seller');
  };

  if (!isAuthenticated || !product) {
    return null;
  }

  const defaultValues: Partial<ProductFormValues> = {
    title: product.title,
    categoryId: product.categoryId,
    price: product.price,
    shippingFee: product.shippingFee,
    conditionStatus: product.conditionStatus,
    purchaseDate: product.purchaseDate,
    usePeriod: product.usePeriod,
    detailedCondition: product.detailedCondition,
    description: product.description,
    images: product.images,
  };

  return (
    <div className="container mx-auto max-w-2xl px-3 py-5 min-[360px]:px-4 min-[360px]:py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <Link
          to="/seller"
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          판매 관리로 돌아가기
        </Link>
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">상품 수정</h1>
        <p className="text-neutral-500 mt-1">{product.title}</p>
      </div>

      {/* 폼 */}
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductEditPage;
