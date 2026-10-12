import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, ChevronRight, Clock3, Compass, Film, Headphones, Home, LibraryBig, Menu, Pause, Play, Search, ScrollText, Users, VolumeX, X } from 'lucide-react';
import { ALL_BOOK_1_CHAPTERS, BOOK_METADATA } from './data/bookData';
import { ALL_MAIN_CHARACTERS, BOOK_IMAGES } from './data/characters';
import { AUTHOR_FOREWORD, CODEX_ENTRIES } from './data/lore';
import { MEDIA_EPISODES } from './data/mediaCatalog';
import { VolumeTwoView } from './components/VolumeTwoView';
import type { Chapter } from './types';

type Page = 'home' | 'books' | 'volume2' | 'reader' | 'characters' | 'world' | 'history' | 'media' | 'about';
type Saved = { chapterId: string; bookmarks: string[]; fontSize: number };
type VoiceStatus = 'idle' | 'playing' | 'paused';
const THEME = 'aracai-universe-v1';
const photoMap: Record<string, string> = {
  'aracia_cover_1791796805372.jpg': new URL('./assets/images/aracia_cover_1791796805372.jpg', import.meta.url).href,
  'world_tree_scene_1791797436764.jpg': new URL('./assets/images/world_tree_scene_1791797436764.jpg', import.meta.url).href,
  'palace_aracia_scene_1791797506284.jpg': new URL('./assets/images/palace_aracia_scene_1791797506284.jpg', import.meta.url).href,
  'araya_char_1791796865664.jpg': new URL('./assets/images/araya_char_1791796865664.jpg', import.meta.url).href,
  'grandpa_char_1791797362428.jpg': new URL('./assets/images/grandpa_char_1791797362428.jpg', import.meta.url).href,
  'tharan_char_1791796914364.jpg': new URL('./assets/images/tharan_char_1791796914364.jpg', import.meta.url).href,
  'sera_char_1791796979829.jpg': new URL('./assets/images/sera_char_1791796979829.jpg', import.meta.url).href,
  'varin_char_1791797065441.jpg': new URL('./assets/images/varin_char_1791797065441.jpg', import.meta.url).href,
  'akin_char_1791797107341.jpg': new URL('./assets/images/akin_char_1791797107341.jpg', import.meta.url).href,
  'kiran_char_1791797155628.jpg': new URL('./assets/images/kiran_char_1791797155628.jpg', import.meta.url).href,
  'kairos_char_1791797202437.jpg': new URL('./assets/images/kairos_char_1791797202437.jpg', import.meta.url).href,
  'nexar_monster_1791797260459.jpg': new URL('./assets/images/nexar_monster_1791797260459.jpg', import.meta.url).href
};
const picture = (url?: string) => url ? photoMap[url.split('/').pop() || ''] || url : photoMap['aracia_cover_1791796805372.jpg'];
const menu = [
  { id: 'home' as Page, label: 'หน้าแรก', Icon: Home },
  { id: 'books' as Page, label: 'เล่ม 1', Icon: BookOpen },
  { id: 'volume2' as Page, label: 'เล่ม 2 — โลกหลังแสง', Icon: BookOpen },
  { id: 'characters' as Page, label: 'ตัวละคร', Icon: Users },
  { id: 'world' as Page, label: 'สารานุกรม', Icon: Compass },
  { id: 'history' as Page, label: 'เส้นเวลา', Icon: ScrollText },
  { id: 'media' as Page, label: 'เสียงและอนิเมชั่น', Icon: Film },
  { id: 'about' as Page, label: 'เกี่ยวกับเรื่อง', Icon: LibraryBig }
];
function restore(): Saved {
  const initial: Saved = { chapterId: 'c1', bookmarks: [], fontSize: 19 };
  try {
    const raw = localStorage.getItem(THEME) || localStorage.getItem('aracia_novel_illustrated_save_v2');
    if (!raw) return initial;
    const value = JSON.parse(raw) as Partial<Saved & { currentChapterId: string }>;
    return {
      chapterId: typeof (value.chapterId || value.currentChapterId) === 'string' ? (value.chapterId || value.currentChapterId || 'c1') : 'c1',
      bookmarks: Array.isArray(value.bookmarks) ? value.bookmarks.filter((x): x is string => typeof x === 'string') : [],
      fontSize: typeof value.fontSize === 'number' ? Math.max(15, Math.min(26, value.fontSize)) : 19
    };
  } catch { return initial; }
}
const panel = 'rounded-2xl border border-[#243c5b] bg-[#0b172c]';
const action = 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f4d28b] to-[#c9a35d] px-5 py-3 font-semibold text-[#081427] hover:brightness-110 transition';
const outline = 'inline-flex items-center gap-2 rounded-xl border border-[#3b5674] bg-[#0a1a31]/80 px-5 py-3 text-[#cbdbee] hover:bg-[#152d4c] transition';
const kicker = 'text-[11px] font-bold uppercase tracking-[.19em] text-[#e8bf77]';
const muted = 'text-[#9cb1cc]';
const title = 'font-["Prompt"] text-3xl md:text-4xl font-semibold';
const history = [
  ['ครอบครัวก่อนการตื่น', 'บทที่ 1–7', 'ความรัก การพลัดพราก คำสัญญา และการเติบโตของครอบครัว', BOOK_IMAGES.cover],
  ['ต้นไม้ยักษ์และลูกไฟจากฟ้า', 'บทที่ 8–10', 'ต้นไม้ยักษ์ อุกกาบาต และผลไม้เรืองแสงที่เปลี่ยนชีวิต', BOOK_IMAGES.worldTree],
  ['การตื่นของเจ็ดชีวิต', 'บทที่ 11–12', 'การค้นพบพลังใหม่และการฝึกฝนของทุกคน', BOOK_IMAGES.worldTree],
  ['เงาทมิฬ 500 ปี', 'บทที่ 13–15', 'ที่มาของเน็กซาร์และการตามล่าตลอดหลายร้อยปี', BOOK_IMAGES.worldTree],
  ['ศึกเจ็ดต่อหนึ่ง', 'บทที่ 16–20', 'การร่วมต่อสู้กับเน็กซาร์และการผนึกที่เปลี่ยนโลก', BOOK_IMAGES.worldTree],
  ['รุ่งอรุณของโลกใหม่', 'บทที่ 21–24', 'เผ่าพันธุ์ใหม่และจุดเริ่มต้นของอาราเซีย', BOOK_IMAGES.palace]
] as const;
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [saved, setSaved] = useState<Saved>(restore);
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [characterId, setCharacterId] = useState(ALL_MAIN_CHARACTERS[0].id);
  const [category, setCategory] = useState('ทั้งหมด');
  const [mediaMode, setMediaMode] = useState<'audio' | 'video'>('audio');
  const [voice, setVoice] = useState<VoiceStatus>('idle');
  const generation = useRef(0);
  const chapter = ALL_BOOK_1_CHAPTERS.find(c => c.id === saved.chapterId) || ALL_BOOK_1_CHAPTERS[0];
  const chapterIndex = ALL_BOOK_1_CHAPTERS.findIndex(c => c.id === chapter.id);
  const character = ALL_MAIN_CHARACTERS.find(c => c.id === characterId) || ALL_MAIN_CHARACTERS[0];
  useEffect(() => { try { localStorage.setItem(THEME, JSON.stringify(saved)); } catch { /* Private browsing may disable storage. */ } }, [saved]);
  useEffect(() => () => { generation.current++; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  const filtered = useMemo(() => ALL_BOOK_1_CHAPTERS.filter(c => (!onlySaved || saved.bookmarks.includes(c.id)) && (!query.trim() || [c.heading, c.title, c.summary, c.partTitle, ...c.scenes.map(s => s.text || '')].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))), [query, onlySaved, saved.bookmarks]);
  function stopVoice() { generation.current++; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setVoice('idle'); }
  function go(p: Page) { stopVoice(); setPage(p); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function open(c: Chapter) { stopVoice(); setSaved(prev => ({ ...prev, chapterId: c.id })); setPage('reader'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function bookmark() { setSaved(prev => ({ ...prev, bookmarks: prev.bookmarks.includes(chapter.id) ? prev.bookmarks.filter(id => id !== chapter.id) : [...prev.bookmarks, chapter.id] })); }
  function speak() {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { window.alert('อุปกรณ์นี้ไม่รองรับการอ่านข้อความด้วยเสียง'); return; }
    if (voice === 'playing') { window.speechSynthesis.pause(); setVoice('paused'); return; }
    if (voice === 'paused') { window.speechSynthesis.resume(); setVoice('playing'); return; }
    const token = ++generation.current;
    window.speechSynthesis.cancel();
    const chunks = [chapter.title, ...chapter.scenes.filter(s => s.text && s.type !== 'lore-note').map(s => s.text || '')].flatMap(line => line.match(/.{1,160}/gu) || []);
    let i = 0;
    const next = () => {
      if (token !== generation.current) return;
      if (i >= chunks.length) { setVoice('idle'); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[i++]);
      utterance.lang = 'th-TH'; utterance.rate = .9; utterance.onend = next;
      utterance.onerror = () => { if (token === generation.current) setVoice('idle'); };
      window.speechSynthesis.speak(utterance);
    };
    setVoice('playing'); next();
  }
  function heading(overline: string, name: string, desc: string) {
    return <div className="mb-8"><div className={kicker}>{overline}</div><h1 className={title + ' mt-2'}>{name}</h1><p className={muted + ' mt-2 text-sm leading-7'}>{desc}</p></div>;
  }
  const content = (() => {
    switch(page) {
      case 'home': return <>
        <section className="relative isolate overflow-hidden rounded-2xl border border-[#2c4968] min-h-[450px] flex items-center" style={{ backgroundImage: "linear-gradient(90deg,#060d20 0%,#060d20e8 45%,#06102752 100%),url('" + picture(BOOK_IMAGES.cover) + "')", backgroundSize:'cover', backgroundPosition:'center' }}>
          <div className="px-7 py-12 md:p-14 max-w-[720px]"><p className={kicker}>ARACAI · THE STORY UNIVERSE</p><h1 className="font-['Prompt'] text-[31px] sm:text-5xl font-semibold leading-tight mt-5">มหากาพย์<br/><span className="text-[#f1ce89]">อารยาและอาราเซีย</span></h1><p className="mt-5 leading-8 text-[#c8d7eb] max-w-[520px]">ก่อนที่โลกจะรู้จักชื่อของพวกเขา ทุกอย่างเริ่มจากครอบครัวเล็ก ๆ ความรัก การสูญเสีย และคำสัญญาที่จะเปลี่ยนโลกไปตลอดกาล</p><div className="flex flex-wrap gap-3 mt-7"><button className={action} onClick={() => open(ALL_BOOK_1_CHAPTERS[0])}><BookOpen size={18}/> เริ่มอ่านเล่ม 1 <ArrowRight size={17}/></button><button className={outline} onClick={() => open(chapter)}><Clock3 size={17}/> อ่านต่อ</button></div><p className="mt-8 text-xs text-[#8ea7c6]">ประพันธ์โดย กิตติอุซ KZ</p></div>
        </section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-6">{[[ALL_BOOK_1_CHAPTERS.length,'บทในเล่มแรก'],[BOOK_METADATA.parts.length,'ภาคของเรื่อง'],[ALL_MAIN_CHARACTERS.length,'ตัวละคร'],[CODEX_ENTRIES.length,'รายการสารานุกรม']].map(([n,label])=><div key={label} className={panel + ' p-5'}><div className="text-3xl font-semibold text-[#f0c77d]">{n}</div><div className="text-xs mt-2 text-[#a7b9d0]">{label}</div></div>)}</div>
        <div className="flex items-center justify-between mt-12 mb-5"><h2 className="font-['Prompt'] text-2xl font-semibold">สำรวจจักรวาลอาราเซีย</h2><span className={kicker}>EXPLORE</span></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {p:'books' as Page,name:'คลังนิยาย',caption:'เล่ม 1 ทั้ง 24 บท เปิดอ่านได้ทันที',img:BOOK_IMAGES.worldTree},
            {p:'volume2' as Page,name:'เล่ม 2 — โลกหลังแสง',caption:'133 บท · จากการสร้างอาณาจักรสู่การเดินทางครั้งใหม่',img:BOOK_IMAGES.palace},
            {p:'characters' as Page,name:'ตัวละคร',caption:'ครอบครัว ผู้บุกเบิก และอสูร',img:ALL_MAIN_CHARACTERS[0].imageUrl},
            {p:'world' as Page,name:'สารานุกรมโลก',caption:'เผ่าพันธุ์ พลัง และดินแดน',img:BOOK_IMAGES.palace}
          ].map(card => <button key={card.p} onClick={()=>go(card.p)} className="relative text-left h-64 overflow-hidden rounded-xl border border-[#38516b] group"><img src={picture(card.img)} alt={card.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"/><div className="absolute inset-0 bg-gradient-to-t from-[#030917] via-[#07152c77] to-transparent"/><div className="absolute bottom-0 p-5"><span className={kicker}>DISCOVER</span><h3 className="font-['Prompt'] text-xl mt-2">{card.name}</h3><p className="text-xs text-[#c9d5e5] mt-2">{card.caption}</p><span className="inline-flex gap-2 items-center text-[#f2cd84] mt-3 text-xs">สำรวจ <ArrowRight size={15}/></span></div></button>)}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-7"><button className={panel + ' p-6 text-left hover:border-[#c49d5a] transition'} onClick={()=>go('media')}><Headphones className="text-[#f1c77e]" size={28}/><h3 className="text-lg font-semibold mt-3">นิยายเสียงและอนิเมชั่น</h3><p className={muted + ' text-sm mt-2'}>พื้นที่รวมผลงานดัดแปลง และระบบอ่านออกเสียงจากอุปกรณ์</p></button><button className={panel + ' p-6 text-left hover:border-[#c49d5a] transition'} onClick={()=>go('history')}><ScrollText className="text-[#f1c77e]" size={28}/><h3 className="text-lg font-semibold mt-3">เส้นเวลามหากาพย์</h3><p className={muted + ' text-sm mt-2'}>สำรวจเหตุการณ์สำคัญตั้งแต่จุดกำเนิดจนถึงโลกใหม่</p></button></div>
        <div className={panel + ' p-7 mt-8'}><span className={kicker}>VOLUME II · 133 CHAPTERS AVAILABLE</span><h2 className="text-xl font-semibold mt-2">โลกหลังแสง</h2><p className={muted + ' text-sm mt-3 leading-7'}>เล่ม 2 ยังดำเนินต่อ และเปิดให้อ่านบทที่ 0–132 จำนวน 133 บท จากไฟล์ต้นฉบับที่นำเข้ามาแล้ว</p><button onClick={()=>go('volume2')} className={action+' mt-4 text-sm'}>อ่านเล่ม 2 <ArrowRight size={15}/></button></div>
      </>;
      case 'books': return <>
        {heading('LIBRARY', 'ห้องสมุดอาราเซีย', 'เลือกอ่านได้ทุกบทโดยไม่ต้องทำภารกิจ ตอบคำถาม หรือปลดล็อก')}
        <div className={panel + ' flex items-center gap-5 p-4 md:p-6'}><img src={picture(BOOK_IMAGES.cover)} alt="ปกเล่ม 1" className="w-24 h-32 md:w-32 md:h-40 rounded-lg object-cover"/><div><span className={kicker}>VOLUME I · 24 CHAPTERS</span><h2 className="font-['Prompt'] text-lg md:text-2xl mt-2">ก่อนที่โลกจะรู้จักชื่อของพวกเขา</h2><p className={muted + ' text-xs mt-2'}>เล่ม 1 ฉบับสมบูรณ์ในต้นฉบับ · ข้อมูลอ่านในแอปเป็นฉบับเรียบเรียงย่อ</p><button className={action + ' text-xs !py-2.5 mt-4'} onClick={()=>open(chapter)}>อ่านจากบทล่าสุด <ArrowRight size={15}/></button></div></div>
        <div className="border-l-[3px] border-[#dbb875] bg-[#152640] p-4 text-[#b7c9df] text-xs leading-6 mt-4">ข้อมูลบทในรีโพซิทอรีปัจจุบันเป็นฉบับเรียบเรียงสำหรับแอป ยังไม่ใช่ข้อความต้นฉบับ DOCX แบบครบทุกย่อหน้า</div>
        <div className="flex flex-col sm:flex-row gap-3 mt-7"><label className="flex-1 flex items-center gap-3 rounded-xl border border-[#2b4765] bg-[#0b192f] px-4"><Search size={18} className="text-[#a7bfd9]"/><input aria-label="ค้นหาบทนิยาย" className="w-full bg-transparent outline-none text-sm py-3" placeholder="ค้นหาชื่อบท เหตุการณ์ หรือข้อความ" value={query} onChange={e=>setQuery(e.target.value)}/></label><button className={(onlySaved?'border-[#d6ad6b] text-[#f3d08a] bg-[#483b2a]':'border-[#324f6c] text-[#b2c7de] bg-[#0c1b32]') + ' border px-4 py-3 rounded-xl flex items-center gap-2 text-xs'} onClick={()=>setOnlySaved(x=>!x)}><Bookmark size={16}/> เฉพาะบทที่บันทึก</button></div>
        <p className="text-xs text-[#809bb9] mt-4">พบ {filtered.length} บท</p>
        {BOOK_METADATA.parts.map(part=>{const chapters=filtered.filter(c=>c.partNumber===part.number);return chapters.length?<section className="mt-9" key={part.number}><div className="flex items-center gap-4 mb-4 border-b border-[#263f5b] pb-3"><span className="text-2xl text-[#e7bd70]">{String(part.number).padStart(2,'0')}</span><div><h3 className="font-['Prompt'] text-lg">{part.title}</h3><p className="text-xs text-[#8ca7c5]">{part.chaptersRange}</p></div></div><div className="grid lg:grid-cols-2 gap-3">{chapters.map(c=><button key={c.id} className={panel + ' text-left flex min-h-36 overflow-hidden hover:border-[#c5a15d] transition'} onClick={()=>open(c)}><div className="relative w-27 sm:w-35 shrink-0"><img src={picture(c.featuredImage)} alt="ภาพประกอบบท" className="h-full w-full object-cover"/><span className="absolute left-2 top-2 rounded bg-[#051226de] px-2 py-1 text-[10px] text-[#f0c47e]">บท {c.number}</span></div><div className="p-4 flex flex-col flex-1"><strong className="text-[15px]">{c.title}</strong><p className="text-[#a2b5ce] leading-6 mt-2 text-xs line-clamp-3">{c.summary}</p><div className="mt-auto pt-2 flex justify-between text-[#e9bf77] text-xs"><span className="inline-flex gap-1 items-center"><Clock3 size={12}/> ~{Math.max(1,Math.ceil(c.wordCount/220))} นาที</span>{saved.bookmarks.includes(c.id)?<Bookmark size={16} fill="currentColor"/>:<ArrowRight size={16}/>}</div></div></button>)}</div></section>:null})}
        {filtered.length===0&&<div className={panel+' text-center p-10 text-[#b1c5d9] mt-6'}>ไม่พบบทตามเงื่อนไข ลองเปลี่ยนคำค้นหรือปิดตัวกรอง</div>}
        <div className={panel+' p-6 mt-8'}><span className={kicker}>VOLUME II · 133 CHAPTERS</span><h3 className="text-xl mt-2">โลกหลังแสง</h3><p className={muted+' text-sm mt-3'}>เปิดอ่านบทที่ 0 ถึง 132 ได้แล้ว เล่มนี้ยังเขียนต่อและยังไม่ใช่เล่มจบ</p><button onClick={()=>go('volume2')} className={outline+' mt-4 text-sm'}>เปิดห้องสมุดเล่ม 2 <ArrowRight size={15}/></button></div>
      </>;
      case 'reader': return <div className="max-w-[880px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><button onClick={()=>go('books')} className="flex items-center gap-2 text-sm text-[#aac0dc]"><ArrowLeft size={16}/> กลับสารบัญ</button><div className="flex items-center gap-2"><button aria-label="ลดขนาดอักษร" className="reader-tool" onClick={()=>setSaved(p=>({...p,fontSize:Math.max(15,p.fontSize-1)}))}>ก−</button><span className="text-xs text-[#8aa2c2]">{saved.fontSize}px</span><button aria-label="เพิ่มขนาดอักษร" className="reader-tool" onClick={()=>setSaved(p=>({...p,fontSize:Math.min(26,p.fontSize+1)}))}>ก+</button><button aria-label="คั่นหน้าบทนี้" className="reader-tool text-[#e9be72]" onClick={bookmark}><Bookmark size={18} fill={saved.bookmarks.includes(chapter.id)?'currentColor':'none'}/></button></div></div>
        <div className="rounded-xl min-h-[250px] md:min-h-[320px] border border-[#2e4968] flex flex-col items-center justify-end text-center p-7 bg-cover bg-center" style={{backgroundImage:"linear-gradient(0deg,#08152b,transparent),url('"+picture(chapter.featuredImage)+"')"}}><span className={kicker}>VOLUME I · {chapter.heading}</span><h1 className="font-['Prompt'] text-2xl md:text-4xl mt-3">{chapter.title}</h1><p className="text-[#d4dfed] text-xs mt-2">{chapter.partTitle}</p></div>
        <div className="max-w-[740px] mx-auto"><p className="mt-7 text-[#bdd0e7] leading-8 border-b border-[#2a4160] pb-6">{chapter.summary}</p><div className={panel+' flex flex-wrap justify-between items-center gap-3 p-4 my-6'}><div className="flex items-center gap-2 text-[#c5d3e8] text-xs"><Headphones size={20} className="text-[#e9c281]"/><span>อ่านข้อความด้วยเสียงของอุปกรณ์ (ไม่ใช่เสียงพากย์สตูดิโอ)</span></div><div className="flex gap-2"><button className={action+' !py-2 !px-3 text-xs'} onClick={speak}>{voice==='playing'?<Pause size={16}/>:<Play size={16}/>} {voice==='playing'?'พักเสียง':voice==='paused'?'ฟังต่อ':'ฟังบทนี้'}</button>{voice!=='idle'&&<button className="reader-tool" title="หยุดเสียง" onClick={stopVoice}><VolumeX size={18}/></button>}</div></div>
          <article className="story-text" style={{fontSize:saved.fontSize+'px'}}>{chapter.scenes.map((block,i)=>block.type==='illustration'?block.imageUrl?<figure key={i} className="my-7"><img src={picture(block.imageUrl)} alt={block.caption||'ภาพประกอบ'} className="w-full max-h-[470px] object-cover rounded-xl"/><figcaption className="text-center text-xs text-[#90a9c4] mt-2">{block.caption}</figcaption></figure>:null:block.type==='dialogue'?<blockquote key={i} className="bg-[#10223d] border-l-[3px] border-[#d6b470] rounded-r-lg p-5 my-6"><span className="text-xs text-[#eac37c] font-bold">{block.speaker}</span><p className="m-0 mt-2">{block.text}</p></blockquote>:block.type==='dramatic-quote'?<blockquote key={i} className="text-[#edcc90] text-center border-y border-[#6b593b] p-6 my-7 italic">{block.text}</blockquote>:block.type==='lore-note'?<aside key={i} className="bg-[#16233a] text-[#a7bdd4] text-sm p-4 rounded-lg my-4">{block.text}</aside>:<p key={i} className="mb-6 indent-8">{block.text}</p>)}</article>
          <div className="flex justify-between items-center border-t border-[#273d56] mt-10 pt-6 gap-3"><button disabled={chapterIndex<=0} className={outline+' !p-3 text-sm'} onClick={()=>open(ALL_BOOK_1_CHAPTERS[chapterIndex-1])}><ArrowLeft size={16}/> บทก่อนหน้า</button><span className="text-[#9cb3ce] text-xs">{chapterIndex+1}/{ALL_BOOK_1_CHAPTERS.length}</span><button disabled={chapterIndex>=ALL_BOOK_1_CHAPTERS.length-1} className={action+' !p-3 text-sm'} onClick={()=>open(ALL_BOOK_1_CHAPTERS[chapterIndex+1])}>บทถัดไป <ArrowRight size={16}/></button></div></div>
      </div>;
      case 'volume2': return <VolumeTwoView/>;
      case 'characters': return <>{heading('THE PEOPLE','ตัวละครในจักรวาล','เรียนรู้เรื่องราว บุคลิก และความสามารถของตัวละครสำคัญ')}
        <div className="grid xl:grid-cols-[1.3fr_.8fr] gap-5 items-start"><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{ALL_MAIN_CHARACTERS.map(c=><button key={c.id} onClick={()=>setCharacterId(c.id)} className={'overflow-hidden rounded-xl border text-center pb-4 bg-[#0d1a30] '+(characterId===c.id?'border-[#dcb66f]':'border-[#2a4160] hover:border-[#a58b60]')}><img src={picture(c.imageUrl)} alt={c.name} className="w-full h-36 sm:h-48 object-cover"/><div className="mt-3 text-[#e8bf79] text-xs">{c.badge}</div><strong className="block text-sm mt-1">{c.name}</strong></button>)}</div><div className={panel+' p-5 xl:sticky xl:top-24'}><img src={picture(character.imageUrl)} alt={character.name} className="w-full h-64 object-cover rounded-xl"/><div className={kicker+' mt-5'}>CHARACTER PROFILE</div><h2 className="font-['Prompt'] text-2xl mt-2">{character.name}</h2><p className="text-[#e8c17d] text-sm mt-2">{character.title}</p><p className={muted+' text-xs mt-2'}>{character.age}</p><h3 className="font-bold text-[#e9c37f] text-sm border-b border-[#2d4864] pb-2 mt-5">ความสามารถและจุดเด่น</h3><p className={muted+' text-sm leading-7 mt-3'}>{character.elementOrPower}</p><h3 className="font-bold text-[#e9c37f] text-sm border-b border-[#2d4864] pb-2 mt-5">ประวัติ</h3><p className={muted+' text-sm leading-7 mt-3'}>{character.description}</p></div></div>
      </>;
      case 'world': return <>{heading('WORLD CODEX','สารานุกรมอาราเซีย','เผ่าพันธุ์ พลัง สิ่งมีชีวิต เหตุการณ์ และสถานที่ที่ปรากฏในเรื่อง')}
        <div className="rounded-xl border border-[#32506a] p-8 md:p-11 bg-cover bg-center" style={{backgroundImage:"linear-gradient(90deg,#07142cee,#0b183077),url('"+picture(BOOK_IMAGES.worldTree)+"')"}}><div className={kicker}>WORLD BUILDING</div><h2 className="font-['Prompt'] text-2xl mt-3">โลกหลังแสง</h2><p className="text-sm leading-7 text-[#cedaeb] max-w-xl mt-2">จากราเมือกชีวภาพและต้นไม้ยักษ์ สู่ผู้คนต่างเผ่าพันธุ์ที่กำลังเรียนรู้การอยู่ร่วมกัน</p></div>
        <div className="flex flex-wrap gap-2 my-6">{['ทั้งหมด',...Array.from(new Set(CODEX_ENTRIES.map(x=>x.category)))].map(c=><button key={c} className={'px-4 py-2 rounded-lg border text-xs '+(category===c?'border-[#cb9c53] bg-[#4a3925] text-[#f3d398]':'border-[#314b69] bg-[#102039] text-[#adc1db]')} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="grid md:grid-cols-2 gap-4">{CODEX_ENTRIES.filter(c=>category==='ทั้งหมด'||c.category===category).map(c=><section key={c.id} className={panel+' p-6'}><div className={kicker}>{c.category} · {c.badge}</div><h3 className="font-['Prompt'] text-xl mt-3">{c.title}</h3><p className="text-[#d4c7a8] text-sm mt-2">{c.subtitle}</p><p className={muted+' text-sm leading-7 mt-4'}>{c.description}</p></section>)}</div>
      </>;
      case 'history': return <>{heading('CHRONICLES','เส้นเวลาแห่งอาราเซีย','เหตุการณ์สำคัญของเล่ม 1 เรียงตาม 6 ภาค มีการเปิดเผยเนื้อเรื่อง')}
        <div className="space-y-4">{history.map(([name,number,description,img],i)=><div className={panel+' flex flex-col sm:flex-row gap-5 p-5'} key={name}><img src={picture(img)} alt={name} className="w-full sm:w-44 h-36 object-cover rounded-lg"/><div className="flex-1"><div className={kicker}>PHASE {i+1} · {number}</div><h2 className="font-['Prompt'] text-xl mt-2">{name}</h2><p className={muted+' leading-7 text-sm mt-2'}>{description}</p><button className="inline-flex gap-2 items-center text-[#ebc47f] mt-3 text-xs" onClick={()=>open(ALL_BOOK_1_CHAPTERS.find(c=>c.partNumber===i+1)||ALL_BOOK_1_CHAPTERS[0])}>อ่านภาคนี้ <ArrowRight size={15}/></button></div></div>)}</div>
      </>;
      case 'media': return <>{heading('ARACAI STUDIO','คลังเสียงและอนิเมชั่น','รวมผลงานดัดแปลงจากเนื้อเรื่อง โดยไม่แสดงสื่อที่ยังไม่ได้ผลิตว่าเล่นได้แล้ว')}
        <div className="flex gap-3 mb-6"><button className={(mediaMode==='audio'?'border-[#d4a762] bg-[#493b2b] text-[#f5d18b]':'border-[#36506f] bg-[#0e1e35] text-[#a9bfd9]')+' border flex gap-2 items-center px-5 py-3 rounded-xl text-sm'} onClick={()=>setMediaMode('audio')}><Headphones size={18}/> นิยายเสียง</button><button className={(mediaMode==='video'?'border-[#d4a762] bg-[#493b2b] text-[#f5d18b]':'border-[#36506f] bg-[#0e1e35] text-[#a9bfd9]')+' border flex gap-2 items-center px-5 py-3 rounded-xl text-sm'} onClick={()=>setMediaMode('video')}><Film size={18}/> อนิเมชั่น</button></div>
        {MEDIA_EPISODES.map(item=>{const source=mediaMode==='audio'?item.audioUrl:item.videoUrl;return <div key={item.id} className={panel+' flex flex-col md:flex-row gap-6 p-5'}><img src={picture(BOOK_IMAGES.cover)} alt="ปกนิยาย" className="w-full md:w-60 h-55 md:h-70 object-cover rounded-xl"/><div className="flex-1"><div className={kicker}>EPISODE {item.episode} · {mediaMode==='audio'?'AUDIO NOVEL':'ANIMATION'}</div><h2 className="font-['Prompt'] text-2xl mt-3">{item.title}</h2><p className="text-[#e3c48a] mt-2 text-xs">{item.chapters}</p><p className={muted+' text-sm leading-7 mt-4'}>{item.description}</p>{source?mediaMode==='audio'?<audio controls className="w-full mt-5" src={source}/>:<video controls className="w-full mt-5 rounded-lg" src={source} poster={picture(BOOK_IMAGES.cover)}/>:<div className="inline-flex items-center gap-2 border border-dashed border-[#5a6880] rounded-lg p-4 text-[#d9c59e] text-xs mt-5"><Clock3 size={17}/> ยังไม่มีไฟล์{mediaMode==='audio'?'เสียงพากย์':'อนิเมชั่น'}ที่เผยแพร่ในแอป</div>}</div></div>})}
        <div className={panel+' p-7 mt-7'}><span className={kicker}>AVAILABLE NOW</span><h3 className="text-xl font-semibold mt-3">ฟังข้อความของบทผ่านอุปกรณ์</h3><p className={muted+' text-sm leading-7 mt-2'}>เปิดบทอ่านแล้วใช้ปุ่ม “ฟังบทนี้” เพื่อให้อุปกรณ์อ่านออกเสียงภาษาไทยได้ ความพร้อมและคุณภาพเสียงขึ้นอยู่กับเบราว์เซอร์</p><button onClick={()=>open(chapter)} className={action+' mt-4 text-sm'}>เปิดบทล่าสุด <ArrowRight size={15}/></button></div>
      </>;
      case 'about': return <>{heading('ABOUT THE UNIVERSE','เกี่ยวกับเรื่อง','ต้นกำเนิดและเจตนาของมหากาพย์อารยาและอาราเซีย')}
        <div className={panel+' flex flex-col md:flex-row items-center gap-7 p-6'}><img src={picture(BOOK_IMAGES.cover)} alt="ปกมหากาพย์" className="w-45 h-60 object-cover rounded-lg"/><div><span className={kicker}>THE AUTHOR</span><h2 className="font-['Prompt'] text-2xl mt-2">ก่อนที่โลกจะรู้จักชื่อของพวกเขา</h2><p className={muted+' text-sm mt-3'}>ประพันธ์โดย {AUTHOR_FOREWORD.author}</p><blockquote className="text-[#e9c786] italic leading-8 mt-6">{AUTHOR_FOREWORD.dedication}</blockquote></div></div>
        <div className={panel+' p-7 mt-6 space-y-5'}>{AUTHOR_FOREWORD.introduction.map((p,i)=><p className="text-[#c8d5e8] leading-9 indent-8 whitespace-pre-line" key={i}>{p}</p>)}</div>
        <div className={panel+' p-7 mt-6'}><h3 className="text-xl text-[#edc781]">เกี่ยวกับแอป Aracai</h3><p className={muted+' mt-3 leading-7 text-sm'}>แอปศูนย์รวมเรื่องราว ตัวละคร เผ่าพันธุ์ ประวัติศาสตร์ นิยายเสียง และอนิเมชั่น ไม่มีภารกิจ คะแนน หรือระบบปลดล็อก เนื้อหาเล่ม 1 ที่มีอยู่ในรีโพซิทอรีเป็นฉบับเรียบเรียงสำหรับแอป ไม่ใช่ต้นฉบับเต็ม และเล่ม 2 เปิดอ่านบทที่ 0–132 จากไฟล์ต้นฉบับที่นำเข้าแล้ว (กำลังเขียนต่อ)</p><p className={muted+' mt-3 leading-7 text-sm'}>คั่นหน้า บทล่าสุด และขนาดตัวอักษรบันทึกเฉพาะบนอุปกรณ์นี้</p></div>
      </>;
      default: return null;
    }
  })();
  return <div className="min-h-screen flex bg-[#060c1c] text-[#ebf1fb] font-['Sarabun']">
    {menuOpen&&<button className="fixed inset-0 z-30 bg-black/70 lg:hidden" aria-label="ปิดเมนู" onClick={()=>setMenuOpen(false)}/>}
    <aside className={'fixed lg:sticky top-0 h-screen w-63 shrink-0 bg-[#081126] border-r border-[#1d304d] px-4 py-7 z-40 flex flex-col transition-transform duration-200 '+(menuOpen?'translate-x-0':'-translate-x-full lg:translate-x-0')}>
      <div className="flex items-center gap-3 px-3 mb-10"><div className="w-11 h-11 rounded-xl grid place-items-center bg-[#172e48] border border-[#b2945a] text-[#f0cd8a] text-3xl font-serif">A</div><div><strong className="block text-[#f0ca83] tracking-[.18em]">ARACAI</strong><span className="text-[#7f9cb9] text-[10px] tracking-widest">STORY UNIVERSE</span></div><button className="ml-auto lg:hidden" aria-label="ปิดเมนู" onClick={()=>setMenuOpen(false)}><X size={20}/></button></div>
      <p className={kicker+' ml-4 mb-3 !text-[#718ba8]'}>DISCOVER</p><nav className="space-y-1">{menu.map(m=><button key={m.id} className={'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-left '+(page===m.id || page==='reader'&&m.id==='books'?'bg-[#182c44] text-[#ecc682] border border-[#836b4755]':'text-[#94abc9] hover:bg-[#12213a]')} onClick={()=>go(m.id)}><m.Icon size={18}/>{m.label}{(page===m.id||page==='reader'&&m.id==='books')&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e2b766]"/>}</button>)}</nav>
      <div className="mt-auto border-t border-[#20344e] pt-5 px-3 text-xs text-[#7e97b4] leading-6">มหากาพย์อารยาและอาราเซีย<br/>© กิตติอุซ KZ</div>
    </aside>
    <div className="flex-1 min-w-0 flex flex-col">
      <header className="sticky top-0 z-20 h-17 border-b border-[#1d304a] bg-[#071125ed] backdrop-blur-lg flex items-center justify-between px-5 md:px-9"><div className="flex items-center gap-4"><button className="lg:hidden" aria-label="เปิดเมนู" onClick={()=>setMenuOpen(true)}><Menu size={23}/></button><span className="text-[#6f8da8] text-xs">ARACAI <ChevronRight className="inline mx-1" size={13}/></span><strong className="text-xs text-[#e6eefa] max-w-44 truncate">{page==='reader'?chapter.title:menu.find(m=>m.id===page)?.label}</strong></div><div className="flex gap-4 items-center"><button aria-label="ค้นหานิยาย" onClick={()=>{setQuery('');setOnlySaved(false);go('books');}}><Search size={19} className="text-[#a6bcd6]"/></button><button aria-label="บทที่บันทึก" onClick={()=>{setOnlySaved(true);go('books');}}><Bookmark size={19} className="text-[#a6bcd6]"/></button><span className="hidden sm:grid place-items-center w-9 h-9 rounded-full border border-[#947343] text-[#eac484] text-xs">KZ</span></div></header>
      <main className="flex-1 w-full max-w-[1370px] mx-auto px-4 sm:px-7 lg:px-10 py-7 md:py-10 pb-27">{content}</main>
      <footer className="border-t border-[#20324e] px-7 py-5 text-xs text-[#708cab] mb-17 lg:mb-0 flex justify-between"><span>ARACAI UNIVERSE © กิตติอุซ KZ</span><span className="hidden sm:block">เรื่องราวทั้งหมดในที่เดียว</span></footer>
    </div>
    <nav aria-label="เมนูมือถือ" className="fixed bottom-0 inset-x-0 lg:hidden z-20 flex justify-around items-center border-t border-[#263e5a] bg-[#08142bf5] backdrop-blur-xl h-18 pb-[env(safe-area-inset-bottom)]">{[menu[0],menu[1],menu[2],menu[3],menu[6]].map(m=><button className={'flex flex-col items-center gap-1 text-[10px] '+(page===m.id||page==='reader'&&m.id==='books'?'text-[#f0c47c]':'text-[#8ca6c3]')} onClick={()=>go(m.id)} key={m.id}><m.Icon size={19}/><span>{m.label}</span></button>)}</nav>
  </div>;
}
