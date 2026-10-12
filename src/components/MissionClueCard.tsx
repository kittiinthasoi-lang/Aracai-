import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { ChapterMission } from '../types';
import { audioService } from '../services/audio';

interface MissionClueCardProps {
  chapterId: string;
  chapterHeading: string;
  mission: ChapterMission;
  isCompleted: boolean;
  onMissionSuccess: () => void;
  onGoNextChapter?: () => void;
  hasNextChapter: boolean;
}

export const MissionClueCard: React.FC<MissionClueCardProps> = ({
  chapterHeading,
  mission,
  isCompleted,
  onMissionSuccess,
  onGoNextChapter,
  hasNextChapter
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(isCompleted);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsWrong(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedIndex === null) return;
    if (selectedIndex === mission.correctIndex) {
      setIsAnswered(true);
      setIsWrong(false);
      audioService.playClueSuccess();
      onMissionSuccess();
    } else {
      setIsWrong(true);
      audioService.playClueFail();
    }
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setIsWrong(false);
    setShowHint(true);
  };

  return (
    <div className="my-10 p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0a122c] to-[#060b19] border border-cyan-500/40 border-glow-neon text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                ภารกิจเก็บเบาะแสประจำบท
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {chapterHeading}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-slate-100">
              {mission.clueName}
            </h3>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ปลดล็อกแล้ว</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-5">
        <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
          {mission.question}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2.5 mb-5">
        {mission.options.map((opt, idx) => {
          const isChosen = selectedIndex === idx;
          const isCorrectAnswer = idx === mission.correctIndex;

          let btnClass = 'bg-[#0f1938]/70 border-slate-700/60 text-slate-300 hover:border-cyan-500/50 hover:bg-[#15234d]';

          if (isAnswered) {
            if (isCorrectAnswer) {
              btnClass = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold shadow-md shadow-emerald-950';
            } else if (isChosen) {
              btnClass = 'bg-rose-950/40 border-rose-500/60 text-rose-300';
            }
          } else if (isChosen) {
            btnClass = 'bg-cyan-950/90 border-cyan-400 text-cyan-200 font-medium shadow-md shadow-cyan-950';
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-sm sm:text-base cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-black/40 border border-slate-600 flex items-center justify-center text-xs text-slate-300 font-semibold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {isAnswered && isCorrectAnswer && (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Wrong Answer Alert */}
      {isWrong && (
        <div className="p-3.5 mb-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">ยังไม่ใช่คำตอบที่ถูกต้องตามเหตุการณ์ในบทนี้</p>
            <p className="text-xs text-rose-300/80 mt-0.5">
              คุณสามารถลองตอบใหม่ได้ตลอดเวลาโดยไม่มีการหักคะแนน
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-xs text-white border border-rose-500/50 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ลองใหม่</span>
          </button>
        </div>
      )}

      {/* Clue unlocked fanfare */}
      {isAnswered && (
        <div className="p-4 mb-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm">
          <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ปลดล็อกเบาะแส: {mission.clueName} สำเร็จ!</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mission.clueLore}
          </p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้จากเนื้อเรื่อง'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedIndex === null}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedIndex !== null
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>ส่งคำตอบเพื่อเก็บเบาะแส</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : hasNextChapter && onGoNextChapter ? (
            <button
              onClick={onGoNextChapter}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>เปิดอ่านบทถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-amber-300 font-semibold px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
              จบบทล่าสุดของเล่มนี้แล้ว!
            </div>
          )}
        </div>
      </div>

      {/* Hint drawer */}
      {showHint && (
        <div className="mt-3.5 p-3 rounded-lg bg-[#070c1a] border border-cyan-900/50 text-xs text-cyan-200/90 leading-relaxed">
          <span className="font-semibold text-cyan-300">💡 คำใบ้: </span>
          {mission.hint}
        </div>
      )}
    </div>
  );
};
