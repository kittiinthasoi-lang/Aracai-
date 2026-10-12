export type ReaderTheme = 'neon-midnight' | 'obsidian-gold' | 'dark-slate' | 'ancient-night';

export interface SceneBlock {
  type: 'paragraph' | 'dialogue' | 'lore-note' | 'dramatic-quote' | 'illustration';
  speaker?: string;
  text?: string;
  imageUrl?: string;
  caption?: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  title: string;
  age?: string;
  elementOrPower: string;
  description: string;
  imageUrl: string;
  badge: string;
}

export interface Chapter {
  id: string; // e.g. 'c1', 'c2' ... 'c24'
  partNumber: number;
  partTitle: string;
  number: number;
  heading: string;
  title: string;
  summary: string;
  wordCount: number;
  featuredImage?: string;
  characters: CharacterItem[];
  scenes: SceneBlock[];
}

export interface AppSaveState {
  version: number;
  currentChapterId: string;
  fontSize: number;
  theme: ReaderTheme;
  lineHeight: number;
  readingWidth: 'narrow' | 'normal' | 'wide';
  bookmarks: string[];
}
