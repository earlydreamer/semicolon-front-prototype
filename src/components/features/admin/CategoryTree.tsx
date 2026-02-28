import { useCallback, useEffect, useState } from 'react';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import FolderTree from 'lucide-react/dist/esm/icons/folder-tree';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { productService } from '@/services/productService';
import type { CategoryResponse } from '@/types/product';

interface CategoryNode extends CategoryResponse {
  children: CategoryNode[];
}

interface CategoryItemProps {
  category: CategoryNode;
  depth: number;
  onUnsupportedAction: () => void;
  onAddCategory: (parentId: number, categoryName: string) => void;
}

const buildTree = (categories: CategoryResponse[]): CategoryNode[] => {
  const nodeMap = new Map<number, CategoryNode>();

  for (const category of categories) {
    nodeMap.set(category.id, { ...category, children: [] });
  }

  const rootNodes: CategoryNode[] = [];

  for (const node of nodeMap.values()) {
    if (node.parentId === null) {
      rootNodes.push(node);
      continue;
    }

    const parent = nodeMap.get(node.parentId);
    if (parent) {
      parent.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  const sortRecursively = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
    nodes.forEach((node) => sortRecursively(node.children));
  };
  sortRecursively(rootNodes);

  return rootNodes;
};

const CategoryItem = ({ category, depth, onUnsupportedAction, onAddCategory }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children.length > 0;
  const isMaxDepth = depth >= 2; // 0, 1, 2 = 3 levels max

  return (
    <div>
      <div className={`flex items-center gap-2 py-2 px-3 hover:bg-neutral-50 rounded-lg group ${depth > 0 ? 'ml-6' : ''}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded hover:bg-neutral-200 ${!hasChildren ? 'invisible' : ''}`}
          disabled={!hasChildren}
          tabIndex={hasChildren ? 0 : -1}
          aria-label={`${category.name} ${isExpanded ? '축소' : '확장'}`}
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-neutral-500" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4 text-neutral-500" aria-hidden="true" />
          )}
        </button>

        <FolderTree className="w-4 h-4 text-primary-500" aria-hidden="true" />

        <span className="flex-1 text-sm font-medium text-neutral-900">
          {category.name}
        </span>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          {!isMaxDepth && (
            <button
              type="button"
              onClick={() => {
                const name = window.prompt(`'${category.name}' 하위에 추가할 카테고리 이름을 입력하세요:`);
                if (name?.trim()) {
                  onAddCategory(category.id, name.trim());
                }
              }}
              className="p-1.5 hover:bg-primary-100 rounded text-primary-600"
              title="하위 카테고리 추가"
              aria-label={`${category.name} 하위 카테고리 추가`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onUnsupportedAction}
            className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600"
            title="수정 (백엔드 미지원)"
            aria-label={`${category.name} 카테고리 수정`}
          >
            <Edit2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onUnsupportedAction}
            className="p-1.5 hover:bg-red-100 rounded text-red-600"
            title="삭제 (백엔드 미지원)"
            aria-label={`${category.name} 카테고리 삭제`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l border-neutral-200 ml-5">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              depth={depth + 1}
              onUnsupportedAction={onUnsupportedAction}
              onAddCategory={onAddCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTree = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const categoryList = await productService.getCategories();
      setCategories(buildTree(categoryList));
    } catch (error) {
      console.error('Failed to load categories:', error);
      setErrorMessage('카테고리 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleUnsupportedAction = () => {
    showToast('수정/삭제 관리는 아직 준비 중이에요.', 'info');
  };

  const handleAddCategory = async (parentId: number | null = null, name: string) => {
    try {
      setIsLoading(true);
      await productService.createCategory(name, parentId);
      showToast('카테고리가 생성되었습니다.', 'success');
      await loadCategories();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      const msg = error.response?.data?.message || '카테고리 생성에 실패했어요.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      <div className="p-4 border-b border-neutral-200 space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
            <p>
              백엔드 생성이 구현되었습니다. 생성은 가능하지만 수정/삭제는 준비 중입니다.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-neutral-900">카테고리 목록</h3>
          <button
            type="button"
            onClick={() => {
              const name = window.prompt("최상위 카테고리 이름을 입력하세요:");
              if (name?.trim()) {
                handleAddCategory(null, name.trim());
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            카테고리 추가
          </button>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-neutral-500" role="status" aria-live="polite">
            카테고리를 불러오는 중이에요…
          </div>
        ) : errorMessage ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button variant="outline" onClick={() => void loadCategories()}>
              다시 시도
            </Button>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              depth={0}
              onUnsupportedAction={handleUnsupportedAction}
              onAddCategory={(parentId, name) => handleAddCategory(parentId, name)}
            />
          ))
        ) : (
          <div className="py-8 text-center text-sm text-neutral-500">
            등록된 카테고리가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTree;
