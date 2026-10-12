import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_BOOK_1_CHAPTERS, ALL_BOOK_2_CHAPTERS } from './data/bookData';
import { Chapter, ReadingMode, AppSaveState, ReaderTheme } from './types';
import { storageService } from './services/storage';
import { audioService } from './services/audio';
import { Header } from './components/Header';
import { ReaderView } from './components/ReaderView';
import { ChapterListDrawer } from './components/ChapterListDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ForewordModal } from './components/ForewordModal';
import { CodexModal } from './components/CodexModal';
import { SearchModal } from './components/SearchModal';

export const App: React.FC = () => {
  // Load saved state
  const [appState, setAppState] = useState<AppSaveState>(() => storageService.loadState());

  // Active book: 1 or 2
  const activeBook = appState.activeBook;

  // Active chapters list based on active book
  const currentBookChapters = useMemo(() => {
    return activeBook === 1 ? ALL_BOOK_1_CHAPTERS : ALL_BOOK_2_CHAPTERS;
  }, [activeBook]);

  // Current progress per active book
  const activeBookProgress = activeBook === 1 ? appState.book1 : appState.book2;

  // Current chapter
  const currentChapter = useMemo(() => {
    const found = currentBookChapters.find((c) => c.id === activeBookProgress.currentChapterId);
    return found || currentBookChapters[0];
  }, [currentBookChapters, activeBookProgress.currentChapterId]);

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isForewordOpen, setIsForewordOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync sound settings with audio service
  useEffect(() => {
    audioService.setMuted(!appState.soundEnabled);
  }, [appState.soundEnabled]);

  // Persist state changes
  useEffect(() => {
    storageService.saveState(appState);
  }, [appState]);

  // Update active book
  const handleSelectBook = useCallback((book: 1 | 2) => {
    audioService.playPageTurn();
    setAppState((prev) => ({
      ...prev,
      activeBook: book
    }));
  }, []);

  // Update mode
  const handleToggleMode = useCallback((newMode: ReadingMode) => {
    setAppState((prev) => ({
      ...prev,
      mode: newMode
    }));
  }, []);

  // Select chapter
  const handleSelectChapter = useCallback((chapter: Chapter) => {
    audioService.playPageTurn();
    setAppState((prev) => {
      const bookKey = chapter.bookNumber === 1 ? 'book1' : 'book2';
      return {
        ...prev,
        activeBook: chapter.bookNumber,
        [bookKey]: {
          ...prev[bookKey],
          currentChapterId: chapter.id,
          lastReadTimestamp: Date.now()
        }
      };
    });
  }, []);

  // Complete mission & unlock next chapter
  const handleMissionSuccess = useCallback(() => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      const curProg = prev[bookKey];
      const chapterId = currentChapter.id;

      // Add to completed missions if not yet
      const newCompleted = curProg.completedMissions.includes(chapterId)
        ? curProg.completedMissions
        : [...curProg.completedMissions, chapterId];

      // Find next chapter to unlock in adventure mode
      const curIndex = currentBookChapters.findIndex((c) => c.id === chapterId);
      const nextChapter = currentBookChapters[curIndex + 1];

      let newUnlocked = curProg.unlockedChapters;
      if (nextChapter && !newUnlocked.includes(nextChapter.id)) {
        newUnlocked = [...newUnlocked, nextChapter.id];
      }

      return {
        ...prev,
        [bookKey]: {
          ...curProg,
          completedMissions: newCompleted,
          unlockedChapters: newUnlocked
        }
      };
    });
  }, [activeBook, currentChapter.id, currentBookChapters]);

  // Navigate to previous chapter
  const handleGoPrevChapter = useCallback(() => {
    const curIndex = currentBookChapters.findIndex((c) => c.id === currentChapter.id);
    if (curIndex > 0) {
      handleSelectChapter(currentBookChapters[curIndex - 1]);
    }
  }, [currentBookChapters, currentChapter.id, handleSelectChapter]);

  // Navigate to next chapter
  const handleGoNextChapter = useCallback(() => {
    const curIndex = currentBookChapters.findIndex((c) => c.id === currentChapter.id);
    if (curIndex < currentBookChapters.length - 1) {
      const next = currentBookChapters[curIndex + 1];
      handleSelectChapter(next);
    }
  }, [currentBookChapters, currentChapter.id, handleSelectChapter]);

  // Toggle bookmark on current chapter
  const handleToggleBookmark = useCallback(() => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      const bookmarks = prev[bookKey].bookmarks;
      const chapterId = currentChapter.id;
      const isBookmarked = bookmarks.includes(chapterId);

      const nextBookmarks = isBookmarked
        ? bookmarks.filter((id) => id !== chapterId)
        : [...bookmarks, chapterId];

      return {
        ...prev,
        [bookKey]: {
          ...prev[bookKey],
          bookmarks: nextBookmarks
        }
      };
    });
  }, [activeBook, currentChapter.id]);

  // Settings handlers
  const handleChangeFontSize = useCallback((size: number) => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      return {
        ...prev,
        [bookKey]: { ...prev[bookKey], fontSize: size }
      };
    });
  }, [activeBook]);

  const handleChangeLineHeight = useCallback((lh: number) => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      return {
        ...prev,
        [bookKey]: { ...prev[bookKey], lineHeight: lh }
      };
    });
  }, [activeBook]);

  const handleChangeTheme = useCallback((thm: ReaderTheme) => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      return {
        ...prev,
        [bookKey]: { ...prev[bookKey], theme: thm }
      };
    });
  }, [activeBook]);

  const handleChangeReadingWidth = useCallback((width: 'narrow' | 'normal' | 'wide') => {
    setAppState((prev) => {
      const bookKey = activeBook === 1 ? 'book1' : 'book2';
      return {
        ...prev,
        [bookKey]: { ...prev[bookKey], readingWidth: width }
      };
    });
  }, [activeBook]);

  const handleToggleSound = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  }, []);

  const handleExportSave = useCallback(() => {
    const jsonStr = storageService.exportSaveJSON(appState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aracia-story-quest-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [appState]);

  const handleImportSave = useCallback((jsonString: string): boolean => {
    const imported = storageService.importSaveJSON(jsonString);
    if (imported) {
      setAppState(imported);
      return true;
    }
    return false;
  }, []);

  const handleResetProgress = useCallback(() => {
    const fresh = storageService.resetAll();
    setAppState(fresh);
  }, []);

  // Chapter indices and next unlock check
  const curIndex = currentBookChapters.findIndex((c) => c.id === currentChapter.id);
  const hasPrev = curIndex > 0;
  const hasNext = curIndex < currentBookChapters.length - 1;
  const nextChapter = hasNext ? currentBookChapters[curIndex + 1] : null;
  const isNextUnlocked = nextChapter ? activeBookProgress.unlockedChapters.includes(nextChapter.id) : false;

  const progressPercent = Math.round(
    (activeBookProgress.completedMissions.length / currentBookChapters.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans">
      {/* Top Header navigation */}
      <Header
        activeBook={activeBook}
        onSelectBook={handleSelectBook}
        mode={appState.mode}
        onToggleMode={handleToggleMode}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenForeword={() => setIsForewordOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        progressPercent={progressPercent}
        completedMissionsCount={activeBookProgress.completedMissions.length}
        totalChaptersCount={currentBookChapters.length}
        soundEnabled={appState.soundEnabled}
        onToggleSound={handleToggleSound}
        isBookmarked={activeBookProgress.bookmarks.includes(currentChapter.id)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Main Chapter Reader View */}
      <main className="flex-1">
        <ReaderView
          chapter={currentChapter}
          mode={appState.mode}
          fontSize={activeBookProgress.fontSize}
          lineHeight={activeBookProgress.lineHeight}
          theme={activeBookProgress.theme}
          readingWidth={activeBookProgress.readingWidth}
          isBookmarked={activeBookProgress.bookmarks.includes(currentChapter.id)}
          onToggleBookmark={handleToggleBookmark}
          isMissionCompleted={activeBookProgress.completedMissions.includes(currentChapter.id)}
          onMissionSuccess={handleMissionSuccess}
          hasPrevChapter={hasPrev}
          hasNextChapter={hasNext}
          isNextUnlocked={isNextUnlocked}
          onGoPrevChapter={handleGoPrevChapter}
          onGoNextChapter={handleGoNextChapter}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      </main>

      {/* Drawer: Table of Contents */}
      <ChapterListDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chapters={currentBookChapters}
        currentChapterId={currentChapter.id}
        onSelectChapter={handleSelectChapter}
        unlockedChapterIds={activeBookProgress.unlockedChapters}
        completedMissionIds={activeBookProgress.completedMissions}
        bookmarks={activeBookProgress.bookmarks}
        mode={appState.mode}
        bookNumber={activeBook}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={activeBookProgress.fontSize}
        onChangeFontSize={handleChangeFontSize}
        lineHeight={activeBookProgress.lineHeight}
        onChangeLineHeight={handleChangeLineHeight}
        theme={activeBookProgress.theme}
        onChangeTheme={handleChangeTheme}
        readingWidth={activeBookProgress.readingWidth}
        onChangeReadingWidth={handleChangeReadingWidth}
        soundEnabled={appState.soundEnabled}
        onToggleSound={handleToggleSound}
        onExportSave={handleExportSave}
        onImportSave={handleImportSave}
        onResetProgress={handleResetProgress}
      />

      {/* Foreword & Manuscript Modal */}
      <ForewordModal
        isOpen={isForewordOpen}
        onClose={() => setIsForewordOpen(false)}
      />

      {/* Codex & Lore Modal */}
      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={currentBookChapters}
        onSelectChapter={handleSelectChapter}
        unlockedChapterIds={activeBookProgress.unlockedChapters}
        mode={appState.mode}
      />
    </div>
  );
};
export default App;
