import { useEffect, useRef, useState } from "react";
import ImagePlus from "lucide-react/dist/esm/icons/image-plus";
import X from "lucide-react/dist/esm/icons/x";
import GripVertical from "lucide-react/dist/esm/icons/grip-vertical";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import { productService } from "@/services/productService";
import { useToast } from "@/components/common/Toast";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  deferUpload?: boolean;
  onPendingFilesChange?: (files: File[]) => void;
  maxImages?: number;
}

const ProductImageUploader = ({
  images,
  onChange,
  deferUpload = false,
  onPendingFilesChange,
  maxImages = 10,
}: ProductImageUploaderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingItems, setPendingItems] = useState<Array<{ file: File; previewUrl: string }>>([]);
  const pendingItemsRef = useRef<Array<{ file: File; previewUrl: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    pendingItemsRef.current = pendingItems;
  }, [pendingItems]);

  useEffect(() => {
    return () => {
      pendingItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const getImageMeta = (
    file: File,
  ): { extension: string; contentType: string } => {
    const mime = (file.type || "").toLowerCase();
    if (mime === "image/jpeg") {
      return { extension: "jpg", contentType: "image/jpeg" };
    }
    if (mime === "image/png") {
      return { extension: "png", contentType: "image/png" };
    }
    if (mime === "image/gif") {
      return { extension: "gif", contentType: "image/gif" };
    }
    if (mime === "image/webp") {
      return { extension: "webp", contentType: "image/webp" };
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (ext === "jpg" || ext === "jpeg") {
      return { extension: "jpg", contentType: "image/jpeg" };
    }
    if (ext === "png") {
      return { extension: "png", contentType: "image/png" };
    }
    if (ext === "gif") {
      return { extension: "gif", contentType: "image/gif" };
    }
    if (ext === "webp") {
      return { extension: "webp", contentType: "image/webp" };
    }

    throw new Error("지원하지 않는 이미지 형식");
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      showToast(`이미지는 최대 ${maxImages}장까지 올릴 수 있어요.`, "error");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (deferUpload) {
      try {
        filesToProcess.forEach((file) => {
          getImageMeta(file);
        });
      } catch (error) {
        console.error("Unsupported image file:", error);
        showToast("지원하지 않는 이미지 형식이에요.", "error");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const newItems = filesToProcess.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      const mergedItems = [...pendingItems, ...newItems];
      setPendingItems(mergedItems);
      onPendingFilesChange?.(mergedItems.map((item) => item.file));
      onChange(mergedItems.map((item) => item.previewUrl));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesToProcess.map(async (file) => {
        const { extension, contentType } = getImageMeta(file);

        try {
          const presignedUrl = await productService.getPresignedUrl(extension);
          await productService.uploadImageToS3(presignedUrl, file, contentType);

          const objectUrl = presignedUrl.split("?")[0];
          const key = new URL(objectUrl).pathname.replace(/^\/+/, "");
          return productService.buildPublicImageUrl(key);
        } catch (error) {
          if (productService.shouldFallbackToBackendUpload(error)) {
            return await productService.uploadImageViaBackend(file);
          }
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      showToast("이미지를 올리지 못했어요. 다시 시도해 주세요.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (deferUpload) {
      const nextItems = [...pendingItems];
      const [removed] = nextItems.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      setPendingItems(nextItems);
      onPendingFilesChange?.(nextItems.map((item) => item.file));
      onChange(nextItems.map((item) => item.previewUrl));
      return;
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    if (deferUpload) {
      const newItems = [...pendingItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);
      setPendingItems(newItems);
      onPendingFilesChange?.(newItems.map((item) => item.file));
      onChange(newItems.map((item) => item.previewUrl));
      setDraggedIndex(index);
      return;
    }

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    onChange(newImages);
    setDraggedIndex(index);
  };

  const clearPendingItems = () => {
    pendingItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setPendingItems([]);
    onPendingFilesChange?.([]);
    onChange([]);
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
        <span className="text-xs text-neutral-500">드래그해서 순서를 바꿀 수 있어요.</span>
      </div>

      <div className="grid grid-cols-5 gap-3">
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

            {index === 0 && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs font-medium rounded">
                대표
              </span>
            )}

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
              {isUploading ? "업로드 중..." : "추가"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {deferUpload && pendingItems.length > 0 && (
        <button
          type="button"
          onClick={clearPendingItems}
          className="text-xs text-neutral-500 underline hover:text-neutral-700"
        >
          선택한 이미지 모두 지우기
        </button>
      )}

      <p className="text-xs text-neutral-500">
        첫 번째 이미지가 대표 이미지로 보여져요.
      </p>
    </div>
  );
};

export default ProductImageUploader;
