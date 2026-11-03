import {animate} from 'motion/mini';
import {motionEase} from './motion-settings';

export function createMenuMotion(menu: HTMLElement, trigger: HTMLButtonElement, indonesian: boolean) {
  let open = !menu.hidden, generation = 0;
  let animation: ReturnType<typeof animate> | undefined;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function settle() {
    animation?.stop(); animation = undefined;
    menu.hidden = !open;
    menu.style.removeProperty('opacity'); menu.style.removeProperty('transform');
  }
  function setOpen(next: boolean, immediate = false) {
    if (open === next && !animation) return;
    open = next;
    const ticket = ++generation, wasHidden = menu.hidden;
    animation?.stop(); animation = undefined;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', indonesian ? open ? 'Tutup menu' : 'Buka menu' : open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    if (immediate || reduced.matches || typeof menu.animate !== 'function') { settle(); return; }
    menu.hidden = false;
    const box = menu.getBoundingClientRect(), source = trigger.getBoundingClientRect();
    menu.style.transformOrigin = `${Math.max(0, Math.min(box.width, source.left + source.width / 2 - box.left))}px 0px`;
    if (wasHidden) { menu.style.opacity = '0'; menu.style.transform = 'translateY(-8px) scale(.97)'; }
    animation = animate(menu, {
      opacity: open ? 1 : 0,
      transform: open ? 'translateY(0px) scale(1)' : 'translateY(-6px) scale(.98)',
    }, {duration: open ? .22 : .14, ease: motionEase()});
    animation.finished.then(() => { if (generation === ticket) settle(); });
  }
  function reset() { generation++; settle(); }
  reduced.addEventListener('change', reset);
  window.addEventListener('pagehide', reset);
  window.addEventListener('resize', reset);
  return {setOpen, get isOpen() { return open; }};
}
