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
