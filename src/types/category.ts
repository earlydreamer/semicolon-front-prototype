export interface Category {
  id: string;
  name: string;
  depth: 1 | 2 | 3;
  parentId: string | null;
  children?: Category[];
}

