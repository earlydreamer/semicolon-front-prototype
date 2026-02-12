import type { Category } from '@/types/category';
import type { CategoryResponse } from '@/types/product';

/**
 * 평면 카테고리 목록을 트리 구조로 변환합니다.
 */
export function transformCategories(items: CategoryResponse[]): Category[] {
  const buildTree = (parentId: number | null, currentDepth: number): Category[] => {
    return items
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        id: String(cat.id),
        name: cat.name,
        depth: Math.min(Math.max(currentDepth, 1), 3) as 1 | 2 | 3,
        parentId: cat.parentId === null ? null : String(cat.parentId),
        children: buildTree(cat.id, currentDepth + 1),
      }));
  };

  return buildTree(null, 1);
}

/**
 * 특정 카테고리 ID까지의 경로를 재귀적으로 찾습니다.
 */
export function findCategoryPath(
  categories: Category[],
  targetId: string,
  currentPath: Category[] = []
): Category[] | null {
  for (const cat of categories) {
    if (cat.id === targetId) {
      return [...currentPath, cat];
    }
    if (cat.children) {
      const path = findCategoryPath(cat.children, targetId, [...currentPath, cat]);
      if (path) return path;
    }
  }
  return null;
}

/**
 * ID로 카테고리를 찾습니다.
 */
export function findCategoryById(categories: Category[], id: string): Category | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 하위 카테고리가 있으면 하위를, 없으면 형제 목록을 반환합니다.
 */
export function getCategoryChildren(categories: Category[], id: string): Category[] {
  const node = findCategoryById(categories, id);
  if (!node) return [];

  if (node.children && node.children.length > 0) {
    return node.children;
  }

  const path = findCategoryPath(categories, id);
  if (path && path.length > 1) {
    const parent = path[path.length - 2];
    return parent.children || [];
  }

  return categories;
}
