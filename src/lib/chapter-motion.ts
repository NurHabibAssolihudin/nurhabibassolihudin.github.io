import {animate} from 'motion/mini';
import {motionEase, motionTiming} from './motion-settings';

type Frame = {clipPath?: string; opacity?: string; transform?: string};
interface Part {
  node: HTMLElement;
  anchor: HTMLElement;
  original: Frame;
  to: Frame;
  duration: number;
  control?: ReturnType<typeof animate>;
  finished: boolean;
}
interface Entry {id: string; panel: HTMLElement; parts: Part[]; started: boolean; nextBeat: number}

function entryFrames(kind: string | undefined, direction: number): [Frame, Frame, number] {
  const {text, detail, surface} = motionTiming.chapter;
  const rest = {opacity: '1', transform: 'translate3d(0,0,0)'};
  switch (kind) {
    case 'line':
      return [{transform: 'translate3d(0,120%,0)'}, {transform: rest.transform}, text];
    case 'slide':
      return [{opacity: '.35', transform: 'translate3d(24px,0,0)'}, rest, detail];
    case 'orbit':
      return [{opacity: '.2', transform: 'scale(.87)'}, {opacity: '1', transform: 'scale(1)'}, surface];
    case 'spread':
      return [{clipPath: 'inset(0 44% 0 44%)'}, {clipPath: 'inset(0 0% 0 0%)'}, surface];
    default:
      return [{opacity: '.45', transform: `translate3d(0,${direction * 14}px,0)`}, rest, detail];
  }
}

/** One first-visit composition, started during travel rather than after arrival. */
export function initChapterMotion() {
  const shell = document.querySelector<HTMLElement>('.pro-experience');
  const scroller = document.querySelector<HTMLElement>('#professional-scroll');
  if (!shell || !scroller) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const entries = new Map<string, Entry>();
  const waiting = new Map<Element, {entry: Entry; part: Part}>();
  const ids = new Set([...scroller.querySelectorAll<HTMLElement>('[data-chapter]')].map(panel => panel.id));
  const seen = new Set<string>();
  function remember(id: string | undefined) {
    if (!id || !ids.has(id) || seen.has(id)) return;
    seen.add(id);
  }
  const allowed = () => !reduced.matches && !document.hidden && document.documentElement.dataset.world === 'builder';
  function release(part: Part) {
    if (part.finished) return;
    part.finished = true;
    partVisibility.unobserve(part.anchor);
    waiting.delete(part.anchor);
    part.control?.cancel();
    Object.assign(part.node.style, part.original);
    delete part.node.dataset.chapterPart;
  }
  function restore(entry: Entry) {
    entry.parts.forEach(release);
    delete entry.panel.dataset.chapterMotion;
    entries.delete(entry.id);
  }
  function clear() {entries.forEach(restore);}
  // Large sections can contain parts below the fold. Start each batch when its
  // own elements enter the scroll viewport, including during the chapter jump.
  const partVisibility = new IntersectionObserver(records => {
    if (!allowed()) return;
    const ease = motionEase('--ease-preview');
    const now = performance.now() / 1000;
    for (const record of records) {
      if (!record.isIntersecting) continue;
      const item = waiting.get(record.target);
      if (!item) continue;
      const {entry, part} = item;
      partVisibility.unobserve(part.anchor);
      waiting.delete(part.anchor);
      const start = Math.max(now, entry.nextBeat);
      entry.nextBeat = start + motionTiming.chapter.entryStagger;
      part.control = animate(part.node, part.to, {
        duration: part.duration,
        delay: start - now,
        ease
      });
      void part.control.finished.catch(() => {}).then(() => {
        if (entries.get(entry.id) !== entry) return;
        release(part);
        if (entry.parts.every(item => item.finished)) restore(entry);
      });
    }
  }, {root: scroller, rootMargin: '20px 0px'});
  function stage(id: string, direction = 1, visible = false) {
    if (seen.has(id) || entries.has(id) || !allowed()) return;
    const panel = document.getElementById(id);
    if (!panel) return;
    const rect = panel.getBoundingClientRect(), viewport = scroller!.getBoundingClientRect();
    if (!visible && rect.bottom > viewport.top + 1 && rect.top < viewport.bottom - 1) return;
    const nodes = [...panel.querySelectorAll<HTMLElement>('[data-chapter-entry]')];
    const parts = nodes.map((node) => {
      const kind = node.dataset.chapterEntry;
      const [from, to, duration] = entryFrames(kind, direction);
      const {clipPath, opacity, transform} = node.style;
      const anchor = kind === 'line' ? node.parentElement! : node;
      return {node, anchor, from, to, duration, original: {clipPath, opacity, transform}, finished: false};
    });
    if (!parts.length) return;
    for (const part of parts) {
      Object.assign(part.node.style, part.from);
      part.node.dataset.chapterPart = '';
    }
    panel.dataset.chapterMotion = 'prepared';
    entries.set(id,{id,panel,parts,started:false,nextBeat:0});
  }
  function play(id: string) {
    const entry = entries.get(id);
    if (!entry || entry.started || !allowed()) return;
    entry.started = true;
    remember(id);
    entry.panel.dataset.chapterMotion = 'running';
    for (const part of entry.parts) {
      waiting.set(part.anchor, {entry, part});
      partVisibility.observe(part.anchor);
    }
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
      for (const entry of entries.values()) if (entry.id !== id || !entry.started) restore(entry);
      remember(id);return;
    }
    for (const entry of entries.values()) if (entry.id !== id) restore(entry);
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
    clearTimeout(watchdog);
    for (const entry of entries.values()) if (!entry.started) restore(entry);
    const panels=[...scroller!.querySelectorAll<HTMLElement>('[data-chapter]')];
    const index=panels.findIndex(panel=>panel.id===shell!.dataset.active);
    if(panels[index-1])stage(panels[index-1].id,-1);
    if(panels[index+1])stage(panels[index+1].id,1);
    watchdog=setTimeout(() => {
      for (const entry of entries.values()) if (!entry.started) restore(entry);
    },10000);
  }
  function interaction(event: Event) {
    if (!(event.target instanceof Element)) return;
    if (event.type === 'pointerdown' && !event.target.closest('a,button,label,input,textarea,[data-chapter-entry="spread"]')) return;
    const panel = event.target.closest<HTMLElement>('[data-chapter-motion]');
    const entry = panel && entries.get(panel.id);
    if (entry) restore(entry);
  }
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
  return ()=>{visibility.disconnect();partVisibility.disconnect();clear();clearTimeout(watchdog);window.removeEventListener('nur:chapter-start',begin);window.removeEventListener('nur:chapter-reveal',reveal);window.removeEventListener('nur:chapter',arrive);interruptions.forEach(name=>window.removeEventListener(name,clear));scroller.removeEventListener('pointerdown',touch);scroller.removeEventListener('scroll',nativeTravel);document.removeEventListener('pointerdown',interaction,true);document.removeEventListener('focusin',interaction,true);document.removeEventListener('visibilitychange',clear);reduced.removeEventListener('change',clear);};
}
