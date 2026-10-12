import { AppSaveState } from '../types';

const STORAGE_KEY = 'aracia_novel_illustrated_save_v2';

const defaultAppState: AppSaveState = {
  version: 2,
  currentChapterId: 'c1',
  fontSize: 18,
  theme: 'neon-midnight',
  lineHeight: 1.8,
  readingWidth: 'normal',
  bookmarks: []
};

export const storageService = {
  loadState(): AppSaveState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return defaultAppState;
      const parsed = JSON.parse(serialized) as Partial<AppSaveState>;
      return {
        ...defaultAppState,
        ...parsed,
        currentChapterId: parsed.currentChapterId || 'c1'
      };
    } catch (e) {
      console.warn('Failed to load save from localStorage', e);
      return defaultAppState;
    }
  },

  saveState(state: AppSaveState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  },

  exportSaveJSON(state: AppSaveState): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        appName: 'มหากาพย์ อารยาและอาราเซีย เล่ม 1',
        appState: state
      },
      null,
      2
    );
  },

  importSaveJSON(jsonString: string): AppSaveState | null {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.appState || parsed;
      if (data) {
        return {
          ...defaultAppState,
          ...data,
          currentChapterId: data.currentChapterId || 'c1'
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  resetAll(): AppSaveState {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return defaultAppState;
  }
};
