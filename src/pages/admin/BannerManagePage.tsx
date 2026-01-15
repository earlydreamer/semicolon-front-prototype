/**
 * 관리자 배너 관리 페이지
 */

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useBannerStore } from '@/stores/useBannerStore';
import type { Banner, BannerInput, BannerImageAlign, BannerImageFit } from '@/types/banner';

const BannerManagePage = () => {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerActive, moveBannerUp, moveBannerDown, resetToDefault } = useBannerStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerInput>({
    title: '',
    description: '',
    image: '',
    imageAlign: 'split',
    imageFit: 'contain',
    bgColor: 'from-primary-50 to-primary-100',
    ctaText: '',
    ctaLink: '',
  });
  
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  
  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      imageAlign: 'split',
      imageFit: 'contain',
      bgColor: 'from-primary-50 to-primary-100',
      ctaText: '',
      ctaLink: '',
    });
    setIsModalOpen(true);
  };
  
  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      imageAlign: banner.imageAlign,
      imageFit: banner.imageFit,
      bgColor: banner.bgColor,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
    });
    setIsModalOpen(true);
  };
  
  const handleSubmit = () => {
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner(formData);
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      deleteBanner(id);
    }
  };
  
  const bgColorOptions = [
    { value: 'from-primary-50 to-primary-100', label: '보라색' },
    { value: 'from-blue-50 to-blue-100', label: '파란색' },
    { value: 'from-green-50 to-green-100', label: '초록색' },
    { value: 'from-orange-50 to-orange-100', label: '주황색' },
    { value: 'from-neutral-900 to-neutral-800', label: '어두운색' },
  ];
  
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">배너 관리</h1>
          <p className="text-neutral-500 mt-1">홈 화면 롤링 배너를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            배너 추가
          </Button>
        </div>
      </div>
      
      {/* 배너 목록 */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">순서</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">이미지</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">타입</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">상태</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedBanners.map((banner, index) => (
              <tr key={banner.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-neutral-900">{banner.order}</span>
                    <div className="flex flex-col ml-2">
                      <button 
                        onClick={() => moveBannerUp(banner.id)}
                        disabled={index === 0}
                        className="p-0.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveBannerDown(banner.id)}
                        disabled={index === sortedBanners.length - 1}
                        className="p-0.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-20 h-12 object-cover rounded"
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
                    onClick={() => toggleBannerActive(banner.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                      banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {banner.isActive ? '활성' : '비활성'}
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
            {banners.length === 0 && (
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? '배너 수정' : '배너 추가'}
      >
        <div className="space-y-4">
          <Input
            label="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="배너 제목을 입력하세요"
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="배너 설명을 입력하세요 (줄바꿈: \n)"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>
          
          <Input
            label="이미지 URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">레이아웃</label>
              <select
                value={formData.imageAlign}
                onChange={(e) => setFormData({ ...formData, imageAlign: e.target.value as BannerImageAlign })}
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
                onChange={(e) => setFormData({ ...formData, imageFit: e.target.value as BannerImageFit })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="contain">원본 비율 (contain)</option>
                <option value="cover">채우기 (cover)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">배경색</label>
            <select
              value={formData.bgColor}
              onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {bgColorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="버튼 텍스트"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              placeholder="거래 시작하기"
            />
            
            <Input
              label="버튼 링크"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              placeholder="/seller/products/new"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>취소</Button>
            <Button onClick={handleSubmit}>{editingBanner ? '수정' : '추가'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BannerManagePage;
