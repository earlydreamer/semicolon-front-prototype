import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { cn } from '@/utils/cn';
import type { Category } from '@/mocks/categories';

interface CategoryNavProps {
  categories: Category[];
  className?: string;
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function CategoryNav({ categories, className, onClose, variant = 'desktop' }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  if (variant === 'mobile') {
    return (
      <div className={cn("flex flex-col", className)}>
        {categories.map((category) => (
          <div key={category.id} className="border-b border-neutral-100 last:border-0">
            <div className="flex items-center justify-between py-3">
              <Link 
                to={`/categories/${category.id}`} 
                onClick={onClose}
                className="font-medium text-neutral-900 hover:text-primary-600"
              >
                {category.name}
              </Link>
            </div>
            {category.children && (
              <div className="ml-4 flex flex-col gap-2 pb-3">
                {category.children.map((child) => (
                  <div key={child.id} className="space-y-1">
                    <Link 
                      to={`/categories/${child.id}`}
                      onClick={onClose}
                      className="text-sm text-neutral-600 hover:text-primary-600 font-medium"
                    >
                      {child.name}
                    </Link>
                        {child.children && (
                          <div className="ml-3 flex flex-wrap gap-x-3 gap-y-1">
                             {child.children.map((sub) => (
                               <Link 
                                 key={sub.id} 
                                 to={`/categories/${sub.id}`}
                                 onClick={onClose}
                                 className="text-xs text-neutral-400 hover:text-primary-600 transition-colors"
                               >
                                 {sub.name}
                               </Link>
                             ))}
                          </div>
                        )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Desktop implementation
  return (
    <div 
      className={cn(
        "absolute top-full left-0 z-50 flex h-[400px] w-full border-t border-neutral-200 bg-white shadow-xl", 
        className
      )}
      onMouseLeave={() => onClose?.()}
    >
      {/* 1 Depth */}
      <div className="w-60 overflow-y-auto border-r border-neutral-100 bg-neutral-50">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "flex w-full items-center justify-between px-6 py-3 text-left text-sm font-medium transition-colors hover:bg-white hover:text-primary-600",
              activeCategory?.id === category.id && "bg-white text-primary-600"
            )}
            onMouseEnter={() => setActiveCategory(category)}
          >
            {category.name}
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>
        ))}
      </div>

      {/* 2 & 3 Depth */}
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
          <div className="flex h-full items-center justify-center text-neutral-400">
            카테고리를 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}
