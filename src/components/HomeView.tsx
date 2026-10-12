import React from 'react';
import { BookOpen, Sparkles, Users, ArrowRight, Clock, Feather, Bookmark } from 'lucide-react';
import { BOOK_METADATA, ALL_BOOK_1_CHAPTERS } from '../data/bookData';
import { ALL_MAIN_CHARACTERS } from '../data/characters';
import { Chapter } from '../types';

interface HomeViewProps {
  onSelectChapter: (chapter: Chapter) => void;
  onOpenForeword: () => void;
  onOpenCharacters: () => void;
  lastReadChapterId?: string;
  bookmarks: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectChapter,
  onOpenForeword,
  onOpenCharacters,
  lastReadChapterId,
  bookmarks
}) => {
  const lastReadChapter = ALL_BOOK_1_CHAPTERS.find((c) => c.id === lastReadChapterId) || ALL_BOOK_1_CHAPTERS[0];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 bg-gradient-to-b from-[#0b132b] via-[#070b1a] to-[#050814]">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Cover Art (รูปปกที่ส่งไป) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-xs sm:max-w-sm rounded-2xl p-2 bg-gradient-to-br from-amber-500/40 via-yellow-500/20 to-cyan-500/30 shadow-2xl shadow-amber-950/60 border border-amber-500/40 transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={BOOK_METADATA.coverImage}
                alt="ปกมหากาพย์ อารยาและอาราเซีย เล่ม 1"
                className="w-full h-auto rounded-xl object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#080d1a] border border-amber-400 text-amber-300 text-xs font-semibold whitespace-nowrap shadow-md">
                24 บท • ฉบับสมบูรณ์
              </div>
            </div>
          </div>

          {/* Book Info & Description */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>นวนิยายแฟนตาซีมหากาพย์พร้อมภาพประกอบ</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-100">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                {BOOK_METADATA.title}
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-cyan-300">
              {BOOK_METADATA.volume}: {BOOK_METADATA.subtitle}
            </h2>

            <div className="text-xs text-slate-300 flex items-center gap-2 font-medium">
              <span>ประพันธ์โดย</span>
              <span className="text-amber-300 font-bold">{BOOK_METADATA.author}</span>
              <span className="text-slate-500">({BOOK_METADATA.authorFullName})</span>
            </div>

            {/* Quote / Dedication */}
            <blockquote className="p-3.5 rounded-xl bg-amber-950/20 border-l-4 border-amber-400 text-amber-200/90 text-sm italic font-heading max-w-lg">
              “{BOOK_METADATA.dedication}”
            </blockquote>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              เรื่องราวแห่งสายใยและความรักของครอบครัวหนึ่งในยุคบรรพกาล ก่อนการตื่นของพลังธาตุ
              การต่อสู้ปกป้องบ้านกับอสูรเน็กซาร์ 500 ปี และรุ่งอรุณแห่งการก่อตั้งพระราชวังอาราเซีย
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
              <button
                onClick={() => onSelectChapter(ALL_BOOK_1_CHAPTERS[0])}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                <span>เริ่มอ่านตั้งแต่บทที่ 1</span>
              </button>

              {lastReadChapter && (
                <button
                  onClick={() => onSelectChapter(lastReadChapter)}
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>อ่านต่อ: {lastReadChapter.heading}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenForeword}
                className="px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
              >
                <Feather className="w-4 h-4 text-amber-400" />
                <span>อ่านคำนำผู้เขียน</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Characters Spotlight Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-slate-100">
              ตัวละครสำคัญในเล่ม 1
            </h3>
          </div>
          <button
            onClick={onOpenCharacters}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>ดูข้อมูลและภาพประกอบทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {ALL_MAIN_CHARACTERS.map((char) => (
            <div
              key={char.id}
              onClick={onOpenCharacters}
              className="p-2.5 rounded-xl bg-[#0a1024]/80 border border-amber-500/20 hover:border-amber-400 hover:bg-[#0f1836] text-center cursor-pointer transition-all group"
            >
              <div className="relative w-16 h-20 mx-auto rounded-lg overflow-hidden border border-amber-400/30 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={char.imageUrl}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="font-heading font-semibold text-xs text-amber-200 truncate">
                {char.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {char.badge}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapters Grid Section (ครบทั้ง 24 บท แบ่งตาม 6 ภาค) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-900/40">
          <div>
            <h2 className="font-heading font-bold text-2xl text-slate-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>สารบัญทั้ง 24 บท (เลือกบทเพื่ออ่าน)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              คลิกเลือกบทเพื่อดูเรื่องย่อ แนะนำตัวละครที่มีในบท และเข้าสู่เนื้อเรื่องพร้อมภาพประกอบ
            </p>
          </div>
        </div>

        {/* Group chapters by Part */}
        {BOOK_METADATA.parts.map((part) => {
          const partChapters = ALL_BOOK_1_CHAPTERS.filter((c) => c.partNumber === part.number);

          return (
            <div key={part.number} className="mb-10">
              {/* Part Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-heading font-bold text-sm flex items-center justify-center">
                  {part.number}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-lg text-amber-200">
                    ภาคที่ {part.number}: {part.title}
                  </h3>
                  <span className="text-xs text-slate-400">{part.chaptersRange}</span>
                </div>
              </div>

              {/* Chapters Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partChapters.map((chap) => {
                  const isBookmarked = bookmarks.includes(chap.id);

                  return (
                    <div
                      key={chap.id}
                      onClick={() => onSelectChapter(chap)}
                      className="p-4 rounded-2xl bg-[#090f24]/90 border border-cyan-900/40 hover:border-amber-400/70 hover:bg-[#0e1738] transition-all duration-200 cursor-pointer shadow-md hover:shadow-amber-950/50 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Tag & Bookmark */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            {chap.heading}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{Math.ceil(chap.wordCount / 220)} นาที
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-heading font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors mb-2 line-clamp-1">
                          {chap.title}
                        </h4>

                        {/* Teaser Summary */}
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                          {chap.summary}
                        </p>
                      </div>

                      {/* Characters in this chapter */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {chap.characters.slice(0, 4).map((char) => (
                            <img
                              key={char.id}
                              src={char.imageUrl}
                              alt={char.name}
                              className="w-6 h-6 rounded-full border border-amber-400/40 object-cover"
                              title={char.name}
                              referrerPolicy="no-referrer"
                            />
                          ))}
                          {chap.characters.length > 4 && (
                            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 flex items-center justify-center font-bold">
                              +{chap.characters.length - 4}
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>อ่านบทนี้</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
