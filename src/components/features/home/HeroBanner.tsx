import { useState, useEffect, useCallback } from 'react';
import type { TouchEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useBannerStore } from '@/stores/useBannerStore';

// 배너 설정 (하드코딩 방지)
const BANNER_CONFIG = {
  INTERVAL: 5000,
  TRANSITION_SPEED: 500,
} as const;

export function HeroBanner() {
  const { getBannersForDisplay } = useBannerStore();
  const banners = getBannersForDisplay();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 스와이프 감지를 위한 최소 거리
  const minSwipeDistance = 50;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

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

  const currentBanner = banners[currentIndex] || banners[0];
  const isDark = currentBanner?.imageAlign === 'full';

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
        {banners.map((banner) => (
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
              <div className={`md:hidden py-6 min-[360px]:py-8 flex flex-col ${
                banner.textPosition === 'center' ? 'items-center text-center' :
                banner.textPosition === 'right' ? 'items-end text-right' :
                'items-center text-center'  /* 모바일은 기본적으로 중앙 정렬 */
              }`}>
                {/* 모바일에서 split 타입일 때 이미지 상단 표시 */}
                {banner.imageAlign === 'split' && (
                  <div className={`w-full mb-4 min-[360px]:mb-6 ${
                    banner.imageFit === 'cover' 
                      ? 'h-[140px] min-[360px]:h-[180px] overflow-hidden rounded-xl' 
                      : 'max-w-[180px] min-[360px]:max-w-[220px]'
                  }`}>
                    <img 
                      src={banner.image} 
                      alt="배너 이미지" 
                      className={`w-full drop-shadow-xl ${
                        banner.imageFit === 'cover' 
                          ? 'h-full object-cover' 
                          : 'h-auto object-contain'
                      }`}
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
                  {banner.ctaEnabled && banner.ctaLink && (
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
                  )}
                </div>
              </div>

              {/* 데스크톱 레이아웃: 가로 배치 */}
              <div className={`hidden md:flex items-center min-h-[460px] lg:min-h-[540px] py-14 lg:py-16 ${
                banner.textPosition === 'center' ? 'justify-center text-center' :
                banner.textPosition === 'right' ? 'justify-end text-right' :
                'justify-start text-left'
              }`}>
                <div className={`space-y-5 ${
                  banner.imageAlign === 'full' ? 'max-w-xl' : 'max-w-[48%]'
                } ${
                  banner.textPosition === 'center' ? 'mx-auto' :
                  banner.textPosition === 'right' ? 'ml-auto' : ''
                }`}>
                  <h1 className={`text-4xl lg:text-6xl font-black leading-[1.2] tracking-tight
                    ${banner.imageAlign === 'full' ? 'text-white' : 'text-neutral-900'}`}>
                    {banner.title}
                  </h1>
                  <p className={`text-lg opacity-90 leading-relaxed whitespace-pre-line
                    ${banner.imageAlign === 'full' ? 'text-neutral-200' : 'text-neutral-600'}`}>
                    {banner.description}
                  </p>
                  {banner.ctaEnabled && banner.ctaLink && (
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
                  )}
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
        {banners.map((_: unknown, index: number) => (
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
