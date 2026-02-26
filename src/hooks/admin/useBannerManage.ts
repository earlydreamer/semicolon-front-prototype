import { useState, useMemo, useCallback } from 'react';
import { useBannerStore } from '@/stores/useBannerStore';
import { useToast } from '@/components/common/Toast';
import type { Banner, BannerInput } from '@/types/banner';

const MAX_BANNERS = 10;

export const useBannerManage = () => {
  const { banners: storeBanners, setBanners } = useBannerStore();
  const { showToast } = useToast();
  const baseBanners = useMemo(
    () => [...storeBanners].sort((a, b) => a.order - b.order),
    [storeBanners]
  );
  
  // 로컬 상태 (저장 전까지 변경사항 보관)
  const [localBanners, setLocalBanners] = useState<Banner[] | null>(null);
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
  
  const workingBanners = localBanners ?? baseBanners;
  const sortedBanners = useMemo(() => [...workingBanners].sort((a, b) => a.order - b.order), [workingBanners]);
  const isMaxReached = workingBanners.length >= MAX_BANNERS;

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
    setLocalBanners((prev) => {
      const source = prev ?? baseBanners;
      return source.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    });
    setHasChanges(true);
  };
  
  // 저장
  const handleSave = () => {
    setBanners(workingBanners);
    setLocalBanners(null);
    setHasChanges(false);
    showToast('준비 중이에요.', 'info');
  };
  
  // 초기화 (이전 상태로 복원)
  const handleReset = () => {
    setLocalBanners(null);
    setHasChanges(false);
  };
  
  // 배너 추가 모달 열기
  const handleOpenCreate = () => {
    if (workingBanners.length >= MAX_BANNERS) {
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
      setLocalBanners((prev) => {
        const source = prev ?? baseBanners;
        return source.map((b) =>
          b.id === editingBanner.id
            ? { ...b, ...formData, updatedAt: new Date().toISOString() }
            : b
        );
      });
    } else {
      // 추가: 로컬 상태에 새 배너 추가
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        ...formData,
        order: workingBanners.length + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setLocalBanners((prev) => [...(prev ?? baseBanners), newBanner]);
    }
    setHasChanges(true);
    setIsModalOpen(false);
  };
  
  // 배너 삭제 (로컬 상태)
  const handleDelete = (id: string) => {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      setLocalBanners((prev) => {
        const source = prev ?? baseBanners;
        const filtered = source.filter((b) => b.id !== id);
        // order 재할당
        return filtered.map((banner, idx) => ({ ...banner, order: idx + 1 }));
      });
      setHasChanges(true);
      showToast('준비 중이에요.', 'info');
    }
  };

  return {
    banners: sortedBanners,
    localBanners,
    hasChanges,
    draggedIndex,
    dragOverIndex,
    isModalOpen,
    editingBanner,
    formData,
    isAlertModalOpen,
    alertMessage,
    isMaxReached,
    setFormData,
    setIsModalOpen,
    setIsAlertModalOpen,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleToggleActive,
    handleSave,
    handleReset,
    handleOpenCreate,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
    MAX_BANNERS,
    workingCount: workingBanners.length,
  };
};
