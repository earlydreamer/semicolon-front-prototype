/**
 * 별점 입력/표시 컴포넌트
 */

import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRating({ value, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`${SIZES[size]} ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
