import { useState, useEffect, useCallback } from 'react';
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
    imageFit: 'contain', // 1번은 본연의 비율 유지 (상하 안채움)
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
    imageFit: 'cover', // 2번은 기존처럼 꽉 채움
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

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Auto-slide 
  useEffect(() => {
    const timer = setInterval(handleNext, BANNER_CONFIG.INTERVAL);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="relative w-full overflow-hidden min-h-[280px] min-[360px]:min-h-[340px] min-[480px]:min-h-[380px] md:min-h-[460px] lg:min-h-[540px]">
      {/* Sliding Container */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <div 
            key={banner.id}
            className={`relative min-w-full flex-shrink-0 flex items-center min-h-[280px] min-[360px]:min-h-[340px] min-[480px]:min-h-[380px] md:min-h-[460px] lg:min-h-[540px]
              ${banner.imageAlign === 'split' ? `bg-gradient-to-r ${banner.bgColor}` : ''}`}
          >
            {/* Background Layer (Individual per slide) */}
            <div className="absolute inset-0 z-0">
              {banner.id === 3 ? (
                <>
                  <img 
                    src={banner.image} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                </>
              ) : banner.imageAlign === 'full' ? (
                <>
                  <img 
                    src={banner.image} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </>
              ) : (
                <div className="relative w-full h-full">
                  <div 
                    className={`absolute top-0 right-0 h-full hidden md:block overflow-hidden
                      ${banner.imageFit === 'contain' ? 'md:w-1/2 p-8 lg:p-14' : 'md:w-3/5'}`}
                    style={{
                      maskImage: 'linear-gradient(to right, transparent, black 250px)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 250px)'
                    }}
                  >
                    <img 
                      src={banner.image} 
                      alt="" 
                      className={`w-full h-full ${banner.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                    />
                    <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-br from-primary-400/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10 py-6 min-[360px]:py-8 md:py-14 lg:py-16">
              <div className="flex flex-col items-center gap-4 min-[360px]:gap-6 md:flex-row md:gap-16">
                {/* 모바일에서 split 타입일 때 이미지를 상단에 먼저 표시 */}
                {banner.imageAlign === 'split' && (
                  <div className="w-full max-w-[200px] min-[360px]:max-w-[240px] min-[480px]:max-w-[280px] md:hidden mx-auto">
                    <img 
                      src={banner.image} 
                      alt="배너 이미지" 
                      className="w-full h-auto object-contain drop-shadow-lg"
                    />
                  </div>
                )}

                <div className={`flex-1 space-y-3 min-[360px]:space-y-4 md:space-y-5 text-center md:text-left
                  ${banner.imageAlign === 'full' ? 'max-w-xl' : 'md:max-w-[48%]'}`}>
                  <h1 className={`text-xl min-[360px]:text-2xl min-[480px]:text-3xl font-black leading-[1.2] tracking-tight md:text-4xl lg:text-6xl
                    ${banner.imageAlign === 'full' ? 'text-white' : 'text-neutral-900'}`}>
                    {banner.title}
                  </h1>
                  <p className={`whitespace-pre-line text-xs min-[360px]:text-sm min-[480px]:text-base md:text-lg opacity-90 leading-relaxed
                    ${banner.imageAlign === 'full' ? 'text-neutral-200' : 'text-neutral-600'}`}>
                    {banner.description}
                  </p>
                  <div className="flex justify-center gap-4 md:justify-start pt-1 min-[360px]:pt-2">
                    <Link to={banner.ctaLink}>
                      <Button 
                        size="lg" 
                        className={`font-bold text-sm min-[360px]:text-base ${
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
                
                {/* full 타입 배너의 모바일 이미지 (하단에 표시) */}
                {banner.imageAlign === 'full' && (
                  <div className="flex-1 w-full md:hidden">
                    <img 
                      src={banner.image} 
                      alt="배너 이미지" 
                      className="rounded-2xl shadow-xl object-cover aspect-video w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none z-20 hidden md:flex px-4 lg:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrev}
          className={`pointer-events-auto w-12 h-12 rounded-full backdrop-blur-md transition-all 
            ${BANNERS[currentIndex].imageAlign === 'full' 
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
            ${BANNERS[currentIndex].imageAlign === 'full' 
              ? 'bg-white/10 hover:bg-white/25 text-white' 
              : 'bg-white/20 hover:bg-white/40 text-neutral-800'}`}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 
              ${index === currentIndex 
                ? (BANNERS[currentIndex].imageAlign === 'full' ? 'w-8 bg-white' : 'w-8 bg-primary-600') 
                : (BANNERS[currentIndex].imageAlign === 'full' ? 'w-2 bg-white/40 hover:bg-white/60' : 'w-2 bg-primary-300 hover:bg-primary-400')}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
