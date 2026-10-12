import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, Clock3, Compass, Film, Headphones, Pause, Play, Search, VolumeX } from 'lucide-react';
import { ALL_BOOK_1_CHAPTERS, BOOK_METADATA } from './data/bookData';
import { ALL_MAIN_CHARACTERS, BOOK_IMAGES } from './data/characters';
import { AUTHOR_FOREWORD, CODEX_ENTRIES } from './data/lore';
import { MEDIA_EPISODES } from './data/mediaCatalog';
import { VolumeTwoView } from './components/VolumeTwoView';
import { EncyclopediaView } from './components/EncyclopediaView';
import type { Chapter } from './types';

type Page = 'home' | 'portal' | 'books' | 'volume2' | 'reader' | 'encyclopedia' | 'characters' | 'world' | 'history' | 'media' | 'about';
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
  function go(p: Page) { stopVoice(); setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function open(c: Chapter) { stopVoice(); setSaved(prev => ({ ...prev, chapterId: c.id })); setPage('reader'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
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
  const volumeTabs = <div className="flex flex-wrap gap-2 items-center mb-7" role="group" aria-label="เลือกเล่มนิยาย">
    <button onClick={()=>go('books')} className={`text-sm rounded-xl px-5 py-3 border ${page==='books'||page==='reader'?'border-[#e2ba79] text-[#f6d597] bg-[#54412b]/50':'border-[#365877] text-[#a9c4df] bg-[#10223b] hover:border-[#91b1ca]'}`}>เล่ม 1 — ก่อนที่โลกจะรู้จักชื่อของพวกเขา</button>
    <button onClick={()=>go('volume2')} className={`text-sm rounded-xl px-5 py-3 border ${page==='volume2'?'border-[#e2ba79] text-[#f6d597] bg-[#54412b]/50':'border-[#365877] text-[#a9c4df] bg-[#10223b] hover:border-[#91b1ca]'}`}>เล่ม 2 — โลกหลังแสง</button>
  </div>;
  const content = (() => {
    switch(page) {
      case 'home': return null;
      case 'portal': return null;
      case 'books': return <>
        {volumeTabs}
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
      case 'volume2': return <>{volumeTabs}<VolumeTwoView/></>;
      case 'encyclopedia': return <EncyclopediaView picture={picture} onOpenBookOne={()=>go('books')} onOpenBookTwo={()=>go('volume2')} onOpenMedia={()=>go('media')}/>;
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
  if (page === 'home') {
    return <main className="relative isolate min-h-screen min-h-[100dvh] bg-[#050b1b] text-[#eaf1fc] flex flex-col justify-center items-center overflow-hidden px-4 py-8 font-['Sarabun']">
      <div className="absolute inset-0 bg-gradient-to-b from-[#132b4b] via-[#070e22] to-[#040816] pointer-events-none"/>
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/10 blur-[120px] rounded-full pointer-events-none"/>
      <div className="relative z-10 flex flex-col items-center w-full">
        <p className="text-[#e8c689] tracking-[.3em] text-[11px] sm:text-sm font-semibold mb-5">ARACAI · THE STORY UNIVERSE</p>
        <button type="button" onClick={()=>go('portal')} aria-label="แตะภาพปกหนังสือเพื่อเข้าสู่จักรวาลอาราเซีย" className="group rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 hover:scale-[1.015] transition-transform duration-300 relative shadow-[0_28px_90px_rgba(0,0,0,.7)]">
          <span className="absolute -inset-1 bg-gradient-to-br from-[#f3d48e] via-[#3ed3fb] to-[#ae854f] rounded-[20px] opacity-65 group-hover:opacity-100 transition-opacity"/>
          <img src={picture(BOOK_IMAGES.cover)} alt="ปกหนังสือมหากาพย์อารยาและอาราเซีย — แตะเพื่อเข้าสู่แอป" className="relative z-10 object-contain rounded-[16px] max-h-[70dvh] max-w-[min(88vw,470px)] w-auto h-auto min-h-65 bg-[#0c1932]"/>
        </button>
        <h1 className="font-['Prompt'] mt-8 text-xl sm:text-2xl font-semibold text-[#f4d399] text-center">มหากาพย์อารยาและอาราเซีย</h1>
        <p className="text-[#9fb9d4] mt-2 text-sm text-center">แตะหน้าปกหนังสือเพื่อเข้าสู่จักรวาล</p>
      </div>
    </main>;
  }
  if (page === 'portal') {
    return <main className="min-h-screen min-h-[100dvh] bg-[#050b1b] text-[#ecf2fc] px-4 sm:px-7 flex items-center justify-center relative overflow-hidden font-['Sarabun']">
      <div className="absolute inset-0 bg-gradient-to-br from-[#122847] via-[#080f25] to-[#040915] pointer-events-none"/>
      <div className="absolute w-96 h-96 right-0 top-0 rounded-full bg-[#00c5fa]/10 blur-[125px] pointer-events-none"/>
      <div className="w-full max-w-4xl relative z-10 py-12">
        <button onClick={()=>go('home')} className="flex items-center gap-2 text-sm text-[#b2cae4] hover:text-[#f2d08e] mb-8"><ArrowLeft size={18}/> กลับหน้าปก</button>
        <div className="text-center mb-11">
          <span className="text-[#ebc884] tracking-[.3em] text-xs">ARACAI UNIVERSE</span>
          <h1 className="font-['Prompt'] text-3xl sm:text-5xl mt-5 font-semibold">ยินดีต้อนรับสู่จักรวาลอาราเซีย</h1>
          <p className="text-[#a3bddb] mt-4 leading-7">เลือกประตูที่ต้องการสำรวจ</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <button onClick={()=>go('books')} className="group text-left rounded-3xl border border-[#80683f] bg-gradient-to-br from-[#3a321f] via-[#1a2941] to-[#09142b] p-8 sm:p-10 min-h-70 hover:border-[#e8c27c] transition flex flex-col justify-between shadow-[0_16px_35px_rgba(0,0,0,.3)]">
            <div className="rounded-2xl w-17 h-17 grid place-items-center bg-[#dab46f]/15 border border-[#e3bd75]/25"><BookOpen className="text-[#f4d08e]" size={34}/></div>
            <div><span className="text-[#dcb977] tracking-widest text-xs">01 · READ THE STORY</span><h2 className="font-['Prompt'] text-2xl sm:text-3xl font-semibold mt-3">จักรวาลอาราเซีย</h2><p className="text-[#b9cee4] leading-7 mt-3">เข้าสู่สารบัญนิยาย เลือกเล่มและเลือกบทที่อยากอ่านได้ทันที</p><span className="text-[#f1cf8b] mt-5 inline-flex items-center gap-2 text-sm">เข้าสู่สารบัญ <ArrowRight className="group-hover:translate-x-1 transition" size={17}/></span></div>
          </button>
          <button onClick={()=>go('encyclopedia')} className="group text-left rounded-3xl border border-[#27697c] bg-gradient-to-br from-[#123747] via-[#1a2941] to-[#09142b] p-8 sm:p-10 min-h-70 hover:border-[#69d9f0] transition flex flex-col justify-between shadow-[0_16px_35px_rgba(0,0,0,.3)]">
            <div className="rounded-2xl w-17 h-17 grid place-items-center bg-[#26c9ef]/15 border border-[#68d1eb]/25"><Compass className="text-[#78e0ef]" size={34}/></div>
            <div><span className="text-[#87d9ea] tracking-widest text-xs">02 · EXPLORE THE WORLD</span><h2 className="font-['Prompt'] text-2xl sm:text-3xl font-semibold mt-3">สารานุกรมอาราเซีย</h2><p className="text-[#b9cee4] leading-7 mt-3">ข้อมูลตัวละคร เผ่าพันธุ์ พลัง สถานที่ วิทยาการ องค์กร และประวัติศาสตร์ แยกหมวดให้เลือกดู</p><span className="text-[#8addf2] mt-5 inline-flex items-center gap-2 text-sm">สำรวจสารานุกรม <ArrowRight className="group-hover:translate-x-1 transition" size={17}/></span></div>
          </button>
        </div>
        <p className="text-center text-[#7892b1] text-xs mt-9">มหากาพย์อารยาและอาราเซีย · โดย กิตติอุซ KZ</p>
      </div>
    </main>;
  }
  const storySection = page==='books'||page==='volume2'||page==='reader';
  const backPage: Page = page==='reader'?'books':(page==='books'||page==='volume2'||page==='encyclopedia')?'portal':'encyclopedia';
  return <div className="min-h-screen bg-[#060c1c] text-[#eaf2fc] font-['Sarabun'] flex flex-col">
    <header className="sticky top-0 z-30 bg-[#071226]/95 backdrop-blur-xl border-b border-[#2c4563]">
      <div className="max-w-[1370px] mx-auto px-4 sm:px-7 h-auto min-h-19 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 justify-between">
        <div className="flex items-center justify-between gap-3">
          <button className="flex items-center gap-2 text-sm text-[#a5bed9] hover:text-[#f0c982]" onClick={()=>go(backPage)}><ArrowLeft size={17}/> ย้อนกลับ</button>
          <button onClick={()=>go('home')} className="font-bold text-[#f0c982] tracking-[.18em] text-base">ARACAI</button>
        </div>
        <nav aria-label="สองส่วนหลักของ ARACAI" className="flex items-center gap-2 w-full sm:w-auto">
          <button className={`flex-1 sm:flex-none rounded-lg px-3 sm:px-5 py-2.5 text-xs sm:text-sm border ${storySection?'border-[#d7b578] bg-[#4b3c28]/45 text-[#f1d297]':'border-[#304f70] text-[#a8c2dc]'}`} onClick={()=>go('books')}>จักรวาลอาราเซีย</button>
          <button className={`flex-1 sm:flex-none rounded-lg px-3 sm:px-5 py-2.5 text-xs sm:text-sm border ${!storySection?'border-[#6ecce4] bg-[#14394d]/40 text-[#adecf5]':'border-[#304f70] text-[#a8c2dc]'}`} onClick={()=>go('encyclopedia')}>สารานุกรมอาราเซีย</button>
        </nav>
      </div>
    </header>
    <main className="w-full max-w-[1370px] mx-auto px-4 sm:px-7 lg:px-10 py-7 md:py-10 flex-1">{content}</main>
    <footer className="border-t border-[#273f5c] text-center text-[#7795b1] text-xs py-6 px-4">ARACAI UNIVERSE · มหากาพย์อารยาและอาราเซีย · © กิตติอุซ KZ</footer>
  </div>;
}
