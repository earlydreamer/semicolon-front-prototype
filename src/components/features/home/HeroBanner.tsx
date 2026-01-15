import { useState, useEffect, useCallback } from 'react';
import type { TouchEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import bannerImg from '@/assets/sample_banner_thumbnail.png';

// 배너 설정 (하드코딩 방지)
const BANNER_CONFIG = {
  INTERVAL: 5000,
  TRANSITION_SPEED: 500,
} as const;

interface Banner {
  id: number;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlign: 'split' | 'full'; // 분할형(기존) 또는 전체 채우기형
  imageFit?: 'cover' | 'contain'; // 이미지 채우기 방식 추가
  bgColor: string;
  ctaText: string;
  ctaLink: string;
}

const BANNERS: Banner[] = [
  {
    id: 1,
    title: (
      <>
        취향을 잇는<br />
        <span className="text-primary-600">중고거래</span>의 시작
      </>
    ),
    description: '캠핑부터 악기까지, 당신만의 라이프스타일을 찾아보세요.\n안전하고 편리한 거래 경험을 제공합니다.',
    image: bannerImg,
    imageAlign: 'split',
    imageFit: 'contain',
    bgColor: 'from-primary-50 to-primary-100',
    ctaText: '거래 시작하기',
    ctaLink: '/seller/products/new'
  },
  {
    id: 2,
    title: (
      <>
        안전한 거래,<br />
        <span className="text-blue-600">덕쿠</span>와 함께
      </>
    ),
    description: '검증된 판매자와 안전한 결제 시스템으로\n걱정 없는 중고거래를 시작하세요.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000',
    imageAlign: 'split',
    imageFit: 'cover',
    bgColor: 'from-blue-50 to-blue-100',
    ctaText: '상세 보기',
    ctaLink: '#'
  },
  {
    id: 3,
    title: (
      <span className="text-white">
        잊고 있던<br />
        나만의 취미를 찾다
      </span>
    ),
    description: '악기부터 레트로 가전, 수집품까지.\n당신의 열정을 깨울 새로운 취미를 발견하세요.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1500',
    imageAlign: 'full',
    imageFit: 'cover',
    bgColor: 'from-neutral-900 to-neutral-800',
    ctaText: '취미 찾으러 가기',
    ctaLink: '#'
  }
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 스와이프 감지를 위한 최소 거리
  const minSwipeDistance = 50;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // 터치 이벤트 핸들러 (모바일 스와이프)
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Auto-slide 
  useEffect(() => {
    const timer = setInterval(handleNext, BANNER_CONFIG.INTERVAL);
    return () => clearInterval(timer);
  }, [handleNext]);

  const currentBanner = BANNERS[currentIndex];
  const isDark = currentBanner.imageAlign === 'full';

  return (
    <section 
      className="relative w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Sliding Container */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <div 
            key={banner.id}
            className={`relative min-w-full flex-shrink-0 ${banner.imageAlign === 'split' ? `bg-gradient-to-br ${banner.bgColor}` : ''}`}
          >
            {/* 배경 이미지 (full 타입 또는 데스크톱 split 타입) */}
            <div className="absolute inset-0 z-0">
              {banner.imageAlign === 'full' ? (
                <>
                  <img 
                    src={banner.image} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                </>
              ) : (
                /* 데스크톱에서만 우측 이미지 표시 */
                <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full overflow-hidden">
                  <div 
                    className="w-full h-full"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent, black 150px)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 150px)'
                    }}
                  >
                    <img 
                      src={banner.image} 
                      alt="" 
                      className={`w-full h-full ${banner.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="relative z-10 container mx-auto px-4">
              {/* 모바일 레이아웃: 세로 배치 */}
              <div className="md:hidden py-6 min-[360px]:py-8 flex flex-col items-center text-center">
                {/* 모바일에서 split 타입일 때 이미지 상단 표시 */}
                {banner.imageAlign === 'split' && (
                  <div className="w-full max-w-[180px] min-[360px]:max-w-[220px] mb-4 min-[360px]:mb-6">
                    <img 
                      src={banner.image} 
                      alt="배너 이미지" 
                      className="w-full h-auto object-contain drop-shadow-xl"
                    />
                  </div>
                )}
                
                {/* 텍스트 콘텐츠 */}
                <div className="space-y-2 min-[360px]:space-y-3">
                  <h2 className={`text-xl min-[360px]:text-2xl font-black leading-tight tracking-tight
                    ${banner.imageAlign === 'full' ? 'text-white' : 'text-neutral-900'}`}>
                    {banner.title}
                  </h2>
                  <p className={`text-xs min-[360px]:text-sm leading-relaxed whitespace-pre-line
                    ${banner.imageAlign === 'full' ? 'text-neutral-200' : 'text-neutral-600'}`}>
                    {banner.description}
                  </p>
                  <div className="pt-2 min-[360px]:pt-3">
                    <Link to={banner.ctaLink}>
                      <Button 
                        size="sm"
                        className={`font-bold text-sm ${
                          banner.imageAlign === 'full' 
                            ? 'bg-white text-neutral-900 hover:bg-neutral-100' 
                            : ''
                        }`}
                      >
                        {banner.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 데스크톱 레이아웃: 가로 배치 */}
              <div className="hidden md:flex items-center min-h-[460px] lg:min-h-[540px] py-14 lg:py-16">
                <div className={`space-y-5 ${banner.imageAlign === 'full' ? 'max-w-xl' : 'max-w-[48%]'}`}>
                  <h1 className={`text-4xl lg:text-6xl font-black leading-[1.2] tracking-tight
                    ${banner.imageAlign === 'full' ? 'text-white' : 'text-neutral-900'}`}>
                    {banner.title}
                  </h1>
                  <p className={`text-lg opacity-90 leading-relaxed whitespace-pre-line
                    ${banner.imageAlign === 'full' ? 'text-neutral-200' : 'text-neutral-600'}`}>
                    {banner.description}
                  </p>
                  <div>
                    <Link to={banner.ctaLink}>
                      <Button 
                        size="lg" 
                        className={`font-bold ${
                          banner.imageAlign === 'full' 
                            ? 'bg-white text-neutral-900 hover:bg-neutral-100' 
                            : ''
                        }`}
                      >
                        {banner.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 모바일 내비게이션 화살표 */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none z-20 px-2 md:hidden">
        <button 
          onClick={handlePrev}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${isDark 
              ? 'bg-white/20 text-white active:bg-white/40' 
              : 'bg-black/10 text-neutral-700 active:bg-black/20'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${isDark 
              ? 'bg-white/20 text-white active:bg-white/40' 
              : 'bg-black/10 text-neutral-700 active:bg-black/20'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 데스크톱 내비게이션 화살표 */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none z-20 hidden md:flex px-4 lg:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrev}
          className={`pointer-events-auto w-12 h-12 rounded-full backdrop-blur-md transition-all 
            ${isDark 
              ? 'bg-white/10 hover:bg-white/25 text-white' 
              : 'bg-white/20 hover:bg-white/40 text-neutral-800'}`}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          className={`pointer-events-auto w-12 h-12 rounded-full backdrop-blur-md transition-all 
            ${isDark 
              ? 'bg-white/10 hover:bg-white/25 text-white' 
              : 'bg-white/20 hover:bg-white/40 text-neutral-800'}`}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* 하단 인디케이터 */}
      <div className="absolute bottom-3 min-[360px]:bottom-4 md:bottom-8 left-1/2 flex -translate-x-1/2 gap-2 min-[360px]:gap-3 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 min-[360px]:h-2 rounded-full transition-all duration-300 
              ${index === currentIndex 
                ? (isDark ? 'w-6 min-[360px]:w-8 bg-white' : 'w-6 min-[360px]:w-8 bg-primary-600') 
                : (isDark ? 'w-1.5 min-[360px]:w-2 bg-white/40 hover:bg-white/60' : 'w-1.5 min-[360px]:w-2 bg-primary-300 hover:bg-primary-400')}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
