/**
 * 배너 Mock 데이터
 */

import type { Banner } from '@/types/banner';
import bannerImg from '@/assets/sample_banner_thumbnail.png';

// 디폴트 배너 (모든 배너가 비활성일 때 표시)
export const DEFAULT_BANNER: Banner = {
  id: 'default',
  title: '취향을 잇는 중고거래의 시작',
  description: '캠핑부터 악기까지, 당신만의 라이프스타일을 찾아보세요.',
  image: undefined, // 이미지 없음
  imageAlign: 'full',
  imageFit: 'cover',
  textPosition: 'center',
  bgColor: 'from-purple-600 to-purple-800', // 보라색 배경
  ctaText: undefined,
  ctaLink: undefined,
  ctaEnabled: false, // 버튼 없음
  order: 0,
  isActive: true,
  createdAt: new Date().toISOString(),
};

// 초기 배너 데이터
export const MOCK_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: '취향을 잇는 중고거래의 시작',
    description: '캠핑부터 악기까지, 당신만의 라이프스타일을 찾아보세요.\n안전하고 편리한 거래 경험을 제공합니다.',
    image: bannerImg,
    imageAlign: 'split',
    imageFit: 'contain',
    textPosition: 'left',
    bgColor: 'from-primary-50 to-primary-100',
    ctaText: '거래 시작하기',
    ctaLink: '/seller/products/new',
    ctaEnabled: true,
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];
