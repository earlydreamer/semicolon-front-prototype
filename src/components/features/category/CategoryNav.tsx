import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { cn } from '@/utils/cn';
import type { Category } from '@/types/category';

interface CategoryNavProps {
  categories: Category[];
  className?: string;
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function CategoryNav({ categories, className, onClose, variant = 'desktop' }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [expandedRootId, setExpandedRootId] = useState<string | null>(null);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);

  const handleToggleRoot = (categoryId: string) => {
    setExpandedRootId((prev) => {
      const next = prev === categoryId ? null : categoryId;
      if (next !== prev) {
        setExpandedChildId(null);
      }
      return next;
    });
  };

  const handleToggleChild = (categoryId: string) => {
    setExpandedChildId((prev) => (prev === categoryId ? null : categoryId));
  };

  const renderMobile = () => (
    <div className={cn('overflow-hidden rounded-xl border border-neutral-200 bg-white', className)}>
      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="text-sm font-bold text-neutral-900">카테고리</p>
      </div>

      <div className="max-h-[52vh] overflow-y-auto">
        {categories.map((root) => {
          const rootId = String(root.id);
          const isExpanded = expandedRootId === rootId;
          const hasChildren = (root.children?.length ?? 0) > 0;

          return (
            <div key={rootId} className="border-b border-neutral-100 last:border-b-0">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => handleToggleRoot(rootId)}
                  className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <span className="truncate pr-3">{root.name}</span>
                  <ChevronDown
                    className={cn('h-4 w-4 shrink-0 text-neutral-500 transition-transform', isExpanded && 'rotate-180')}
                  />
                </button>
              ) : (
                <Link
                  to={`/categories/${rootId}`}
                  onClick={onClose}
                  className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <span className="truncate pr-3">{root.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                </Link>
              )}

              {isExpanded && hasChildren && (
                <div className="bg-neutral-50/60 px-3 pb-3 pt-1">
                  {root.children!.map((child) => {
                    const childId = String(child.id);
                    const hasGrandChildren = (child.children?.length ?? 0) > 0;
                    const isChildExpanded = expandedChildId === childId;

                    return (
                      <div key={childId} className="mb-2 last:mb-0">
                        {hasGrandChildren ? (
                          <button
                            type="button"
                            onClick={() => handleToggleChild(childId)}
                            className="flex min-h-11 w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100"
                          >
                            <span className="truncate pr-3">{child.name}</span>
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 shrink-0 text-neutral-400 transition-transform',
                                isChildExpanded && 'rotate-180'
                              )}
                            />
                          </button>
                        ) : (
                          <Link
                            to={`/categories/${childId}`}
                            onClick={onClose}
                            className="flex min-h-11 items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100"
                          >
                            <span className="truncate pr-3">{child.name}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                          </Link>
                        )}

                        {hasGrandChildren && isChildExpanded && (
                          <div className="ml-3 mt-1.5 space-y-1 border-l border-neutral-200 pl-3">
                            {child.children!.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/categories/${sub.id}`}
                                onClick={onClose}
                                className="block rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-white hover:text-primary-700 active:bg-primary-50"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (variant === 'mobile') {
    return renderMobile();
  }

  // 데스크톱 카테고리 네비게이션입니다.
  return (
    <div
      className={cn(
        'absolute top-full left-0 z-50 flex h-[400px] w-full border-t border-neutral-200 bg-white shadow-xl',
        className
      )}
      onMouseLeave={() => onClose?.()}
    >
      {/* 1뎁스 목록 */}
      <div className="w-60 overflow-y-auto border-r border-neutral-100 bg-neutral-50">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              'flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium transition-colors hover:bg-white hover:text-primary-600',
              activeCategory?.id === category.id && 'bg-white text-primary-600'
            )}
            onMouseEnter={() => setActiveCategory(category)}
          >
            {category.name}
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>
        ))}
      </div>

      {/* 2~3뎁스 목록 */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        {activeCategory ? (
          <div className="grid grid-cols-4 gap-8">
            {activeCategory.children?.map((child) => (
              <div key={child.id} className="space-y-3">
                <Link
                  to={`/categories/${child.id}`}
                  className="block text-sm font-bold text-neutral-900 hover:text-primary-600 hover:underline"
                  onClick={onClose}
                >
                  {child.name}
                </Link>
                {child.children && (
                  <div className="flex flex-col gap-2">
                    {child.children.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/categories/${sub.id}`}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                        onClick={onClose}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">카테고리를 선택해 주세요</div>
        )}
      </div>
    </div>
  );
}
