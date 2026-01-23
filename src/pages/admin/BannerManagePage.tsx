/**
 * 관리자 배너 관리 페이지
 * 
 * 기능:
 * - 드래그 앤 드롭으로 순서 변경
 * - 저장 버튼으로 변경사항 반영
 * - 초기화 버튼으로 이전 상태 복원
 * - 최대 10개 배너 제한
 */

import { useState, useEffect, useCallback } from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw';
import Save from 'lucide-react/dist/esm/icons/save';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { Button } from '@/components/common/Button';
import { useBannerStore } from '@/stores/useBannerStore';
import { BannerFormModal } from '@/components/features/admin/BannerFormModal';
import { Modal } from '@/components/common/Modal';
import type { Banner, BannerInput } from '@/types/banner';

const MAX_BANNERS = 10;

const BannerManagePage = () => {
  const { banners: storeBanners, setBanners } = useBannerStore();
  
  // 로컬 상태 (저장 전까지 변경사항 보관)
  const [localBanners, setLocalBanners] = useState<Banner[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 드래그 앤 드롭 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerInput>({
    title: '',
    description: '',
    image: '',
    imageAlign: 'split',
    imageFit: 'contain',
    textPosition: 'left',
    bgColor: 'from-primary-50 to-primary-100',
    ctaText: '',
    ctaLink: '',
    ctaEnabled: true,
  });
  
  // 알림 모달 상태
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Store 배너를 로컬 상태로 동기화
  useEffect(() => {
    const sorted = [...storeBanners].sort((a, b) => a.order - b.order);
    setLocalBanners(sorted);
    setHasChanges(false);
  }, [storeBanners]);
  
  // 정렬된 로컬 배너
  const sortedBanners = [...localBanners].sort((a, b) => a.order - b.order);
  
  // 드래그 시작
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  // 드래그 오버
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };
  
  // 드롭
  const handleDrop = useCallback((dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const newBanners = [...sortedBanners];
    const [draggedItem] = newBanners.splice(draggedIndex, 1);
    newBanners.splice(dropIndex, 0, draggedItem);
    
    // order 재할당
    const reorderedBanners = newBanners.map((banner, idx) => ({
      ...banner,
      order: idx + 1
    }));
    
    setLocalBanners(reorderedBanners);
    setHasChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, sortedBanners]);
  
  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  // 활성/비활성 토글 (로컬)
  const handleToggleActive = (id: string) => {
    setLocalBanners(prev =>
      prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)
    );
    setHasChanges(true);
  };
  
  // 저장
  const handleSave = () => {
    setBanners(localBanners);
    setHasChanges(false);
  };
  
  // 초기화 (이전 상태로 복원)
  const handleReset = () => {
    const sorted = [...storeBanners].sort((a, b) => a.order - b.order);
    setLocalBanners(sorted);
    setHasChanges(false);
  };
  
  // 배너 추가 모달 열기
  const handleOpenCreate = () => {
    if (localBanners.length >= MAX_BANNERS) {
      setAlertMessage(`배너는 최대 ${MAX_BANNERS}개까지 등록할 수 있습니다.`);
      setIsAlertModalOpen(true);
      return;
    }
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      imageAlign: 'split',
      imageFit: 'contain',
      textPosition: 'left',
      bgColor: 'from-primary-50 to-primary-100',
      ctaText: '',
      ctaLink: '',
      ctaEnabled: true,
    });
    setIsModalOpen(true);
  };
  
  // 배너 수정 모달 열기
  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image || '',
      imageAlign: banner.imageAlign,
      imageFit: banner.imageFit,
      textPosition: banner.textPosition || 'left',
      bgColor: banner.bgColor,
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      ctaEnabled: banner.ctaEnabled ?? true,
    });
    setIsModalOpen(true);
  };
  
  // 배너 추가/수정 제출 (로컬 상태)
  const handleSubmit = () => {
    if (editingBanner) {
      // 수정: 로컬 상태 업데이트
      setLocalBanners(prev =>
        prev.map(b =>
          b.id === editingBanner.id
            ? { ...b, ...formData, updatedAt: new Date().toISOString() }
            : b
        )
      );
    } else {
      // 추가: 로컬 상태에 새 배너 추가
      const newBanner = {
        id: `banner-${Date.now()}`,
        ...formData,
        order: localBanners.length + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setLocalBanners(prev => [...prev, newBanner]);
    }
    setHasChanges(true);
    setIsModalOpen(false);
  };
  
  // 배너 삭제 (로컬 상태)
  const handleDelete = (id: string) => {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      setLocalBanners(prev => {
        const filtered = prev.filter(b => b.id !== id);
        // order 재할당
        return filtered.map((banner, idx) => ({ ...banner, order: idx + 1 }));
      });
      setHasChanges(true);
    }
  };
  
  const bgColorOptions = [
    { value: 'from-primary-50 to-primary-100', label: '보라색' },
    { value: 'from-blue-50 to-blue-100', label: '파란색' },
    { value: 'from-green-50 to-green-100', label: '초록색' },
    { value: 'from-orange-50 to-orange-100', label: '주황색' },
    { value: 'from-neutral-900 to-neutral-800', label: '어두운색' },
  ];
  
  const isMaxReached = localBanners.length >= MAX_BANNERS;
  
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">배너 관리</h1>
          <p className="text-neutral-500 mt-1">
            홈 화면 롤링 배너를 관리합니다 ({localBanners.length} / {MAX_BANNERS})
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-primary-600 hover:bg-primary-700' : ''}
          >
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
          <Button 
            onClick={handleOpenCreate}
            disabled={isMaxReached}
            title={isMaxReached ? `배너는 최대 ${MAX_BANNERS}개까지 등록할 수 있습니다.` : ''}
          >
            <Plus className="w-4 h-4 mr-2" />
            배너 추가
          </Button>
        </div>
      </div>
      
      {/* 변경사항 알림 */}
      {hasChanges && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">변경사항이 있습니다. 저장 버튼을 눌러 반영하세요.</span>
        </div>
      )}
      
      {/* 최대 배너 경고 */}
      {isMaxReached && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">최대 {MAX_BANNERS}개의 배너가 등록되어 있습니다. 새 배너를 추가하려면 기존 배너를 삭제하세요.</span>
        </div>
      )}
      
      {/* 배너 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 w-20">순서</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">이미지</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">타입</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">상태</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedBanners.map((banner, index) => (
              <tr 
                key={banner.id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`border-b border-neutral-100 transition-all cursor-grab active:cursor-grabbing
                  ${draggedIndex === index ? 'opacity-50 bg-primary-50' : 'hover:bg-neutral-50'}
                  ${dragOverIndex === index ? 'border-t-2 border-t-primary-500' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-900 w-6 text-center">{index + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-20 h-12 object-cover rounded"
                    draggable={false}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{banner.title}</p>
                  <p className="text-xs text-neutral-500 truncate max-w-[200px]">{banner.description}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    banner.imageAlign === 'full' 
                      ? 'bg-neutral-100 text-neutral-700' 
                      : 'bg-primary-100 text-primary-700'
                  }`}>
                    {banner.imageAlign === 'full' ? '전체' : '분할'}
                  </span>
                  <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded ${
                    banner.imageFit === 'cover' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {banner.imageFit === 'cover' ? 'cover' : 'contain'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleToggleActive(banner.id)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{ backgroundColor: banner.isActive ? '#10b981' : '#d1d5db' }}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        banner.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(banner)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {localBanners.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                  등록된 배너가 없습니다. 배너를 추가해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 배너 추가/수정 모달 */}
      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={!!editingBanner}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        bgColorOptions={bgColorOptions}
      />

      {/* 알림 모달 */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="알림"
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-neutral-700 font-medium mb-6 leading-relaxed">
            {alertMessage}
          </p>
          <Button 
            onClick={() => setIsAlertModalOpen(false)}
            className="w-full font-bold"
          >
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BannerManagePage;
