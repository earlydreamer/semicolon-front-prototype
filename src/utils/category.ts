import type { Category } from '@/mocks/categories';

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
