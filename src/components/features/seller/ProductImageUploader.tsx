/**
 * 상품 이미지 업로더 (파일 첨부 방식)
 */

import { useState, useRef } from "react";
import ImagePlus from "lucide-react/dist/esm/icons/image-plus";
import X from "lucide-react/dist/esm/icons/x";
import GripVertical from "lucide-react/dist/esm/icons/grip-vertical";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

import { productService } from "@/services/productService";
import { useToast } from "@/components/common/Toast";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

const ProductImageUploader = ({
  images,
  onChange,
  maxImages = 10,
}: ProductImageUploaderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      showToast(`최대 ${maxImages}장까지 업로드 가능합니다`, "error");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const uploadPromises = filesToProcess.map(async (file) => {
        const extension = file.name.split(".").pop() || "jpg";

        // 1. Presigned URL 획득
        const presignedUrl = await productService.getPresignedUrl(extension);

        // 2. S3 업로드
        await productService.uploadImageToS3(presignedUrl, file);

        // 3. 쿼리 파라미터가 제거된 순수 객체 URL 반환
        return presignedUrl.split("?")[0];
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      showToast("이미지 업로드에 실패했습니다", "error");
    } finally {
      setIsUploading(false);
      // 인풋 초기화 (같은 파일 재선택 가능하도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // 순서 변경
    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">
          상품 이미지 ({images.length}/{maxImages})
        </span>
        <span className="text-xs text-neutral-500">드래그하여 순서 변경</span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* 이미지 목록 */}
        {images.map((image, index) => (
          <div
            key={`${index}-${image.slice(-20)}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-square rounded-lg border-2 overflow-hidden group cursor-move
              ${index === 0 ? "border-primary-500 ring-2 ring-primary-200" : "border-neutral-200"}
              ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            <img
              src={image}
              alt={`상품 이미지 ${index + 1}`}
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />

            {/* 대표 이미지 뱃지 */}
            {index === 0 && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs font-medium rounded">
                대표
              </span>
            )}

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-1.5 bg-white rounded-full text-error-500 hover:bg-error-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-1.5 bg-white rounded-full text-neutral-500">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 
              hover:border-primary-400 hover:bg-primary-50 transition-colors
              flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-primary-500
              disabled:bg-neutral-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ImagePlus className="w-6 h-6" />
            )}
            <span className="text-xs font-medium">
              {isUploading ? "업로드 중" : "추가"}
            </span>
          </button>
        )}
      </div>

      {/* 파일 인풋 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-neutral-500">
        * 첫 번째 이미지가 대표 이미지로 사용됩니다
      </p>
    </div>
  );
};

export default ProductImageUploader;
