import {animate} from 'motion/mini';
import {motionEase} from './motion-settings';

export function createMenuMotion(menu: HTMLElement, trigger: HTMLButtonElement, indonesian: boolean) {
  let open = !menu.hidden, generation = 0;
  let animation: ReturnType<typeof animate> | undefined;
  let parts: ReturnType<typeof animate>[] = [];
  const items=[...menu.querySelectorAll<HTMLElement>('.nav__set a,.menu__preferences')];
  const bars=[...trigger.querySelectorAll<HTMLElement>(':scope>span')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function settle() {
    animation?.stop(); animation = undefined;
    parts.forEach(part=>part.cancel());parts=[];
    items.forEach(item=>{item.style.removeProperty('opacity');item.style.removeProperty('transform');});
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
    parts.forEach(part=>part.stop());parts=[];
    bars.forEach((bar,index)=>parts.push(animate(bar,{transform:open?`translateY(${index===0?3:-3}px) rotate(${index===0?45:-45}deg)`:'translateY(0px) rotate(0deg)'},{duration:immediate||reduced.matches?0:.24,ease:motionEase()})));
    menu.inert = !open;
    if (immediate || reduced.matches || typeof menu.animate !== 'function') { settle(); return; }
    menu.hidden = false;
    const box = menu.getBoundingClientRect(), source = trigger.getBoundingClientRect();
    menu.style.transformOrigin = `${Math.max(0, Math.min(box.width, source.left + source.width / 2 - box.left))}px 0px`;
    if (wasHidden) { menu.style.opacity = '0'; menu.style.transform = 'translateY(-8px) scale(.97)'; }
    if(open) items.filter(item=>item.getClientRects().length).forEach((item,index)=>{
      parts.push(animate(item,{opacity:wasHidden?[0,1]:1,transform:wasHidden?['translateY(12px)','translateY(0px)']:'translateY(0px)'},{duration:.32,delay:Math.min(index,5)*.045,ease:motionEase()}));
    });
    animation = animate(menu, {
      opacity: open ? 1 : 0,
      transform: open ? 'translateY(0px) scale(1)' : 'translateY(-6px) scale(.98)',
    }, {duration: open ? .48 : .18, ease: motionEase()});
    animation.finished.then(() => { if (generation === ticket) settle(); });
  }
  function reset() { generation++; settle(); }
  reduced.addEventListener('change', reset);
  window.addEventListener('pagehide', reset);
  window.addEventListener('resize', reset);
  return {setOpen, get isOpen() { return open; }};
}
