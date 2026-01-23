import { useState } from 'react';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { cn } from '@/utils/cn';

export type SortOption = 'latest' | 'popular' | 'price-asc' | 'price-desc';

interface ProductSortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ProductSortDropdown({ currentSort, onSortChange }: ProductSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: SortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'price-asc', label: '저가순' },
    { value: 'price-desc', label: '고가순' },
  ];

  const currentLabel = options.find((opt) => opt.value === currentSort)?.label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        {currentLabel}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm hover:bg-neutral-50",
                  currentSort === option.value ? "font-bold text-primary-600" : "text-neutral-600"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
