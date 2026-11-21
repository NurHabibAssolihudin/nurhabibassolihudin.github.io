import {animate} from 'motion/mini';
import {motionEase, motionTiming} from './motion-settings';

type Frame = {clipPath?: string; opacity?: string; transform?: string};
interface Part {node: HTMLElement; original: Frame; from: Frame; to: Frame; delay: number}
interface Entry {id: string; panel: HTMLElement; parts: Part[]; controls: ReturnType<typeof animate>[]; started: boolean}

function entryFrames(kind: string | undefined, direction: number): [Frame, Frame] {
  if (kind === 'line') {
    return [{transform: 'translate3d(0,135%,0)'}, {transform: 'translate3d(0,0,0)'}];
  }
  if (kind === 'facet') {
    return [
      {clipPath: 'polygon(-24% -16%, -18% -16%, -42% 120%, -24% 120%)'},
      {clipPath: 'polygon(-24% -16%, 152% -16%, 128% 120%, -24% 120%)'}
    ];
  }
  return [
    {opacity: '.4', transform: `translate3d(0,${direction * 16}px,0)`},
    {opacity: '1', transform: 'translate3d(0,0,0)'}
  ];
}

/** One first-visit composition, started during travel rather than after arrival. */
export function initChapterMotion() {
  const shell = document.querySelector<HTMLElement>('.pro-experience');
  const scroller = document.querySelector<HTMLElement>('#professional-scroll');
  if (!shell || !scroller) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const entries = new Map<string, Entry>();
  const ids = new Set([...scroller.querySelectorAll<HTMLElement>('[data-chapter]')].map(panel => panel.id));
  const seen = new Set<string>();
  // First visit means this page load, not every future refresh of the same tab.
  // Returning within the page stays immediate; a fresh load gets its welcome.
  try {sessionStorage.removeItem('nur-seen-chapters');} catch {}
  function remember(id: string | undefined) {
    if (!id || !ids.has(id) || seen.has(id)) return;
    seen.add(id);
  }
  const allowed = () => !reduced.matches && !document.hidden && document.documentElement.dataset.world === 'builder';
  function restore(entry: Entry) {
    entry.controls.forEach(control => control.cancel());
    for (const part of entry.parts) {
      Object.assign(part.node.style, part.original);
      delete part.node.dataset.chapterPart;
    }
    delete entry.panel.dataset.chapterMotion;
  }
  function clear() {entries.forEach(restore); entries.clear();}
  function stage(id: string, direction = 1, visible = false) {
    if (seen.has(id) || entries.has(id) || !allowed()) return;
    const panel = document.getElementById(id);
    if (!panel) return;
    const rect = panel.getBoundingClientRect(), viewport = scroller!.getBoundingClientRect();
    if (!visible && rect.bottom > viewport.top + 1 && rect.top < viewport.bottom - 1) return;
    const nodes = [...panel.querySelectorAll<HTMLElement>('[data-chapter-entry]')];
    const parts = nodes.map((node, index) => {
      const [from, to] = entryFrames(node.dataset.chapterEntry, direction);
      const {clipPath, opacity, transform} = node.style;
      return {node, from, to, original: {clipPath, opacity, transform}, delay: Math.min(index, 3) * motionTiming.chapter.entryStagger};
    });
    for (const part of parts) {
      Object.assign(part.node.style, part.from);
      part.node.dataset.chapterPart = '';
    }
    panel.dataset.chapterMotion = 'prepared';
    entries.set(id,{id,panel,parts,controls:[],started:false});
  }
  function play(id: string) {
    const entry = entries.get(id);
    if (!entry || entry.started || !allowed()) return;
    entry.started = true;
    remember(id);
    entry.panel.dataset.chapterMotion = 'running';
    const ease = motionEase('--ease-preview');
    for (const part of entry.parts) entry.controls.push(animate(part.node, part.to, {
      duration: motionTiming.chapter.reveal,
      delay: part.delay,
      ease
    }));
    void Promise.allSettled(entry.controls.map(control=>control.finished)).then(()=>{
      if (entries.get(id) === entry) {restore(entry);entries.delete(id);}
    });
  }
  function begin(event: Event) {
    clear();clearTimeout(watchdog);
    const {id,quiet,direction} = (event as CustomEvent).detail;
    if (!quiet) stage(id,direction,true);
  }
  function reveal(event: Event) {play((event as CustomEvent).detail.id);}
  function arrive(event: Event) {
    clearTimeout(watchdog);
    const id = shell!.dataset.active;
    if (!allowed()) {clear();remember(id);return;}
    if ((event as CustomEvent).detail?.quiet) {
      // Initial hash alignment may settle while a viewport-triggered welcome
      // is already playing. Keyboard/history interruptions clear separately.
      for(const [other,entry] of entries)if(other!==id||!entry.started){restore(entry);entries.delete(other);}
      remember(id);return;
    }
    for (const [other,entry] of entries) if (other !== id) {restore(entry);entries.delete(other);}
    if (id) {stage(id,1,true);play(id);remember(id);}
  }
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  function nativeTravel() {
    if (shell!.dataset.travelling || !allowed()) return;
    const viewport=scroller!.getBoundingClientRect();
    for(const entry of entries.values()) {
      if(entry.started)continue;
      const bounds=entry.panel.getBoundingClientRect();
      if(bounds.top<viewport.top+viewport.height*.7&&bounds.bottom>viewport.top+viewport.height*.3)play(entry.id);
    }
  }
  // Navigation events choreograph travel; visibility also covers direct entry,
  // scrollbar/native scrolling and islands hydrated before their first hover.
  const visibility = new IntersectionObserver(records=>{
    if (!allowed() || shell.dataset.travelling) return;
    const viewport=scroller.getBoundingClientRect();
    for (const record of records) {
      if (!record.isIntersecting) continue;
      const panel=record.target as HTMLElement;
      const bounds=panel.getBoundingClientRect();
      const overlap=Math.min(bounds.bottom,viewport.bottom)-Math.max(bounds.top,viewport.top);
      if(overlap<Math.min(bounds.height,viewport.height)*.3)continue;
      stage(panel.id,1,true);
      play(panel.id);
    }
  },{root:scroller,threshold:[0,.15,.3,.5,1]});
  scroller.querySelectorAll<HTMLElement>('[data-chapter]').forEach(panel=>visibility.observe(panel));
  const initial=shell.dataset.active;
  if(initial){stage(initial,1,true);play(initial);}
  function touch(event: PointerEvent) {
    if (event.pointerType !== 'touch' || (event.target as Element).closest('a,button,input,select,textarea,dialog')) return;
    clear();clearTimeout(watchdog);
    const panels=[...scroller!.querySelectorAll<HTMLElement>('[data-chapter]')];
    const index=panels.findIndex(panel=>panel.id===shell!.dataset.active);
    if(panels[index-1])stage(panels[index-1].id,-1);
    if(panels[index+1])stage(panels[index+1].id,1);
    watchdog=setTimeout(clear,10000);
  }
  function interaction(event: Event) {if((event.target as Element).closest('[data-chapter-motion]'))clear();}
  const interruptions=['nur:transition-start','nur:world','pagehide','popstate','hashchange','resize','keydown'];
  window.addEventListener('nur:chapter-start',begin);
  window.addEventListener('nur:chapter-reveal',reveal);
  window.addEventListener('nur:chapter',arrive);
  interruptions.forEach(name=>window.addEventListener(name,clear));
  scroller.addEventListener('pointerdown',touch,{passive:true});
  scroller.addEventListener('scroll',nativeTravel,{passive:true});
  document.addEventListener('pointerdown',interaction,true);
  document.addEventListener('focusin',interaction,true);
  document.addEventListener('visibilitychange',clear);
  reduced.addEventListener('change',clear);
  return ()=>{visibility.disconnect();clear();clearTimeout(watchdog);window.removeEventListener('nur:chapter-start',begin);window.removeEventListener('nur:chapter-reveal',reveal);window.removeEventListener('nur:chapter',arrive);interruptions.forEach(name=>window.removeEventListener(name,clear));scroller.removeEventListener('pointerdown',touch);scroller.removeEventListener('scroll',nativeTravel);document.removeEventListener('pointerdown',interaction,true);document.removeEventListener('focusin',interaction,true);document.removeEventListener('visibilitychange',clear);reduced.removeEventListener('change',clear);};
}
