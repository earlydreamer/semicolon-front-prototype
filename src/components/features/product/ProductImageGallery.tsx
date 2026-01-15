/**
 * 상품 이미지 갤러리 컴포넌트
 * 
 * ProductDetailPage에서 분리된 이미지 표시 전용 컴포넌트
 */

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  mainImage: string;
  title: string;
}

export const ProductImageGallery = ({ images, mainImage, title }: ProductImageGalleryProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [mainImage];

  return (
    <div className="space-y-4">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
        <img
          src={displayImages[activeImageIndex] || mainImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                activeImageIndex === idx ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
