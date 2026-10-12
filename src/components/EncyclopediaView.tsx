import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleHelp, Clapperboard, Compass, Cpu, Globe2, Headphones, Landmark, MapPinned, Search, Sparkles, Users, Wind, X } from 'lucide-react';
import {
  ENCYCLOPEDIA_CATEGORIES,
  ENCYCLOPEDIA_TOPICS,
  encyclopediaCategoriesWithCounts,
  type EncyclopediaCategoryId
} from '../data/encyclopedia';

interface Props {
  picture: (url?: string) => string;
  onOpenBookOne: () => void;
  onOpenBookTwo: () => void;
  onOpenMedia: () => void;
}
const iconMap = {
  characters: Users,
  species: Globe2,
  powers: Wind,
  places: MapPinned,
  technology: Cpu,
  organizations: Landmark,
  history: Compass,
  media: Clapperboard
};
const categoryStyle: Record<EncyclopediaCategoryId, string> = {
  characters: 'from-[#294260] to-[#101c35]',
  species: 'from-[#154b57] to-[#10233b]',
  powers: 'from-[#34426d] to-[#151c39]',
  places: 'from-[#51402b] to-[#162238]',
  technology: 'from-[#173c56] to-[#10213b]',
  organizations: 'from-[#393e59] to-[#132035]',
  history: 'from-[#51432a] to-[#142036]',
  media: 'from-[#3a3458] to-[#151e36]'
};
const panel = 'rounded-2xl border border-[#344b68] bg-[#0b192f]/90';
export function EncyclopediaView({ picture, onOpenBookOne, onOpenBookTwo, onOpenMedia }: Props) {
  const [category, setCategory] = useState<EncyclopediaCategoryId | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const activeCategory = ENCYCLOPEDIA_CATEGORIES.find(c => c.id === category);
  const topic = ENCYCLOPEDIA_TOPICS.find(t => t.id === topicId);
  const results = useMemo(() => {
    const q = search.toLocaleLowerCase().trim();
    return ENCYCLOPEDIA_TOPICS.filter(t =>
      (!category || t.category === category) &&
      (!q || [t.title, t.subtitle, t.description, t.source].join(' ').toLocaleLowerCase().includes(q))
    );
  }, [search, category]);
  function startCategory(id: EncyclopediaCategoryId) {
    setSearch(''); setCategory(id); setTopicId(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function startTopic(id: string) {
    setTopicId(id); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function reset() { setTopicId(null); setCategory(null); setSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function back() {
    if (topicId) { setTopicId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else reset();
  }
  return <div className="max-w-6xl mx-auto">
    <div className="flex items-center gap-2 text-xs text-[#b3c9e5] mb-7 flex-wrap">
      <button onClick={reset} className="hover:text-[#efcb89]">สารานุกรมอาราเซีย</button>
      {activeCategory && <><ChevronRight size={14}/><button className="hover:text-[#efcb89]" onClick={()=>{setTopicId(null);setSearch('')}}>{activeCategory.name}</button></>}
      {topic && <><ChevronRight size={14}/><span className="text-[#f0cb8e]">{topic.title}</span></>}
    </div>
    {topic ? <article className="max-w-3xl mx-auto">
      <button className="flex items-center gap-2 text-[#e4bf80] text-sm mb-5" onClick={back}><ArrowLeft size={17}/> กลับไปยังรายการ</button>
      <div className={panel+' overflow-hidden'}>
        {topic.imageUrl && <div className="h-52 md:h-78 overflow-hidden bg-[#12223a]"><img src={picture(topic.imageUrl)} alt={topic.title} className="w-full h-full object-contain" loading="lazy"/></div>}
        <div className="p-6 sm:p-9">
          <div className="text-[#e9bf7a] text-xs tracking-widest">{activeCategory?.name || ENCYCLOPEDIA_CATEGORIES.find(c=>c.id===topic.category)?.name}</div>
          <h1 className="font-['Prompt'] text-2xl md:text-3xl font-semibold mt-3">{topic.title}</h1>
          <p className="text-[#e1c99c] mt-3 leading-8">{topic.subtitle}</p>
          <p className="text-[#c4d3e7] whitespace-pre-line leading-9 mt-6">{topic.description}</p>
          <div className="mt-8 border-t border-[#2b4561] pt-5"><span className="text-xs text-[#839fbf]">พบข้อมูลที่เกี่ยวข้องในเรื่อง</span><p className="text-sm text-[#d8c7a4] mt-2">{topic.source}</p></div>
          <div className="flex flex-wrap gap-3 mt-7">
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1b344a] border border-[#476988] text-sm" onClick={topic.source.includes('เล่ม 2')?onOpenBookTwo:onOpenBookOne}><BookOpen size={17}/> ไปอ่านเนื้อเรื่อง <ArrowRight size={15}/></button>
            {topic.category === 'media' && <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#806b4a] text-sm text-[#efcb87]" onClick={onOpenMedia}><Headphones size={17}/> ดูคลังสื่อ</button>}
          </div>
        </div>
      </div>
    </article> : <>
      <div className="rounded-3xl border border-[#4c5164] bg-gradient-to-br from-[#152d4b] via-[#0a1a35] to-[#0b1026] p-7 md:p-10 mb-6">
        <div className="inline-flex gap-2 items-center text-[#f1c883] text-xs tracking-[.16em]"><Sparkles size={17}/> ARACAI CODEX</div>
        <h1 className="font-['Prompt'] text-3xl sm:text-4xl font-semibold mt-4">{activeCategory ? activeCategory.name : 'สารานุกรมอาราเซีย'}</h1>
        <p className="text-[#b8cce4] leading-8 max-w-2xl mt-4">{activeCategory ? activeCategory.description : 'คลังความรู้ของจักรวาลอารยาและอาราเซีย เลือกหมวดเพื่อสำรวจตัวละคร เผ่าพันธุ์ พลัง สถานที่ วิทยาการ องค์กร และเหตุการณ์ที่ปรากฏในเรื่อง'}</p>
        {category && <button onClick={reset} className="text-[#f0c985] mt-5 text-sm inline-flex items-center gap-2"><ArrowLeft size={16}/> ดูทุกหมวด</button>}
      </div>
      <label className="flex items-center gap-3 border border-[#39536e] rounded-xl bg-[#0c1b32] px-4 mb-7">
        <Search size={18} className="text-[#96b6d6]"/>
        <input aria-label="ค้นหาข้อมูลในสารานุกรม" className="bg-transparent flex-1 min-w-0 outline-none py-4 text-sm" placeholder="ค้นหาตัวละคร สถานที่ พลัง หรือชื่ออุปกรณ์..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {search && <button onClick={()=>setSearch('')} aria-label="ล้างคำค้น"><X size={16}/></button>}
      </label>
      {!category && !search.trim() ? <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {encyclopediaCategoriesWithCounts.map(c=>{
          const Icon = iconMap[c.id];
          return <button key={c.id} onClick={()=>startCategory(c.id)} className={`text-left p-6 min-h-59 rounded-2xl border border-[#38536d] bg-gradient-to-br ${categoryStyle[c.id]} hover:border-[#d1ad70] transition group flex flex-col items-start`}>
            <span className="w-12 h-12 rounded-xl grid place-items-center border border-[#99bad2]/20 bg-black/20"><Icon size={24} className="text-[#f1d197]"/></span>
            <h2 className="font-['Prompt'] text-lg font-semibold mt-5 leading-7">{c.name}</h2>
            <p className="text-[#aec4db] text-sm leading-6 mt-2">{c.description}</p>
            <span className="mt-auto pt-5 flex items-center gap-2 text-[#efc980] text-xs">{c.count} หัวข้อ <ArrowRight size={15} className="group-hover:translate-x-1 transition"/></span>
          </button>;
        })}
      </div> : <>
        <div className="flex items-center justify-between gap-3 mb-4"><h2 className="font-['Prompt'] text-xl font-semibold">{activeCategory?.name || 'ผลการค้นหา'}</h2><span className="text-[#a4bad5] text-sm">{results.length} หัวข้อ</span></div>
        <div className="grid md:grid-cols-2 gap-3">
          {results.map(t=><button key={t.id} onClick={()=>{if(!category)setCategory(t.category);startTopic(t.id)}} className={panel+' text-left p-5 flex items-start gap-4 hover:border-[#e0b875] transition'}>
            {t.imageUrl ? <img src={picture(t.imageUrl)} alt="" loading="lazy" className="w-17 h-19 object-cover rounded-xl bg-[#192740] shrink-0"/> : <span className="w-12 h-12 shrink-0 bg-[#233b55] rounded-xl grid place-items-center"><CircleHelp size={19} className="text-[#e9c17b]"/></span>}
            <div className="flex-1 min-w-0"><span className="text-[#d9b87b] text-xs">{ENCYCLOPEDIA_CATEGORIES.find(c=>c.id===t.category)?.name}</span><h3 className="font-semibold text-lg mt-1">{t.title}</h3><p className="text-[#a7bfd9] text-sm leading-6 mt-2 line-clamp-2">{t.subtitle}</p></div><ChevronRight size={18} className="shrink-0 text-[#b6cbe0]"/>
          </button>)}
        </div>
        {!results.length && <div className={panel+' text-center p-12 text-[#aec0d9]'}>ไม่พบหัวข้อที่ตรงกับการค้นหา</div>}
      </>}
      <p className="text-xs text-[#718fb1] mt-8 leading-6">สารานุกรมนี้จัดจากข้อมูลที่บันทึกไว้แล้วในแอปและเหตุการณ์ในต้นฉบับ โดยจะเพิ่มและตรวจทานหัวข้อใหม่ได้ในอนาคต</p>
    </>}
  </div>;
}
