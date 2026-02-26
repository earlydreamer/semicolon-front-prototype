import { BannerTableRow } from './BannerTableRow';
import type { Banner } from '@/types/banner';

interface BannerTableProps {
  banners: Banner[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  onToggleActive: (id: string) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export const BannerTable = ({
  banners,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleActive,
  onEdit,
  onDelete,
}: BannerTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-[880px] w-full">
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
          {banners.map((banner, index) => (
            <BannerTableRow
              key={banner.id}
              banner={banner}
              index={index}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {banners.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                등록된 배너가 없습니다. 배너를 추가해 주세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
