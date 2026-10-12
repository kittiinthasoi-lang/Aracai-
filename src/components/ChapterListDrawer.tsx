import React, { useState } from 'react';
import { X, Search, CheckCircle2, Lock, Bookmark, Sparkles, BookOpen } from 'lucide-react';
import { Chapter, ReadingMode } from '../types';

interface ChapterListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (chapter: Chapter) => void;
  unlockedChapterIds: string[];
  completedMissionIds: string[];
  bookmarks: string[];
  mode: ReadingMode;
  bookNumber: 1 | 2;
}

export const ChapterListDrawer: React.FC<ChapterListDrawerProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
  unlockedChapterIds,
  completedMissionIds,
  bookmarks,
  mode,
  bookNumber
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unlocked' | 'completed' | 'bookmarked'>('all');

  if (!isOpen) return null;

  const filteredChapters = chapters.filter((chap) => {
    // Search filter
    const matchesSearch =
      chap.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chap.number.toString().includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterType === 'bookmarked') return bookmarks.includes(chap.id);
    if (filterType === 'completed') return completedMissionIds.includes(chap.id);
    if (filterType === 'unlocked' && mode === 'adventure') return unlockedChapterIds.includes(chap.id);

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative z-10 w-full max-w-md bg-[#090e1f] border-r border-cyan-500/20 text-slate-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-cyan-900/40 flex items-center justify-between bg-[#060a16]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-heading font-semibold text-base text-cyan-300">
                สารบัญ เล่ม {bookNumber}
              </h2>
              <p className="text-xs text-slate-400">
                {chapters.length} บท • {mode === 'adventure' ? 'โหมดผจญภัย' : 'โหมดอ่านอิสระ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-cyan-950/60 bg-[#070b19]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาเลขบท ชื่อบท หรือเหตุการณ์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#050814] text-sm text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-cyan-900/40 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              ทั้งหมด ({chapters.length})
            </button>
            {mode === 'adventure' && (
              <button
                onClick={() => setFilterType('unlocked')}
                className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'unlocked'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                ปลดล็อก ({unlockedChapterIds.length})
              </button>
            )}
            <button
              onClick={() => setFilterType('completed')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              ผ่านเบาะแส ({completedMissionIds.length})
            </button>
            <button
              onClick={() => setFilterType('bookmarked')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'bookmarked'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              คั่นหน้า ({bookmarks.length})
            </button>
          </div>
        </div>

        {/* Chapters list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredChapters.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              ไม่พบบทที่ค้นหา
            </div>
          ) : (
            filteredChapters.map((chap) => {
              const isCurrent = chap.id === currentChapterId;
              const isUnlocked = mode === 'free' || unlockedChapterIds.includes(chap.id);
              const isCompleted = completedMissionIds.includes(chap.id);
              const isBookmarked = bookmarks.includes(chap.id);

              return (
                <button
                  key={chap.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    onSelectChapter(chap);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-950/70 border-cyan-400/80 shadow-md shadow-cyan-950 text-white'
                      : isUnlocked
                      ? 'bg-[#0d142b]/60 border-cyan-900/30 hover:border-cyan-500/40 hover:bg-[#121c3b] text-slate-300'
                      : 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Status icon */}
                  <div className="mt-0.5 shrink-0">
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-cyan-700/50" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold ${isCurrent ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {chap.heading}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <span className="text-[10px] text-slate-500">
                          ~{chap.wordCount.toLocaleString()} คำ
                        </span>
                      </div>
                    </div>
                    <div className="font-heading font-medium text-sm text-slate-200 truncate mt-0.5">
                      {chap.title}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {chap.summary}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-cyan-950/80 bg-[#060a16] text-[11px] text-slate-400 text-center flex items-center justify-between">
          <span>{mode === 'adventure' ? '🔒 ปลดล็อกด้วยภารกิจท้ายบท' : '✨ เปิดอ่านได้ทุกบทอิสระ'}</span>
          <span className="text-cyan-400">{filteredChapters.length} รายการ</span>
        </div>
      </div>
    </div>
  );
};
