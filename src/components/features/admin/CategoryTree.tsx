/**
 * 카테고리 트리 관리 컴포넌트
 */

import { useState } from 'react';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Edit2 from 'lucide-react/dist/esm/icons/edit2';
import Trash2 from 'lucide-react/dist/esm/icons/trash2';
import FolderTree from 'lucide-react/dist/esm/icons/folder-tree';
import { MOCK_CATEGORIES, type Category } from '@/mocks/categories';
import { findCategoryPath } from '@/utils/category';
import { 
  CATEGORY, 
  CONFIRM_MESSAGES, 
  ERROR_MESSAGES 
} from '@/constants';

interface CategoryItemProps {
  category: Category;
  depth: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onAddChild: (parentId: string) => void;
}

const CategoryItem = ({ category, depth, onEdit, onDelete, onAddChild }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 hover:bg-neutral-50 rounded-lg group ${
          depth > 0 ? 'ml-6' : ''
        }`}
      >
        {/* 확장/축소 버튼 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded hover:bg-neutral-200 ${!hasChildren ? 'invisible' : ''}`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {/* 카테고리 아이콘 */}
        <FolderTree className="w-4 h-4 text-primary-500" />

        {/* 카테고리 이름 */}
        <span className="flex-1 text-sm font-medium text-neutral-900">
          {category.name}
        </span>

        {/* 액션 버튼 */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={() => onAddChild(category.id)}
            className="p-1.5 hover:bg-primary-100 rounded text-primary-600"
            title="하위 카테고리 추가"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600"
            title="수정"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 hover:bg-red-100 rounded text-red-600"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 하위 카테고리 */}
      {hasChildren && isExpanded && (
        <div className="border-l border-neutral-200 ml-5">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTree = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  // 카테고리 삭제
  const handleDelete = (categoryId: string) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_CATEGORY)) return;

    const deleteFromList = (cats: Category[]): Category[] => {
      return cats
        .filter((c) => c.id !== categoryId)
        .map((c) => ({
          ...c,
          children: c.children ? deleteFromList(c.children) : undefined,
        }));
    };

    setCategories(deleteFromList(categories));
  };

  // 카테고리 수정
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  // 하위 카테고리 추가 모드 (3단계 제한 로직 도입)
  const handleAddChild = (pId: string) => {
    const path = findCategoryPath(categories, pId);
    if (path && path.length >= CATEGORY.MAX_DEPTH) {
      alert(ERROR_MESSAGES.CATEGORY_DEPTH_LIMIT);
      return;
    }
    setParentId(pId);
    setIsAdding(true);
    setNewCategoryName('');
  };

  // 새 카테고리 저장
  const handleSave = () => {
    if (!newCategoryName.trim()) return;

    if (editingCategory) {
      // 수정
      const updateInList = (cats: Category[]): Category[] => {
        return cats.map((c) => {
          if (c.id === editingCategory.id) {
            return { ...c, name: newCategoryName };
          }
          if (c.children) {
            return { ...c, children: updateInList(c.children) };
          }
          return c;
        });
      };
      setCategories(updateInList(categories));
    } else if (isAdding) {
      // 추가할 카테고리의 depth와 parentId 계산
      let depth: 1 | 2 | 3 = 1;
      if (parentId) {
        const path = findCategoryPath(categories, parentId);
        if (path) {
          depth = (path.length + 1) as 1 | 2 | 3;
        }
      }

      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: newCategoryName,
        depth,
        parentId,
      };

      if (parentId) {
        // 하위 카테고리로 추가
        const addToParent = (cats: Category[]): Category[] => {
          return cats.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                children: [...(c.children || []), newCategory],
              };
            }
            if (c.children) {
              return { ...c, children: addToParent(c.children) };
            }
            return c;
          });
        };
        setCategories(addToParent(categories));
      } else {
        // 최상위 카테고리로 추가
        setCategories([...categories, newCategory]);
      }
    }

    // 초기화
    setEditingCategory(null);
    setIsAdding(false);
    setNewCategoryName('');
    setParentId(null);
  };

  // 취소
  const handleCancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
    setNewCategoryName('');
    setParentId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {/* 헤더 */}
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-semibold text-neutral-900">카테고리 목록</h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setParentId(null);
            setNewCategoryName('');
          }}
          className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          카테고리 추가
        </button>
      </div>

      {/* 수정/추가 폼 */}
      {(editingCategory || isAdding) && (
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={editingCategory ? '카테고리 이름 수정' : '새 카테고리 이름'}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100"
            >
              취소
            </button>
          </div>
          {parentId && (
            <p className="text-xs text-neutral-500 mt-2">
              상위 카테고리의 하위로 추가됩니다
            </p>
          )}
        </div>
      )}

      {/* 트리 */}
      <div className="p-4">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            depth={0}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTree;
