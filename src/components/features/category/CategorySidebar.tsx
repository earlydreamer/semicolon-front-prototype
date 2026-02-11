import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { cn } from '@/utils/cn';
import { productService } from '@/services/productService';
import { transformCategories } from '@/utils/category';
import type { Category } from '@/types/category';

interface CategoryItemProps {
  category: Category;
  currentCategoryId?: string;
  depth?: number;
}

function CategoryItem({ category, currentCategoryId, depth = 0 }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  
  // Check if this category or any of its descendants is currently selected
  const isActive = currentCategoryId === String(category.id);
  const isChildActive = (cat: Category): boolean => {
    if (String(cat.id) === currentCategoryId) return true;
    if (cat.children) {
      return cat.children.some(child => isChildActive(child));
    }
    return false;
  };
  
  // Auto-expand if a child is active
  useEffect(() => {
    if (hasChildren && isChildActive(category)) {
      setIsOpen(true);
    }
  }, [currentCategoryId, category]);

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
          isActive 
            ? "bg-primary-50 text-primary-600 font-semibold" 
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
          depth > 0 && "ml-4"
        )}
      >
        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            className="p-0.5 hover:bg-neutral-200 rounded text-neutral-400"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5" /> // Spacer for alignment
        )}

        {/* Link to Category */}
        <Link 
          to={`/categories/${category.id}`} 
          className="flex-1 flex items-center gap-2"
        >
          {category.name}
        </Link>
      </div>

      {/* Render Children */}
      {hasChildren && isOpen && (
        <div className="mt-1 border-l border-neutral-100 ml-4 pl-1">
          {category.children!.map((child) => (
            <CategoryItem 
              key={child.id} 
              category={child} 
              currentCategoryId={currentCategoryId} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategorySidebar() {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(transformCategories(data));
      } catch (error) {
        console.error('Failed to load categories sidebar:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <aside className="w-full">
        <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-100 rounded w-full"></div>
              <div className="h-4 bg-neutral-100 rounded w-full"></div>
              <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full">
      <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b border-neutral-100 font-bold bg-neutral-50 text-neutral-800">
          移댄뀒怨좊━ ?먯깋
        </div>
        <div className="p-2">
          {categories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              currentCategoryId={categoryId} 
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

