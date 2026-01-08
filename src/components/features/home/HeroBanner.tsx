import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-primary-50 to-primary-100 py-12 md:py-20">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 md:flex-row md:gap-16">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
            취향을 잇는<br />
            <span className="text-primary-600">중고거래</span>의 시작
          </h1>
          <p className="text-lg text-neutral-600">
            캠핑부터 악기까지, 당신만의 라이프스타일을 찾아보세요.<br />
            안전하고 편리한 거래 경험을 제공합니다.
          </p>
          <div className="flex justify-center gap-4 md:justify-start">
            <Button size="lg" className="px-8 text-lg font-semibold">
              거래 시작하기
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-lg font-semibold">
              내 물건 팔기
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <Card className="relative mx-auto aspect-video w-full max-w-lg overflow-hidden shadow-xl md:ml-auto">
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000" 
              alt="Hero Banner Image" 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
