import {animate} from 'motion/mini';
import {motionEase, motionTiming} from './motion-settings';

interface Part {
  node: HTMLElement;
  property: 'clip-path' | 'opacity';
  original: string;
  priority: string;
  duration: number;
  delay: number;
}
interface Entry {
  id: string;
  panel: HTMLElement;
  parts: Part[];
  controls: ReturnType<typeof animate>[];
  deadline?: ReturnType<typeof setTimeout>;
}

/** Reveal actual supporting content. Never hide a region that is already on screen. */
export function initChapterMotion() {
  const shell = document.querySelector<HTMLElement>('.pro-experience');
  const scroller = document.querySelector<HTMLElement>('#professional-scroll');
  if (!shell || !scroller) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const staged = new Map<string, Entry>();
  const chapterIds = new Set(
    [...scroller.querySelectorAll<HTMLElement>('[data-chapter]')].map((panel) => panel.id)
  );
  const seen = new Set<string>();
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem('nur-seen-chapters') || '[]');
    if (Array.isArray(saved))
      for (const id of saved) if (typeof id === 'string' && chapterIds.has(id)) seen.add(id);
  } catch {}
  function remember(id: string | undefined) {
    if (!id || !chapterIds.has(id) || seen.has(id)) return;
    seen.add(id);
    try {
      sessionStorage.setItem('nur-seen-chapters', JSON.stringify([...seen]));
    } catch {}
  }
  // Direct links and restored pages have already shown their current section.
  remember(shell.dataset.active);
  let running: Entry | undefined,
    last = shell.dataset.active;
  let watchdog: ReturnType<typeof setTimeout> | undefined;

  function restore(entry: Entry) {
    clearTimeout(entry.deadline);
    entry.controls.forEach((control) => control.cancel());
    for (const part of entry.parts) {
      if (part.original) part.node.style.setProperty(part.property, part.original, part.priority);
      else part.node.style.removeProperty(part.property);
    }
    entry.panel.removeAttribute('data-chapter-motion');
  }
  function clearStaged() {
    staged.forEach(restore);
    staged.clear();
    clearTimeout(watchdog);
  }
  function clear() {
    clearStaged();
    if (running) restore(running);
    running = undefined;
    shell!.removeAttribute('data-arrival');
  }
  function allowed() {
    return (
      !reduced.matches && !document.hidden && document.documentElement.dataset.world === 'builder'
    );
  }

  function stage(id: string) {
    const panel = document.getElementById(id);
    if (seen.has(id) || !allowed() || !panel || id === 'top' || typeof panel.animate !== 'function')
      return;
    const bounds = panel.getBoundingClientRect(),
      viewport = scroller!.getBoundingClientRect();
    // Reversal can expose a destination before another gesture starts. Keep it visible.
    if (bounds.bottom > viewport.top + 1 && bounds.top < viewport.bottom - 1) return;
    const timing = motionTiming.chapter;
    const selectors =
      id === 'summary'
        ? ['.pro-summary__scope']
        : id === 'work'
          ? ['.project-gallery__stage']
          : id === 'experience-work'
              ? ['.pro-employment']
              : id === 'approach'
                ? ['.pro-approach-list']
                : id === 'contact'
                  ? ['.pro-contact__email', '.pro-contact__aside']
                  : [];
    const parts: Part[] = [];
    for (const selector of selectors) {
      const node = panel.querySelector<HTMLElement>(selector);
      if (!node) continue;
      const property = id === 'contact' ? 'opacity' : 'clip-path';
      const duration =
        id === 'contact' ? timing.contact : id === 'approach' ? timing.sequence : timing.reveal;
      parts.push({
        node,
        property,
        original: node.style.getPropertyValue(property),
        priority: node.style.getPropertyPriority(property),
        duration,
        delay: id === 'work' && selector === '.pro-project-selection' ? timing.workStagger : 0
      });
    }
    if (parts.length) {
      // The static Astro section owns preparation. React's SSR attributes stay intact.
      panel.dataset.chapterMotion = 'prepared';
      staged.set(id, {id, panel, parts, controls: []});
    }
  }
  function begin(event: Event) {
    clear();
    const {id, quiet} = (event as CustomEvent<{id: string; quiet: boolean}>).detail;
    if (!quiet) stage(id);
  }
  function touch(event: PointerEvent) {
    if (
      event.pointerType !== 'touch' ||
      (event.target as Element).closest('a,button,input,select,textarea,dialog')
    )
      return;
    clear();
    const panels = [...scroller!.querySelectorAll<HTMLElement>('[data-chapter]')];
    const index = panels.findIndex((panel) => panel.id === shell!.dataset.active);
    for (const adjacent of [panels[index - 1], panels[index + 1]]) if (adjacent) stage(adjacent.id);
    // A cancelled gesture must never leave off-screen content masked indefinitely.
    watchdog = setTimeout(clearStaged, 10000);
  }
  function arrive(event: Event) {
    const active = shell!.dataset.active;
    if (!allowed() || (event as CustomEvent).detail?.quiet) {
      clear();
      remember(active);
      last = active;
      return;
    }
    if (active === last) {
      clearStaged();
      remember(active);
      return;
    }
    last = active;
    const returning = active !== undefined && seen.has(active);
    remember(active);
    if (returning) {
      clear();
      return;
    }
    const entry = staged.get(active || '');
    if (entry) staged.delete(entry.id);
    clearStaged();
    if (running) restore(running);
    running = entry;
    if (!entry) {
      shell!.removeAttribute('data-arrival');
      return;
    }
    shell!.dataset.arrival = entry.id;
    for (const part of entry.parts) {
      if (!part.node.getClientRects().length) continue;
      entry.controls.push(
        animate(
          part.node,
          part.property === 'opacity'
            ? {opacity: [0, 1]}
            : {clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)']},
          {duration: part.duration, delay: part.delay, ease: motionEase('--ease-preview')}
        )
      );
    }
    entry.panel.dataset.chapterMotion = 'running';
    const finish = () => {
      if (running === entry) {
        restore(entry);
        running = undefined;
        shell!.removeAttribute('data-arrival');
      }
    };
    // Hydration can hide the SSR link fallback while its WAAPI effect is running.
    // That effect may stop resolving finished; the authored lifetime still bounds cleanup.
    entry.deadline = setTimeout(
      finish,
      Math.max(...entry.parts.map((part) => part.duration + part.delay)) * 1000 + 100
    );
    void Promise.all(entry.controls.map((control) => control.finished)).then(finish, () => {
      if (running === entry) clear();
    });
  }
  function interaction(event: Event) {
    if ((event.target as Element).closest('[data-chapter-motion]')) clear();
  }
  function world() {
    clear();
    last = shell!.dataset.active;
  }
  const interruptions = [
    'nur:transition-start',
    'pagehide',
    'popstate',
    'hashchange',
    'resize',
    'keydown'
  ];
  window.addEventListener('nur:chapter-start', begin);
  window.addEventListener('nur:chapter', arrive);
  window.addEventListener('nur:world', world);
  interruptions.forEach((name) => window.addEventListener(name, clear));
  scroller.addEventListener('pointerdown', touch, {passive: true});
  document.addEventListener('pointerdown', interaction, true);
  document.addEventListener('focusin', interaction, true);
  document.addEventListener('visibilitychange', clear);
  reduced.addEventListener('change', clear);
  return () => {
    clear();
    window.removeEventListener('nur:chapter-start', begin);
    window.removeEventListener('nur:chapter', arrive);
    window.removeEventListener('nur:world', world);
    interruptions.forEach((name) => window.removeEventListener(name, clear));
    scroller.removeEventListener('pointerdown', touch);
    document.removeEventListener('pointerdown', interaction, true);
    document.removeEventListener('focusin', interaction, true);
    document.removeEventListener('visibilitychange', clear);
    reduced.removeEventListener('change', clear);
  };
}
