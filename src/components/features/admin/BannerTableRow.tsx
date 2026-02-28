import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { Banner } from '@/types/banner';

interface BannerTableRowProps {
  banner: Banner;
  index: number;
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

export const BannerTableRow = ({
  banner,
  index,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleActive,
  onEdit,
  onDelete,
}: BannerTableRowProps) => {
  return (
    <tr
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onDragEnd={onDragEnd}
      className={`border-b border-neutral-100 transition-[background-color,border-color,opacity] cursor-grab active:cursor-grabbing
        ${draggedIndex === index ? 'opacity-50 bg-primary-50' : 'hover:bg-neutral-50'}
        ${dragOverIndex === index ? 'border-t-2 border-t-primary-500' : ''}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span className="text-sm font-medium text-neutral-900 w-6 text-center">{index + 1}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <img
          src={banner.image}
          alt={banner.title}
          width={80}
          height={48}
          className="w-20 h-12 object-cover rounded"
          draggable={false}
        />
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{banner.title}</p>
        <p className="text-xs text-neutral-500 truncate max-w-[200px]">{banner.description}</p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
            banner.imageAlign === 'full' ? 'bg-neutral-100 text-neutral-700' : 'bg-primary-100 text-primary-700'
          }`}
        >
          {banner.imageAlign === 'full' ? '전체' : '분할'}
        </span>
        <span
          className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded ${
            banner.imageFit === 'cover' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {banner.imageFit === 'cover' ? 'cover' : 'contain'}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onToggleActive(banner.id)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{ backgroundColor: banner.isActive ? '#10b981' : '#d1d5db' }}
          role="switch"
          aria-checked={banner.isActive}
          aria-label={`${banner.title} 배너 활성화 상태 전환`}
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
          <Button variant="ghost" size="sm" onClick={() => onEdit(banner)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(banner.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
