/**
 * 배너 Mock 데이터
 */

import type { Banner } from '@/types/banner';
import bannerImg from '@/assets/sample_banner_thumbnail.png';

// 디폴트 배너 (배너가 없을 때 표시)
export const DEFAULT_BANNER: Banner = {
  id: 'default',
  title: '덕쿠에 오신 것을 환영합니다',
  description: '취미 중고거래의 새로운 시작.\n지금 바로 거래를 시작해보세요.',
  image: bannerImg,
  imageAlign: 'split',
  imageFit: 'contain',
  bgColor: 'from-primary-50 to-primary-100',
  ctaText: '둘러보기',
  ctaLink: '/',
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
    bgColor: 'from-primary-50 to-primary-100',
    ctaText: '거래 시작하기',
    ctaLink: '/seller/products/new',
    order: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'banner-2',
    title: '안전한 거래, 덕쿠와 함께',
    description: '검증된 판매자와 안전한 결제 시스템으로\n걱정 없는 중고거래를 시작하세요.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000',
    imageAlign: 'split',
    imageFit: 'cover',
    bgColor: 'from-blue-50 to-blue-100',
    ctaText: '상세 보기',
    ctaLink: '#',
    order: 2,
    isActive: true,
    createdAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 'banner-3',
    title: '잊고 있던 나만의 취미를 찾다',
    description: '악기부터 레트로 가전, 수집품까지.\n당신의 열정을 깨울 새로운 취미를 발견하세요.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1500',
    imageAlign: 'full',
    imageFit: 'cover',
    bgColor: 'from-neutral-900 to-neutral-800',
    ctaText: '취미 찾으러 가기',
    ctaLink: '#',
    order: 3,
    isActive: true,
    createdAt: '2025-01-03T00:00:00Z',
  },
];
