import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Chapter, ReaderTheme, ReadingMode } from '../types';
import { MissionClueCard } from './MissionClueCard';

interface ReaderViewProps {
  chapter: Chapter;
  mode: ReadingMode;
  fontSize: number;
  lineHeight: number;
  theme: ReaderTheme;
  readingWidth: 'narrow' | 'normal' | 'wide';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMissionCompleted: boolean;
  onMissionSuccess: () => void;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  isNextUnlocked: boolean;
  onGoPrevChapter: () => void;
  onGoNextChapter: () => void;
  onOpenDrawer: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  chapter,
  mode,
  fontSize,
  lineHeight,
  theme,
  readingWidth,
  isBookmarked,
  onToggleBookmark,
  isMissionCompleted,
  onMissionSuccess,
  hasPrevChapter,
  hasNextChapter,
  isNextUnlocked,
  onGoPrevChapter,
  onGoNextChapter,
  onOpenDrawer
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.id]);

  // Width container style
  const widthClasses = {
    narrow: 'max-w-2xl',
    normal: 'max-w-3xl',
    wide: 'max-w-4xl'
  }[readingWidth];

  // Theme styling
  const themeStyles = {
    'neon-midnight': {
      bg: 'bg-[#060a17]',
      card: 'bg-[#0a1129]/80 border-cyan-500/20 text-slate-100',
      text: 'text-slate-200',
      dialogueBox: 'bg-[#081026] border-l-4 border-cyan-400 text-cyan-100',
      quoteBox: 'bg-cyan-950/30 border-cyan-400/40 text-cyan-200',
      heading: 'text-cyan-300'
    },
    'obsidian-gold': {
      bg: 'bg-[#0d0d0f]',
      card: 'bg-[#151419]/90 border-amber-500/25 text-amber-50',
      text: 'text-amber-100/90',
      dialogueBox: 'bg-[#1b191d] border-l-4 border-amber-400 text-amber-200',
      quoteBox: 'bg-amber-950/30 border-amber-400/40 text-amber-300',
      heading: 'text-amber-300'
    },
    'dark-slate': {
      bg: 'bg-[#0f172a]',
      card: 'bg-[#1e293b]/80 border-slate-700 text-slate-100',
      text: 'text-slate-300',
      dialogueBox: 'bg-[#1e293b] border-l-4 border-sky-400 text-slate-100',
      quoteBox: 'bg-slate-800/80 border-slate-600 text-sky-200',
      heading: 'text-sky-300'
    },
    'ancient-night': {
      bg: 'bg-[#120f0d]',
      card: 'bg-[#1d1815]/90 border-yellow-800/40 text-[#f3e5d0]',
      text: 'text-[#e8dac5]',
      dialogueBox: 'bg-[#241e1a] border-l-4 border-yellow-600 text-[#ffeedb]',
      quoteBox: 'bg-[#29221d] border-yellow-700/50 text-[#f5d8a8]',
      heading: 'text-[#f5d8a8]'
    }
  }[theme];

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 transition-colors ${themeStyles.bg}`}>
      <div className={`mx-auto ${widthClasses}`} ref={contentRef}>
        {/* Top breadcrumb & chapter tag */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-cyan-900/30">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDrawer}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>เล่ม {chapter.bookNumber}</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-cyan-400">{chapter.heading}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{Math.ceil(chapter.wordCount / 220)} นาทีอ่าน
            </span>
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'text-slate-500 hover:text-amber-400 border-transparent hover:border-slate-800'
              }`}
              title="คั่นหน้านี้"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Chapter Title & Header */}
        <div className="text-center mb-10 pt-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 mb-3">
            {chapter.heading}
          </span>
          <h1 className={`font-heading font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4 ${themeStyles.heading}`}>
            {chapter.title}
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto italic">
            “{chapter.summary}”
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Story Body */}
        <article
          className={`space-y-6 leading-relaxed transition-all ${themeStyles.text}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight
          }}
        >
          {chapter.scenes.map((scene, idx) => {
            if (scene.type === 'dramatic-quote') {
              return (
                <div
                  key={idx}
                  className={`p-5 my-6 rounded-xl border text-center italic font-heading font-medium ${themeStyles.quoteBox}`}
                >
                  {scene.text}
                </div>
              );
            }

            if (scene.type === 'dialogue') {
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-xl transition-all shadow-sm ${themeStyles.dialogueBox}`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-heading font-bold text-xs uppercase tracking-wider text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{scene.speaker || 'เสียงพูด'}</span>
                  </div>
                  <p className="italic font-medium">{scene.text}</p>
                </div>
              );
            }

            if (scene.type === 'lore-note') {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs sm:text-sm text-slate-300 my-4"
                >
                  {scene.text}
                </div>
              );
            }

            return (
              <p
                key={idx}
                className="indent-8 text-justify font-normal tracking-wide"
              >
                {scene.text}
              </p>
            );
          })}
        </article>

        {/* Separator */}
        <div className="my-12 flex items-center justify-center gap-4 text-slate-700">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="font-heading text-xs tracking-widest text-cyan-500/60 uppercase">
            ❖ ARACIA CHRONICLES ❖
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Adventure Mission Card */}
        <MissionClueCard
          chapterId={chapter.id}
          chapterHeading={chapter.heading}
          mission={chapter.mission}
          isCompleted={isMissionCompleted}
          onMissionSuccess={onMissionSuccess}
          onGoNextChapter={hasNextChapter ? onGoNextChapter : undefined}
          hasNextChapter={hasNextChapter}
        />

        {/* Bottom Chapter Navigation Bar */}
        <nav className="flex items-center justify-between gap-4 pt-8 pb-16 border-t border-cyan-900/30">
          <button
            onClick={onGoPrevChapter}
            disabled={!hasPrevChapter}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              hasPrevChapter
                ? 'bg-slate-900/80 text-slate-200 border-slate-700 hover:border-cyan-500 hover:text-cyan-300'
                : 'opacity-40 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">บทก่อนหน้า</span>
          </button>

          <button
            onClick={onOpenDrawer}
            className="px-3 py-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-xs hover:bg-cyan-900/40 transition-colors cursor-pointer"
          >
            เปิดสารบัญ
          </button>

          <button
            onClick={onGoNextChapter}
            disabled={!hasNextChapter || (mode === 'adventure' && !isNextUnlocked)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              hasNextChapter && (mode === 'free' || isNextUnlocked)
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
                : 'opacity-40 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
            title={
              !hasNextChapter
                ? 'จบบทล่าสุดแล้ว'
                : mode === 'adventure' && !isNextUnlocked
                ? 'ต้องผ่านภารกิจเบาะแสของบทนี้ก่อน'
                : 'ไปบทถัดไป'
            }
          >
            <span className="hidden sm:inline">บทถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};
