/**
 * 관리자 배너 관리 페이지
 * 
 * 기능:
 * - 드래그 앤 드롭으로 순서 변경
 * - 저장 버튼으로 변경사항 반영
 * - 초기화 버튼으로 이전 상태 복원
 * - 최대 10개 배너 제한
 */

import Plus from 'lucide-react/dist/esm/icons/plus';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw';
import Save from 'lucide-react/dist/esm/icons/save';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

import { Button } from '@/components/common/Button';
import { BannerFormModal } from '@/components/features/admin/BannerFormModal';
import { Modal } from '@/components/common/Modal';
import { MockDataNotice } from '@/components/common/MockDataNotice';
import { BannerTable } from '@/components/features/admin/BannerTable';
import { useBannerManage } from '@/hooks/admin/useBannerManage';

const bgColorOptions = [
  { value: 'from-primary-50 to-primary-100', label: '보라색' },
  { value: 'from-blue-50 to-blue-100', label: '파란색' },
  { value: 'from-green-50 to-green-100', label: '초록색' },
  { value: 'from-orange-50 to-orange-100', label: '주황색' },
  { value: 'from-neutral-900 to-neutral-800', label: '어두운색' },
];

const BannerManagePage = () => {
  const {
    banners,
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
    workingCount,
  } = useBannerManage();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-3 min-[360px]:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">배너 관리</h1>
          <p className="text-neutral-500 mt-1">
            홈 화면 롤링 배너를 관리합니다 ({workingCount} / {MAX_BANNERS})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
            초기화
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-primary-600 hover:bg-primary-700' : ''}
          >
            <Save className="w-4 h-4 mr-2" aria-hidden="true" />
            저장
          </Button>
          <Button
            onClick={handleOpenCreate}
            disabled={isMaxReached}
            title={isMaxReached ? `배너는 최대 ${MAX_BANNERS}개까지 등록할 수 있습니다.` : ''}
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            배너 추가
          </Button>
        </div>
      </div>

      <MockDataNotice message="배너 API 연동 준비중입니다. 현재 변경사항은 mock 데이터로 동작합니다." />

      {/* 변경사항 알림 */}
      {hasChanges && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">변경사항이 있습니다. 저장 버튼을 눌러 반영하세요.</span>
        </div>
      )}

      {/* 최대 배너 경고 */}
      {isMaxReached && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">
            최대 {MAX_BANNERS}개의 배너가 등록되어 있습니다. 새 배너를 추가하려면 기존 배너를 삭제하세요.
          </span>
        </div>
      )}

      {/* 배너 목록 테이블 */}
      <BannerTable
        banners={banners}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onToggleActive={handleToggleActive}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

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
      <Modal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} title="알림" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" aria-hidden="true" />
          </div>
          <p className="text-neutral-700 font-medium mb-6 leading-relaxed">{alertMessage}</p>
          <Button onClick={() => setIsAlertModalOpen(false)} className="w-full font-bold">
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BannerManagePage;
