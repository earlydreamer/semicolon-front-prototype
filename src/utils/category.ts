import type { Category } from '@/types/category';
import type { CategoryResponse } from '@/types/product';

/**
 * Converts flat CategoryResponse list to nested Category tree.
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
 * Recursively finds the path to a specific category ID within the category tree.
 * @param categories The root category list to search.
 * @param targetId The ID of the category to find.
 * @param currentPath internal accumulator for recursion.
 * @returns An array of Category objects representing the path, or null if not found.
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
 * Finds a category by its ID.
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
 * Returns subcategories if they exist, otherwise siblings.
 */
export function getCategoryChildren(categories: Category[], id: string): Category[] {
  const node = findCategoryById(categories, id);
  if (!node) return [];

  if (node.children && node.children.length > 0) {
    return node.children;
  }

  // No children, find parent to get siblings
  const path = findCategoryPath(categories, id);
  if (path && path.length > 1) {
    const parent = path[path.length - 2];
    return parent.children || [];
  }

  return categories; // Fallback to top level
}

