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
  image?: string; // 이미지 없는 배너도 가능
  imageAlign: BannerImageAlign;
  imageFit: BannerImageFit;
  textPosition: BannerTextPosition;
  bgColor: string;
  ctaText?: string;
  ctaLink?: string;
  ctaEnabled: boolean; // 버튼 표시 여부
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 어드민에서 배너 생성/수정 시 사용
export interface BannerInput {
  title: string;
  description: string;
  image?: string;
  imageAlign: BannerImageAlign;
  imageFit: BannerImageFit;
  textPosition: BannerTextPosition;
  bgColor: string;
  ctaText?: string;
  ctaLink?: string;
  ctaEnabled: boolean;
  isActive?: boolean;
}
