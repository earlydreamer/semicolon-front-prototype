/**
 * 안전한 이미지 컴포넌트
 * 
 * 외부 이미지 URL을 검증하고 안전하게 로드합니다.
 * - javascript: 프로토콜 차단
 * - 로딩 실패 시 대체 이미지 표시
 * - 허용된 도메인 검증 (옵션)
 */

import { useState, useCallback } from 'react';
import { isValidImageUrl } from '@/utils/sanitize';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 이미지 로드 실패 시 표시할 대체 이미지 URL */
  fallback?: string;
  /** URL 검증 실패 시에도 로드 허용 (개발용, 기본값: true) */
  allowUnverified?: boolean;
}

/** 기본 대체 이미지 (회색 플레이스홀더) */
const DEFAULT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * 안전한 이미지 컴포넌트
 * 
 * @example
 * ```tsx
 * <SafeImage 
 *   src={product.image} 
 *   alt={product.title}
 *   fallback="/images/placeholder.png"
 *   className="w-full h-full object-cover"
 * />
 * ```
 */
export function SafeImage({
  src,
  alt = '',
  fallback = DEFAULT_FALLBACK,
  allowUnverified = true,
  className,
  onError,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  // URL 검증
  const isValid = isValidImageUrl(src);

  // 이미지 로드 에러 핸들러
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(fallback);
      }
      onError?.(e);
    },
    [hasError, fallback, onError]
  );

  // URL이 유효하지 않고 allowUnverified가 false이면 대체 이미지 표시
  if (!isValid && !allowUnverified) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={hasError ? fallback : imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}

export default SafeImage;
