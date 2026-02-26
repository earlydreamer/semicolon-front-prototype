/**
 * 상품 등록 페이지
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSellerStore } from '@/stores/useSellerStore';
import { useToast } from '@/components/common/Toast';
import ProductForm, { type ProductFormValues } from '@/components/features/seller/ProductForm';
import { productService } from '@/services/productService';

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addProduct } = useSellerStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      if (pendingFiles.length === 0) {
        throw new Error('No pending images to upload');
      }

      const uploadedImageUrls = await Promise.all(
        pendingFiles.map((file) => productService.uploadImageViaBackend(file)),
      );

      await addProduct({
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
        images: uploadedImageUrls,
      });

      showToast('상품이 등록됐어요', 'success');
      navigate('/seller');
    } catch (error) {
      console.error('Failed to add product:', error);
      showToast('상품 등록에 실패했어요', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
        <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">상품 등록</h1>
        <p className="text-neutral-500 mt-1">새로운 상품을 등록해보세요</p>
      </div>

      {/* 폼 */}
      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="등록하기"
        isLoading={isLoading}
        deferImageUpload
        onPendingFilesChange={setPendingFiles}
      />
    </div>
  );
};

export default ProductRegisterPage;
