/**
 * 도움말 툴팁 컴포넌트
 * Desktop: hover 시 표시
 * Mobile: tap 시 표시 (toggle)
 * 위치: 아래 방향 (화면 하단 잘림 방지)
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import X from 'lucide-react/dist/esm/icons/x';

interface HelpTooltipProps {
  content: ReactNode;
  title?: string;
  className?: string;
}

export function HelpTooltip({ content, title, className = '' }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 툴팁 위치 계산 (화면 하단 잘림 방지)
  useEffect(() => {
    if (isOpen && tooltipRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // 아래에 충분한 공간이 없으면 위로 표시
      if (buttonRect.bottom + tooltipHeight + 10 > viewportHeight) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full"
        aria-label="도움말 보기"
        aria-expanded={isOpen}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-64 sm:w-72 ${
            position === 'bottom' 
              ? 'top-full mt-2' 
              : 'bottom-full mb-2'
          }`}
        >
          <div className="bg-neutral-800 text-white rounded-lg shadow-xl p-3 text-sm">
            {/* 모바일 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden absolute top-2 right-2 text-neutral-400 hover:text-white"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
            
            {title && (
              <div className="font-bold text-neutral-100 mb-2 pr-6 md:pr-0">
                {title}
              </div>
            )}
            <div className="text-neutral-300 leading-relaxed">
              {content}
            </div>
          </div>
          {/* 화살표 */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45 ${
              position === 'bottom' 
                ? '-top-1' 
                : '-bottom-1'
            }`} 
          />
        </div>
      )}
    </div>
  );
}
