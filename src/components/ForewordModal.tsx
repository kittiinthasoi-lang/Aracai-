import React from 'react';
import { X, Sparkles, Feather, BookMarked, CheckCircle2 } from 'lucide-react';
import { AUTHOR_FOREWORD } from '../data/lore';

interface ForewordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForewordModal: React.FC<ForewordModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#090e21] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header banner */}
        <div className="p-6 bg-gradient-to-r from-[#0d1b3d] to-[#080d1e] border-b border-cyan-900/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Feather className="w-4 h-4" />
            <span>คำนำและส่วนต้นของต้นฉบับ</span>
          </div>

          <h2 className="font-heading font-bold text-xl sm:text-2xl text-cyan-300">
            {AUTHOR_FOREWORD.workTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            โดย <span className="text-amber-300 font-semibold">{AUTHOR_FOREWORD.author}</span>
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 italic font-heading text-center">
            “{AUTHOR_FOREWORD.dedication}”
          </div>

          {AUTHOR_FOREWORD.introduction.map((paragraph, index) => (
            <p key={index} className="indent-6 text-justify">
              {paragraph}
            </p>
          ))}

          {/* Stats Breakdown Grid */}
          <div className="pt-4 border-t border-cyan-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <BookMarked className="w-4 h-4" />
              <span>ภาพรวมต้นฉบับและระบบ (157 บท)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg font-bold font-heading text-cyan-400">24 บท</div>
                <div className="text-[11px] text-slate-400 mt-0.5">เล่ม 1 (สมบูรณ์)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg font-bold font-heading text-amber-400">133 บท</div>
                <div className="text-[11px] text-slate-400 mt-0.5">เล่ม 2 (บท 0–132)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg font-bold font-heading text-emerald-400">157 บท</div>
                <div className="text-[11px] text-slate-400 mt-0.5">รวมทั้งสองเล่ม</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-lg font-bold font-heading text-sky-400">953k+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ตัวอักษรต้นฉบับ</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>จุดเด่นของระบบ ARACIA Quest</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>ภารกิจเก็บเบาะแสท้ายบท: ตอบคำถามเพื่อพิสูจน์การสังเกตการณ์ในเนื้อเรื่อง</li>
              <li>ระบบบันทึกความคืบหน้าอัตโนมัติแยกเล่มใน localStorage</li>
              <li>โหมดอ่านอิสระ: สลับเข้าสู่โหมดอ่านได้ทุกเมื่อโดยไม่ต้องผ่านภารกิจ</li>
              <li>ปรับขนาดตัวอักษร ธีมสีรัตติกาล และระยะบรรทัดเพื่อการอ่านที่สบายตา</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#060a16] border-t border-cyan-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>เริ่มต้นการอ่านและผจญภัย</span>
          </button>
        </div>
      </div>
    </div>
  );
};
