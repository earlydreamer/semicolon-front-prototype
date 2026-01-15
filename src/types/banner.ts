/**
 * 배너 타입 정의
 */

export type BannerImageAlign = 'split' | 'full';
export type BannerImageFit = 'cover' | 'contain';
export type BannerTextPosition = 'left' | 'center' | 'right';

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlign: BannerImageAlign;
  imageFit: BannerImageFit;
  textPosition: BannerTextPosition; // 텍스트/버튼 위치
  bgColor: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 어드민에서 배너 생성/수정 시 사용
export interface BannerInput {
  title: string;
  description: string;
  image: string;
  imageAlign: BannerImageAlign;
  imageFit: BannerImageFit;
  textPosition: BannerTextPosition;
  bgColor: string;
  ctaText: string;
  ctaLink: string;
  isActive?: boolean;
}

