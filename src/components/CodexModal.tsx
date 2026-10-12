import React, { useState } from 'react';
import { X, Compass, Search } from 'lucide-react';
import { CODEX_ENTRIES, LoreItem } from '../data/lore';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['ทั้งหมด', 'ตัวละคร', 'อาณาจักร', 'วัตถุโบราณ', 'พันธะสัญญา'];

  const filteredEntries = CODEX_ENTRIES.filter((entry: LoreItem) => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || entry.category === selectedCategory;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-[#080d21] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d1c42] to-[#070b1a] border-b border-cyan-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-heading font-semibold text-lg text-cyan-300">
                สารานุกรมและตำนานแห่งอาราเซีย (Aracia Codex)
              </h2>
              <p className="text-xs text-slate-400">
                บันทึกตัวละคร ประวัติศาสตร์ และเจ็ดมณฑลโบราณ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-[#060a16] border-b border-cyan-950/60 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="ค้นหาชื่อตัวละคร โบราณวัตถุ หรือมณฑล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a1024] text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-cyan-900/40 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Entries list */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-slate-200">
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#0c142e]/70 border border-cyan-900/40 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {item.category}
                </span>
                <span className="text-[11px] text-amber-400 font-medium">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-base text-slate-100">
                {item.title}
              </h3>
              <p className="text-xs text-cyan-400/80 mb-2 font-medium">
                {item.subtitle}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
