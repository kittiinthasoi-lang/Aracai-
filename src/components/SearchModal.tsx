import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, Lock } from 'lucide-react';
import { Chapter, ReadingMode } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  unlockedChapterIds: string[];
  mode: ReadingMode;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onSelectChapter,
  unlockedChapterIds,
  mode
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return chapters.filter((c) => {
      return (
        c.heading.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.number.toString() === q
      );
    });
  }, [chapters, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#090e21] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-4 border-b border-cyan-900/40 flex items-center gap-3 bg-[#060a16]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="พิมพ์หมายเลขบท ชื่อบท หรือคำค้นหา..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {!query.trim() ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              พิมพ์ค้นหา เช่น "บทที่ 1", "ดาบ", "หมอกทมิฬ", หรือเลขบทใดๆ
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              ไม่พบบทที่ตรงกับคำว่า "{query}"
            </div>
          ) : (
            results.map((c) => {
              const isUnlocked = mode === 'free' || unlockedChapterIds.includes(c.id);

              return (
                <button
                  key={c.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    onSelectChapter(c);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#0c142c]/70 border-cyan-950 hover:border-cyan-500/50 hover:bg-[#121c3b] text-slate-200'
                      : 'bg-slate-900/30 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-cyan-400">
                        {c.heading}
                      </span>
                      <span className="text-[10px] text-slate-500">เล่ม {c.bookNumber}</span>
                    </div>
                    <div className="font-heading font-medium text-sm text-slate-100 truncate">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {c.summary}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
