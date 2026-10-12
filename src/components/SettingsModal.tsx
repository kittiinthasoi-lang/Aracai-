import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, Volume2, VolumeX, Check, AlertCircle } from 'lucide-react';
import { ReaderTheme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  lineHeight: number;
  onChangeLineHeight: (height: number) => void;
  theme: ReaderTheme;
  onChangeTheme: (theme: ReaderTheme) => void;
  readingWidth: 'narrow' | 'normal' | 'wide';
  onChangeReadingWidth: (width: 'narrow' | 'normal' | 'wide') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExportSave: () => void;
  onImportSave: (jsonString: string) => boolean;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onChangeFontSize,
  lineHeight,
  onChangeLineHeight,
  theme,
  onChangeTheme,
  readingWidth,
  onChangeReadingWidth,
  soundEnabled,
  onToggleSound,
  onExportSave,
  onImportSave,
  onResetProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = onImportSave(text);
      setImportStatus(success ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 4000);
    };
    reader.readAsText(file);
  };

  const themesList: { id: ReaderTheme; label: string; bg: string; border: string; accent: string }[] = [
    { id: 'neon-midnight', label: 'น้ำเงินนีออน (คลาสสิก)', bg: 'bg-[#060a17]', border: 'border-cyan-500', accent: 'text-cyan-400' },
    { id: 'obsidian-gold', label: 'นิลกาฬทองคำ', bg: 'bg-[#0d0d0f]', border: 'border-amber-500', accent: 'text-amber-400' },
    { id: 'dark-slate', label: 'รัตติกาลเรียบง่าย', bg: 'bg-[#0f172a]', border: 'border-sky-500', accent: 'text-sky-400' },
    { id: 'ancient-night', label: 'กระดาษโบราณ', bg: 'bg-[#181411]', border: 'border-yellow-700', accent: 'text-[#f5d8a8]' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-lg bg-[#090e1f] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-900/40 flex items-center justify-between bg-[#060a16]">
          <h2 className="font-heading font-semibold text-lg text-cyan-300">
            ปรับแต่งการอ่านและการสำรองข้อมูล
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          {/* Typography: Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">ขนาดตัวอักษร</label>
              <span className="text-xs text-cyan-400 font-mono">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeFontSize(Math.max(14, fontSize - 2))}
                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                A-
              </button>
              <input
                type="range"
                min={14}
                max={26}
                step={1}
                value={fontSize}
                onChange={(e) => onChangeFontSize(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <button
                onClick={() => onChangeFontSize(Math.min(26, fontSize + 2))}
                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-base font-bold cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ระยะบรรทัด</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'กระชับ (1.5)', value: 1.5 },
                { label: 'มาตรฐาน (1.8)', value: 1.8 },
                { label: 'โปร่งสบาย (2.1)', value: 2.1 }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => onChangeLineHeight(item.value)}
                  className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    lineHeight === item.value
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Column Width */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ความกว้างหน้าอ่าน</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'narrow', label: 'แคบ' },
                { id: 'normal', label: 'ปานกลาง' },
                { id: 'wide', label: 'เต็มจอ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChangeReadingWidth(item.id as 'narrow' | 'normal' | 'wide')}
                  className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    readingWidth === item.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2.5">ธีมสีการอ่าน</label>
            <div className="grid grid-cols-2 gap-2.5">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChangeTheme(t.id)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${t.bg} ${
                    theme === t.id
                      ? `${t.border} shadow-lg ring-1 ring-cyan-400/40`
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-xs font-semibold ${t.accent}`}>{t.label}</span>
                  {theme === t.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <div className="text-sm font-medium text-slate-200">เสียงเอฟเฟกต์เบาะแส</div>
                <div className="text-xs text-slate-500">สังเคราะห์ผ่าน Web Audio API ไม่กินแบนด์วิธ</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                soundEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Export / Import Save Data (as emphasized in README) */}
          <div className="pt-4 border-t border-cyan-900/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              สำรองและย้ายข้อมูลการอ่าน (Backup & Transfer)
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              ข้อมูลความคืบหน้าจะบันทึกอยู่ในเบราว์เซอร์นี้ หากต้องการย้ายไปอ่านบนอุปกรณ์อื่น ท่านสามารถส่งออกไฟล์ JSON และนำเข้าได้ทันที
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onExportSave}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 text-cyan-300 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>ส่งออกไฟล์บันทึก (.json)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-2 text-amber-300 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>นำเข้าไฟล์บันทึก</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {importStatus === 'success' && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>นำเข้าข้อมูลความคืบหน้าสำเร็จเรียบร้อย!</span>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>ไฟล์ข้อมูลไม่ถูกต้อง โปรดตรวจสอบว่าเป็นไฟล์ที่ส่งออกจาก ARACIA</span>
              </div>
            )}
          </div>

          {/* Reset progress */}
          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-rose-400/80 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตประวัติการอ่านทั้งหมด</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs">
                <p className="text-rose-200 mb-2">ต้องการล้างความคืบหน้าและเริ่มต้นใหม่ทั้งหมดใช่หรือไม่?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 rounded bg-rose-600 text-white font-medium hover:bg-rose-500 cursor-pointer"
                  >
                    ยืนยันการล้างข้อมูล
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
