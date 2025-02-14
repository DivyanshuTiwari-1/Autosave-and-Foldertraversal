// src/types/types.ts
export interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
}