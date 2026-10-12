import React from 'react';
import { BookOpen, Home, Menu, Settings, Users, Bookmark, Sparkles, BookMarked } from 'lucide-react';

interface HeaderProps {
  currentChapterHeading?: string;
  isHome: boolean;
  onGoHome: () => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenForeword: () => void;
  onOpenCharacters: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentChapterHeading,
  isHome,
  onGoHome,
  onOpenDrawer,
  onOpenSettings,
  onOpenForeword,
  onOpenCharacters,
  isBookmarked,
  onToggleBookmark
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Home / TOC */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/90 text-cyan-400 hover:bg-slate-800 hover:text-cyan-200 border border-cyan-500/30 transition-all cursor-pointer"
            title="เปิดสารบัญ 24 บท"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-medium">สารบัญ</span>
          </button>

          {!isHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/90 text-amber-400 hover:bg-slate-800 hover:text-amber-200 border border-amber-500/30 transition-all cursor-pointer"
              title="กลับหน้าแรก"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium">หน้าแรก</span>
            </button>
          )}

          <div className="flex flex-col cursor-pointer" onClick={onGoHome}>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
                อารยาและอาราเซีย
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                เล่ม 1
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden md:inline">
              ก่อนที่โลกจะรู้จักชื่อของพวกเขา • กิตติอุซ KZ
            </span>
          </div>
        </div>

        {/* Center: Current Chapter Indicator (if not on Home) */}
        {!isHome && currentChapterHeading && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{currentChapterHeading}</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Character Gallery Button */}
          <button
            onClick={onOpenCharacters}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 text-amber-300 hover:bg-amber-950/40 hover:text-amber-200 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="ดูตัวละครทั้งหมดพร้อมภาพประกอบ"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">ตัวละคร</span>
          </button>

          {/* Foreword */}
          <button
            onClick={onOpenForeword}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-amber-300 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="คำนำผู้เขียน (กิตติอุซ)"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          {/* Bookmark (when inside a chapter) */}
          {!isHome && onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-900/80 text-slate-400 hover:text-amber-300 border-slate-800'
              }`}
              title={isBookmarked ? 'ลบคั่นหน้านี้' : 'คั่นหน้านี้'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          {/* Reader Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="ตั้งค่าตัวอักษรและธีมการอ่าน"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
