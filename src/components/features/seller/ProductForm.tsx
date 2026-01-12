/**
 * 상품 등록/수정 폼
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import ProductImageUploader from './ProductImageUploader';
import { MOCK_CATEGORIES, type Category } from '@/mocks/categories';
import type { ConditionStatus } from '@/mocks/products';

// Zod 스키마 (location 필드 제거)
const productSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력해주세요').max(100, '제목은 100자 이하로 입력해주세요'),
  categoryId: z.string().min(1, '카테고리를 선택해주세요'),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다').max(100000000, '가격이 너무 높습니다'),
  shippingFee: z.number().min(0, '배송비는 0원 이상이어야 합니다'),
  conditionStatus: z.enum(['SEALED', 'NO_WEAR', 'MINOR_WEAR', 'VISIBLE_WEAR', 'DAMAGED'] as const),
  description: z.string().min(10, '설명은 10자 이상 입력해주세요').max(5000, '설명은 5000자 이하로 입력해주세요'),
  images: z.array(z.string()).min(1, '최소 1장 이상의 이미지를 등록해주세요'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

// 상품 상태 옵션 (ENUM 기준 통일)
const CONDITION_OPTIONS: { value: ConditionStatus; label: string; description: string }[] = [
  { value: 'SEALED', label: '미개봉', description: '새 상품 (포장 미개봉)' },
  { value: 'NO_WEAR', label: '사용감 없음', description: '거의 새것 수준' },
  { value: 'MINOR_WEAR', label: '사용감 적음', description: '눈에 띄지 않는 사용감' },
  { value: 'VISIBLE_WEAR', label: '사용감 많음', description: '눈에 띄는 사용감' },
  { value: 'DAMAGED', label: '하자 있음', description: '기능/외관 하자' },
];

// 카테고리 평탄화 헬퍼
const flattenCategories = (categories: Category[], depth = 0): { id: string; name: string; depth: number }[] => {
  return categories.flatMap((cat) => [
    { id: cat.id, name: cat.name, depth },
    ...(cat.children ? flattenCategories(cat.children, depth + 1) : []),
  ]);
};

const ProductForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = '등록하기',
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      price: 0,
      shippingFee: 0,
      conditionStatus: 'NO_WEAR',
      description: '',
      images: [],
      ...defaultValues,
    },
  });

  const flatCategories = flattenCategories(MOCK_CATEGORIES);
  
  // 가격 실시간 계산
  const price = watch('price') || 0;
  const shippingFee = watch('shippingFee') || 0;
  const totalPrice = price + shippingFee;

  // 음수 방지를 위한 핸들러
  const handlePriceInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (value < 0) {
      e.currentTarget.value = '0';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 이미지 업로더 */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ProductImageUploader
              images={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.images && (
          <p className="mt-2 text-sm text-error-600">{errors.images.message}</p>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">기본 정보</h3>
        
        <Input
          label="상품명"
          placeholder="상품명을 입력해주세요"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">카테고리</label>
          <select
            {...register('categoryId')}
            className="w-full h-11 px-3 rounded-md border border-neutral-300 bg-neutral-0 
              text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <option value="">카테고리 선택</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {'─'.repeat(cat.depth)} {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-error-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">상품 상태</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CONDITION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="relative flex cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('conditionStatus')}
                  className="peer sr-only"
                />
                <div className="w-full p-3 rounded-lg border-2 border-neutral-200 
                  peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-colors">
                  <div className="font-medium text-sm text-neutral-900">{option.label}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">가격 정보</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">가격</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                {...register('price', { 
                  valueAsNumber: true,
                  onChange: handlePriceInput,
                })}
                onInput={handlePriceInput}
                className="w-full h-11 px-3 pr-8 rounded-md border border-neutral-300 bg-neutral-0 
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">원</span>
            </div>
            {errors.price && (
              <p className="text-sm text-error-600">{errors.price.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">배송비</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                {...register('shippingFee', { 
                  valueAsNumber: true,
                  onChange: handlePriceInput,
                })}
                onInput={handlePriceInput}
                className="w-full h-11 px-3 pr-8 rounded-md border border-neutral-300 bg-neutral-0 
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">원</span>
            </div>
            {errors.shippingFee && (
              <p className="text-sm text-error-600">{errors.shippingFee.message}</p>
            )}
          </div>
        </div>

        {/* 총 가격 표시 */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">구매자 결제 금액</span>
            <span className="text-xl font-bold text-primary-600">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            가격 + 배송비 = 총 결제 금액
          </p>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">상세 정보</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">상품 설명</label>
          <textarea
            {...register('description')}
            className="w-full min-h-[200px] px-3 py-2 rounded-md border border-neutral-300 bg-neutral-0 
              text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 resize-y"
            placeholder="상품에 대한 상세한 설명을 작성해주세요.&#10;&#10;구매 시기, 사용 기간, 하자 여부 등을 포함하면 좋습니다."
          />
          {errors.description && (
            <p className="text-sm text-error-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
