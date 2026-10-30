import { chapterIds, projectSectionIds } from '../data/navigation';
import { createWheelNavigation } from './wheel-navigation';

export function initProfessionalNavigation() {
  const parent = document.querySelector<HTMLElement>('.pro-experience');
  const container = document.querySelector<HTMLElement>('#professional-scroll');
  if (!parent || !container || parent.dataset.enhanced === 'true') return;
  const shell = parent, scrollArea = container;
  const panels = [...scrollArea.querySelectorAll<HTMLElement>('[data-chapter]')];
  const contents = panels.map(panel => panel.querySelector<HTMLElement>('.pro-content')!);
  const wheelNavigation = createWheelNavigation(chapterIds.length);
  const aliases: Record<string, string> = { platforms: 'summary', stack: 'approach', about: 'summary' };
  let current = 0, offsets: number[] = [], readingEnds: number[] = [], width = 0, height = 0, frame = 0, disposed = false;
  let timer: ReturnType<typeof setTimeout>;
  const offset = (index: number) => offsets[index] ?? panels[index].offsetTop - scrollArea.offsetTop;
  const activate = (index: number) => { current = index; shell.dataset.active = chapterIds[index]; };

  function selectProject(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= projectSectionIds.length || shell.dataset.selectedProject === String(index)) return;
    shell.dataset.selectedProject = String(index);
    try { sessionStorage.setItem('nur-selected-project', String(index)); } catch {}
    window.dispatchEvent(new Event('nur:project'));
  }
  function jump(index: number, addHistory = true, focus = false) {
    if (!panels[index]) return;
    scrollArea.scrollTo({ top: offset(index), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || focus ? 'instant' : 'smooth' });
    if (addHistory) history.pushState(null, '', '#' + chapterIds[index]);
    if (focus) panels[index].querySelector<HTMLElement>('h1,h2')?.focus({ preventScroll: true });
  }
  function readHash() {
    const hash = location.hash.slice(1), index = chapterIds.indexOf(aliases[hash] || hash);
    if (index < 0) return;
    const project = projectSectionIds.indexOf(chapterIds[index]);
    // A direct project link can seed an empty picker. Existing choices belong
    // to the visitor and must survive reloads/history through other sections.
    if (project >= 0 && shell.dataset.selectedProject === undefined) selectProject(project);
    scrollArea.scrollTo({ top: offset(index), behavior: 'instant' });
    activate(index);
  }
  function measure() {
    if (disposed || !scrollArea.clientHeight) return;
    const hadOffsets = offsets.length > 0;
    const aligned = hadOffsets && Math.abs(scrollArea.scrollTop - offset(current)) <= 1;
    const viewportChanged = width !== scrollArea.clientWidth || height !== scrollArea.clientHeight;
    const style = getComputedStyle(panels[0]);
    const available = scrollArea.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    let modeChanged = false;
    // A long translation must not disable section navigation for the whole page.
    // Only the section that needs extra reading space grows beyond the viewport.
    contents.forEach((content, index) => {
      const overflow = content.scrollHeight > available;
      if (panels[index].classList.contains('pro-panel--flow') !== overflow) modeChanged = true;
      panels[index].classList.toggle('pro-panel--flow', overflow);
    });
    const top = scrollArea.offsetTop;
    offsets = panels.map(panel => panel.offsetTop - top);
    width = scrollArea.clientWidth; height = scrollArea.clientHeight;
    readingEnds = panels.map((panel, index) => offsets[index] + Math.max(0, panel.offsetHeight - height));
    // Content measurement never routes through readHash. Only a structural layout
    // change may preserve an already aligned section at its new position.
    if (viewportChanged || modeChanged) {
      wheelNavigation.reset();
      if (aligned) scrollArea.scrollTo({ top: offset(current), behavior: 'instant' });
    }
  }
  function settle() {
    if (document.documentElement.dataset.world !== 'builder' || !offsets.length) return;
    const top = scrollArea.scrollTop;
    const distance = (index: number) => Math.max(offsets[index] - top, top - readingEnds[index], 0);
    const nearest = offsets.reduce((best, _value, index) => distance(index) < distance(best) ? index : best, 0);
    if (nearest !== current) {
      activate(nearest);
      // Reading a section is independent from choosing a work preview.
      history.replaceState(null, '', '#' + chapterIds[nearest]);
    }
    window.dispatchEvent(new Event('nur:chapter'));
    // A settled target section is reached even when native snapping or display
    // scaling adjusts its exact pixel position. arrive() only clears a matching
    // target; it never queues or starts another movement.
    wheelNavigation.arrive(nearest);
  }
  function scroll() { clearTimeout(timer); timer = setTimeout(settle, 160); }
  function links(event: MouseEvent) {
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = chapterIds.indexOf(aliases[anchor.hash.slice(1)] || anchor.hash.slice(1));
    if (index < 0 || document.documentElement.dataset.world !== 'builder') return;
    event.preventDefault(); wheelNavigation.reset(); jump(index, true, event.detail === 0);
    const project = projectSectionIds.indexOf(chapterIds[index]);
    if (project >= 0) selectProject(project);
  }
  function worldChange() {
    wheelNavigation.reset();
    if (document.documentElement.dataset.world === 'builder') {
      activate(0); measure(); scrollArea.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  function historyChange() { wheelNavigation.reset(); measure(); readHash(); }
  function readWithinSection(delta: number) {
    if (!panels[current].classList.contains('pro-panel--flow')) return false;
    const top = scrollArea.scrollTop, start = offset(current), end = readingEnds[current];
    // While travelling between sections, let the gesture controller handle
    // interruption/reversal instead of treating that travel as reading.
    if (top < start - 1 || top > end + 1) return false;
    if (delta > 0 ? top >= end - 1 : top <= start + 1) return false;
    scrollArea.scrollTo({ top: Math.max(start, Math.min(end, top + delta)), behavior: 'instant' });
    return true;
  }
  function keys(event: KeyboardEvent) {
    const target = event.target as Element;
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey || target.closest('input,textarea,select,button,a,[contenteditable],dialog') || document.documentElement.dataset.world !== 'builder') return;
    const step = ['ArrowDown','PageDown',' '].includes(event.key) ? 1 : ['ArrowUp','PageUp'].includes(event.key) ? -1 : 0;
    if (!step && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault(); wheelNavigation.reset();
    const readingStep = event.key.startsWith('Arrow') ? 40 : height * .8;
    if (step && readWithinSection(step * readingStep)) return;
    jump(event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : Math.max(0, Math.min(panels.length - 1, current + step)), true, true);
  }
  function wheel(event: WheelEvent) {
    if (event.ctrlKey || event.metaKey || document.documentElement.dataset.world !== 'builder' || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    let node = event.target as HTMLElement | null;
    while (node && node !== scrollArea) {
      if (/auto|scroll/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1) return;
      node = node.parentElement;
    }
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    if (delta && readWithinSection(delta)) return;
    const destination = wheelNavigation.input(delta, event.timeStamp, current);
    if (destination !== null) {
      jump(destination);
      if (Math.abs(offset(destination) - scrollArea.scrollTop) <= 1) settle();
    }
  }

  shell.dataset.enhanced = 'true'; document.documentElement.classList.add('pro-ready');
  try { const saved = sessionStorage.getItem('nur-selected-project'); if (saved !== null) selectProject(Number(saved)); } catch {}
  measure(); readHash();
  scrollArea.addEventListener('scroll', scroll, { passive: true });
  scrollArea.addEventListener('scrollend', settle);
  scrollArea.addEventListener('wheel', wheel, { passive: false });
  document.addEventListener('click', links); document.addEventListener('keydown', keys);
  window.addEventListener('popstate', historyChange); window.addEventListener('hashchange', historyChange); window.addEventListener('nur:world', worldChange);
  const resize = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); });
  resize.observe(scrollArea); contents.forEach(content => resize.observe(content));
  document.fonts.ready.then(measure);
  return () => {
    disposed = true; clearTimeout(timer); cancelAnimationFrame(frame); resize.disconnect();
    scrollArea.removeEventListener('scroll', scroll); scrollArea.removeEventListener('scrollend', settle); scrollArea.removeEventListener('wheel', wheel);
    document.removeEventListener('click', links); document.removeEventListener('keydown', keys);
    window.removeEventListener('popstate', historyChange); window.removeEventListener('hashchange', historyChange); window.removeEventListener('nur:world', worldChange);
    shell.dataset.enhanced = 'false'; document.documentElement.classList.remove('pro-ready');
  };
}
