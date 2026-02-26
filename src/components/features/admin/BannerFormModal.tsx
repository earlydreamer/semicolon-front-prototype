/**
 * 배너 추가/수정 모달 폼 컴포넌트
 * 
 * BannerManagePage에서 분리된 배너 폼 모달
 */

import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { BannerInput, BannerImageAlign, BannerImageFit, BannerTextPosition } from '@/types/banner';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: BannerInput;
  onFormChange: (data: BannerInput) => void;
  onSubmit: () => void;
  bgColorOptions: Array<{ value: string; label: string }>;
}

export const BannerFormModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  onFormChange,
  onSubmit,
  bgColorOptions,
}: BannerFormModalProps) => {
  const updateForm = (updates: Partial<BannerInput>) => {
    onFormChange({ ...formData, ...updates });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? '배너 수정' : '배너 추가'}
    >
      <div className="space-y-4">
        <Input
          label="제목"
          value={formData.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          placeholder="배너 제목을 입력하세요"
        />
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="배너 설명을 입력하세요 (줄바꿈: \n)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>
        
        <Input
          label="이미지 URL"
          value={formData.image || ''}
          onChange={(e) => updateForm({ image: e.target.value })}
          placeholder="https://..."
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">레이아웃</label>
            <select
              value={formData.imageAlign}
              onChange={(e) => updateForm({ imageAlign: e.target.value as BannerImageAlign })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="split">분할 (split)</option>
              <option value="full">전체 (full)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">이미지 채우기</label>
            <select
              value={formData.imageFit}
              onChange={(e) => updateForm({ imageFit: e.target.value as BannerImageFit })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="contain">원본 비율 (contain)</option>
              <option value="cover">채우기 (cover)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">텍스트/버튼 위치</label>
          <select
            value={formData.textPosition}
            onChange={(e) => updateForm({ textPosition: e.target.value as BannerTextPosition })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="left">좌측 (left)</option>
            <option value="center">중앙 (center)</option>
            <option value="right">우측 (right)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">배경색</label>
          <select
            value={formData.bgColor}
            onChange={(e) => updateForm({ bgColor: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {bgColorOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* 버튼 설정 */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-neutral-700">버튼 표시</p>
            <p className="text-xs text-neutral-500">배너에 CTA 버튼을 표시합니다</p>
          </div>
          <button
            type="button"
            onClick={() => updateForm({ ctaEnabled: !formData.ctaEnabled })}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ backgroundColor: formData.ctaEnabled ? '#10b981' : '#d1d5db' }}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                formData.ctaEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {formData.ctaEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="버튼 텍스트"
              value={formData.ctaText || ''}
              onChange={(e) => updateForm({ ctaText: e.target.value })}
              placeholder="거래 시작하기"
            />
            
            <Input
              label="버튼 링크"
              value={formData.ctaLink || ''}
              onChange={(e) => updateForm({ ctaLink: e.target.value })}
              placeholder="/seller/products/new"
            />
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={onSubmit}>{isEditing ? '수정' : '추가'}</Button>
        </div>
      </div>
    </Modal>
  );
};
