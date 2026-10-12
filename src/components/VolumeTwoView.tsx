import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, ChevronLeft, ChevronRight, Headphones, LoaderCircle, Search, VolumeX } from 'lucide-react';
import { VOLUME_TWO_CHAPTERS, VOLUME_TWO_SEGMENTS, volumeTwoSegment } from '../data/volume2Catalog';

interface VolumeTwoChapter {
  id: string;
  number: number;
  title: string;
  paragraphs: string[];
}
interface VolumeTwoFile {
  book: number;
  sourceRange: string;
  chapters: VolumeTwoChapter[];
}
const cache = new Map<string, VolumeTwoChapter[]>();
const KEY_CHAPTER = 'aracai-vol2-last-chapter';
const KEY_BOOKMARKS = 'aracai-vol2-bookmarks';
const KEY_FONT = 'aracai-vol2-font';
function savedNumber(key: string, fallback: number) {
  try { const n = Number(localStorage.getItem(key)); return Number.isInteger(n) && n >= 0 && n <= 132 ? n : fallback; }
  catch { return fallback; }
}
function savedBookmarks(): number[] {
  try { const v = JSON.parse(localStorage.getItem(KEY_BOOKMARKS) || '[]'); return Array.isArray(v) ? v.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= 132) : []; }
  catch { return []; }
}
const panel = 'rounded-2xl border border-[#2b4464] bg-[#0b192f]';
export function VolumeTwoView() {
  const [number, setNumber] = useState(() => savedNumber(KEY_CHAPTER, 0));
  const [reading, setReading] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>(savedBookmarks);
  const [fontSize, setFontSize] = useState(() => {
    try { return Math.min(26, Math.max(15, Number(localStorage.getItem(KEY_FONT)) || 19)); }
    catch { return 19; }
  });
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [loaded, setLoaded] = useState<VolumeTwoChapter[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [talking, setTalking] = useState(false);
  const speechToken = useRef(0);
  const segment = volumeTwoSegment(number);
  const chapter = loaded.find(c => c.number === number);
  const chapters = useMemo(() => VOLUME_TWO_CHAPTERS.filter(c =>
    (!savedOnly || bookmarks.includes(c.number)) &&
    (query.trim() === '' || ('บทที่ ' + c.number + ' ' + c.title).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  ), [query, savedOnly, bookmarks]);
  useEffect(() => { try { localStorage.setItem(KEY_CHAPTER, String(number)); } catch { /* ignore */ } }, [number]);
  useEffect(() => { try { localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(bookmarks)); } catch { /* ignore */ } }, [bookmarks]);
  useEffect(() => { try { localStorage.setItem(KEY_FONT, String(fontSize)); } catch { /* ignore */ } }, [fontSize]);
  useEffect(() => {
    if (!reading || !segment) return;
    const cached = cache.get(segment.range);
    if (cached) { setLoaded(cached); setLoading(false); setError(''); return; }
    const controller = new AbortController();
    setLoading(true); setError(''); setLoaded([]);
    fetch(segment.asset, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('ดาวน์โหลดข้อมูลบทไม่สำเร็จ (' + response.status + ')');
        const data = await response.json() as VolumeTwoFile;
        if (data.book !== 2 || data.sourceRange !== segment.range || !Array.isArray(data.chapters) ||
            data.chapters.length !== segment.end - segment.start + 1 ||
            data.chapters.some((c, i) => c.number !== segment.start + i || !Array.isArray(c.paragraphs))) {
          throw new Error('ไฟล์ข้อมูลบทไม่ตรงกับสารบัญเล่ม 2');
        }
        return data.chapters;
      })
      .then(items => { if (!controller.signal.aborted) { cache.set(segment.range, items); setLoaded(items); setLoading(false); } })
      .catch(err => { if (!controller.signal.aborted) { setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ'); setLoading(false); } });
    return () => controller.abort();
  }, [reading, segment?.range]);
  useEffect(() => () => { speechToken.current++; if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }, [number, reading]);
  function stopVoice() { speechToken.current++; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setTalking(false); }
  function openChapter(n: number) { if (n < 0 || n > 132) return; stopVoice(); setNumber(n); setReading(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function back() { stopVoice(); setReading(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function toggleBookmark() { setBookmarks(b => b.includes(number) ? b.filter(x => x !== number) : [...b, number]); }
  function speak() {
    if (!chapter || !('speechSynthesis' in window)) return;
    if (talking) { stopVoice(); return; }
    stopVoice();
    const token = ++speechToken.current;
    const chunks = [VOLUME_TWO_CHAPTERS[number].title, ...chapter.paragraphs].flatMap(line => line.match(/[\s\S]{1,170}/gu) || []);
    let i = 0;
    const next = () => {
      if (token !== speechToken.current) return;
      if (i >= chunks.length) { setTalking(false); return; }
      const u = new SpeechSynthesisUtterance(chunks[i++]);
      u.lang = 'th-TH'; u.rate = .9; u.onend = next;
      u.onerror = () => { if (token === speechToken.current) setTalking(false); };
      window.speechSynthesis.speak(u);
    };
    setTalking(true); next();
  }
  const header = <div className="mb-8">
    <span className="text-[#e9be7b] text-[11px] tracking-[.18em] font-semibold">VOLUME II · WORLD AFTER LIGHT</span>
    <h1 className="font-['Prompt'] font-semibold text-3xl md:text-4xl mt-2">เล่ม 2 — โลกหลังแสง</h1>
    <p className="text-[#9eb5cf] leading-7 mt-3 text-sm">มหากาพย์อารยาและอาราเซีย · บทที่ 0–132 รวม 133 บท · เนื้อเรื่องยังดำเนินต่อ</p>
  </div>;
  if (!reading) return <section>
    {header}
    <div className={panel + ' p-5 md:p-7 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4'}>
      <div><h2 className="font-['Prompt'] text-xl text-[#f0c983]">เรื่องราวหลังแสงแห่งการผนึก</h2><p className="text-[#a7bdd5] text-sm mt-2 leading-7">จากการก่อสร้างอาราเซียสู่การบริหารอาณาจักร เทคโนโลยี โลกใต้น้ำ ภารกิจสำรวจอวกาศ และการเดินทางสู่ดินแดนต่าง ๆ</p></div>
      <button onClick={() => openChapter(number)} className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-[#f4d28b] to-[#c9a35d] text-[#081427] font-semibold inline-flex items-center gap-2"><BookOpen size={18}/> อ่านต่อบทที่ {number}</button>
    </div>
    <div className="flex flex-wrap gap-2 mb-6">{VOLUME_TWO_SEGMENTS.map(s=><button key={s.range} onClick={()=>{ setSavedOnly(false); setQuery(''); document.getElementById('vol2-group-'+s.range)?.scrollIntoView({behavior:'smooth',block:'start'}); }} className="text-xs px-3 py-2 rounded-lg border border-[#355273] bg-[#101f38] text-[#c2d3e9] hover:text-[#f2cd8b]">บท {s.range}</button>)}</div>
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <label className="flex-1 flex items-center gap-3 rounded-xl border border-[#345271] bg-[#0b192f] px-4"><Search className="text-[#9ebbd6]" size={18}/><input aria-label="ค้นหาชื่อบทเล่ม 2" className="bg-transparent w-full outline-none py-3 text-sm" placeholder="ค้นหาชื่อบทหรือหมายเลขบท..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <button onClick={()=>setSavedOnly(v=>!v)} className={'flex gap-2 items-center px-4 py-3 border rounded-xl text-sm '+(savedOnly?'border-[#c4a162] text-[#e8be7f] bg-[#3a3228]':'border-[#345271] text-[#a6bed5]')}><Bookmark size={16}/> เฉพาะบทที่บันทึก</button>
    </div>
    <p className="text-xs text-[#8da8c5] mb-5">แสดง {chapters.length} จาก 133 บท · แตะชื่อบทเพื่ออ่านได้ทันที ไม่มีภารกิจหรือการปลดล็อก</p>
    {VOLUME_TWO_SEGMENTS.map(s => {
      const items = chapters.filter(c=>c.number>=s.start&&c.number<=s.end);
      if (!items.length) return null;
      return <section className="mb-9 scroll-mt-25" id={'vol2-group-'+s.range} key={s.range}>
        <h2 className="font-['Prompt'] text-xl text-[#e7c183] border-b border-[#294261] pb-3 mb-4">บทที่ {s.range}</h2>
        <div className="grid md:grid-cols-2 gap-3">{items.map(c=><button key={c.number} onClick={()=>openChapter(c.number)} className={panel+' p-4 md:p-5 text-left flex items-center gap-4 hover:border-[#c3a36e] transition'}><span className="text-[#e9bd74] text-lg font-bold w-11">{String(c.number).padStart(3,'0')}</span><div className="flex-1"><h3 className="font-medium leading-7 text-[#e8f0fa]">{c.title}</h3>{bookmarks.includes(c.number)&&<span className="text-xs text-[#d3aa68]">บันทึกไว้</span>}</div><ArrowRight size={16} className="text-[#a1b5cc]"/></button>)}</div>
      </section>;
    })}
    {!chapters.length && <div className={panel+' p-10 text-center text-[#a1b8d1]'}>ไม่พบบทตามเงื่อนไขการค้นหา</div>}
  </section>;
  return <section className="max-w-[880px] mx-auto">
    <button onClick={back} className="text-[#d8c18e] inline-flex items-center gap-2 text-sm mb-5"><ArrowLeft size={16}/> กลับสารบัญเล่ม 2</button>
    <div className="rounded-2xl p-7 md:p-10 border border-[#40506b] bg-gradient-to-br from-[#162843] via-[#0a1730] to-[#071126] text-center">
      <span className="text-[#e9c17b] text-xs tracking-widest">อารยาและอาราเซีย · โลกหลังแสง</span>
      <h1 className="font-['Prompt'] text-2xl md:text-3xl font-semibold mt-3">บทที่ {number}</h1>
      <h2 className="text-xl md:text-2xl mt-3 text-[#f5d79d]">{VOLUME_TWO_CHAPTERS[number].title}</h2>
    </div>
    <div className={panel+' my-5 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3'}>
      <button onClick={toggleBookmark} className="flex items-center gap-2 text-sm text-[#eac788]"><Bookmark size={17} fill={bookmarks.includes(number)?'currentColor':'none'}/>{bookmarks.includes(number)?'บันทึกแล้ว':'บันทึกบท'}</button>
      <div className="flex items-center gap-2"><button aria-label="ลดขนาดตัวอักษร" className="reader-tool" onClick={()=>setFontSize(n=>Math.max(15,n-1))}>ก−</button><span className="text-[#a6b8d1] text-xs">{fontSize}px</span><button aria-label="เพิ่มขนาดตัวอักษร" className="reader-tool" onClick={()=>setFontSize(n=>Math.min(26,n+1))}>ก+</button>
      {chapter && 'speechSynthesis' in window && <button onClick={speak} className="reader-tool flex items-center gap-2 text-[#d6b376]" aria-label={talking?'หยุดอ่านออกเสียง':'อ่านออกเสียงบทนี้'}>{talking?<VolumeX size={18}/>:<Headphones size={18}/>}<span className="hidden sm:inline text-xs">{talking?'หยุดเสียง':'ฟังบทนี้'}</span></button>}</div>
    </div>
    <div className={panel+' px-5 py-9 sm:p-10'}>
      {loading && <div role="status" className="flex items-center justify-center gap-3 py-18 text-[#b3c9df]"><LoaderCircle className="animate-spin" size={24}/> กำลังโหลดเนื้อหาบทที่ {number}</div>}
      {error && <div role="alert" className="text-center py-15"><p className="text-[#f0a9a9]">{error}</p><p className="text-[#8faac6] text-xs mt-3">ตรวจสอบการเชื่อมต่อและเปิดบทอีกครั้ง</p><button onClick={()=>{setReading(false);setTimeout(()=>setReading(true),0);}} className="mt-4 border border-[#6b7d9a] rounded-lg px-4 py-2">ลองใหม่</button></div>}
      {!loading&&!error&&chapter && <article style={{fontSize, lineHeight:2.06}} className="story-text text-[#e2eaf5]">{chapter.paragraphs.map((p,i)=>
        /^(?:—|•••|• • •|⋯)$/.test(p.trim()) ? <div key={i} className="my-7 text-[#d7b679] text-center">✦</div> :
        <p key={i} className={'mb-6 whitespace-pre-line '+(p.length < 65 && !/[.!?।”]$/.test(p) ? 'text-[#f2ce8b] font-semibold mt-7' : '')}>{p}</p>
      )}</article>}
    </div>
    <div className="flex items-center justify-between gap-3 mt-7"><button disabled={number===0} onClick={()=>openChapter(number-1)} className="disabled:opacity-30 text-sm border border-[#355575] rounded-xl px-3 py-3 inline-flex items-center gap-1"><ChevronLeft size={17}/> บทก่อนหน้า</button><span className="text-[#9cb3ca] text-xs">{number+1} / 133</span><button disabled={number===132} onClick={()=>openChapter(number+1)} className="disabled:opacity-30 text-sm border border-[#b58e53] text-[#efcb89] rounded-xl px-3 py-3 inline-flex items-center gap-1">บทถัดไป <ChevronRight size={17}/></button></div>
  </section>;
}
