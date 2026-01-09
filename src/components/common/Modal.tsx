/**
 * 공통 모달 컴포넌트
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }: ModalProps) => {
  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 모달 컨텐츠 */}
      <div 
        className={`relative w-full ${SIZES[size]} bg-white rounded-xl shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          {title ? <h2 className="text-lg font-bold text-neutral-900">{title}</h2> : <div />}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
