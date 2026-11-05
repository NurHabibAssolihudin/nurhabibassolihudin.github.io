import {animate} from 'motion';
import {animate as animateDOM} from 'motion/mini';
import {motionEase} from './motion-settings';

/** Shared Motion ownership for the static Astro interface; no extra React roots. */
export function initInterfaceMotion() {
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const controls=new Map<Element,ReturnType<typeof animate>>();
  const gestures=new Map<Element,ReturnType<typeof animateDOM>>();
  function move(node:Element,transform:string,duration=.34) {
    const element=node as HTMLElement;
    const from=getComputedStyle(element).transform;
    gestures.get(node)?.cancel();
    const to=reduced.matches?'none':transform;
    element.style.transform=from;
    const control=animateDOM(element,{transform:[from,to]},{duration:reduced.matches?0:duration,ease:motionEase('--ease-preview')});
    gestures.set(node,control);
    void control.finished.then(()=>{if(gestures.get(node)===control){element.style.transform=to;control.cancel();gestures.delete(node);}});
  }
  root.classList.add('motion-interface');
  const targets=[...document.querySelectorAll<HTMLElement>('.pro-button:not(.contact-form__send), .bar .icon, .pro-link, .pro-contact__aside a, .world--creator .btn, .world--creator .quiet')];
  // Entry motion belongs to chapter visibility. Hover must never start a
  // positional animation on text links or ordinary controls.
  let pressed:HTMLElement|null=null;
  function press(event:PointerEvent) {
    const node=(event.target as Element).closest<HTMLElement>('.pro-button:not(.contact-form__send),.bar .icon,.world--creator .btn');
    if(node&&!(node as HTMLButtonElement).disabled){pressed=node;move(node,'translateY(0px) scale(.96)',.12);}
  }
  function release(){if(pressed)move(pressed,'none',.24);pressed=null;}
  document.addEventListener('pointerdown',press);
  document.addEventListener('pointerup',release);
  document.addEventListener('pointercancel',release);

  // A single travelling underline communicates location, rather than animating labels.
  const nav=document.querySelector<HTMLElement>('.nav');
  const marker=document.createElement('span');marker.className='motion-nav-marker';marker.ariaHidden='true';nav?.append(marker);
  let active='';
  function navigation(quiet=false) {
    if(!nav)return;
    const chapter=document.querySelector<HTMLElement>('.pro-experience')?.dataset.active;
    const links=[...nav.querySelectorAll<HTMLAnchorElement>('.nav__set a')].filter(link=>link.getClientRects().length);
    const selected=root.dataset.world==='builder'?links.find(link=>link.hash==='#'+chapter):links.find(link=>link.classList.contains('is-current'));
    if(!selected){marker.style.opacity='0';active='';return;}
    const box=selected.getBoundingClientRect(),base=nav.getBoundingClientRect();
    marker.style.opacity='1';
    controls.get(marker)?.stop();
    const transform=`translate3d(${box.left-base.left}px,${box.bottom-base.top+6}px,0) scaleX(${box.width})`;
    const control=animate(marker,{transform},{duration:quiet||reduced.matches||!active?0:.38,ease:motionEase()});controls.set(marker,control);
    active=selected.hash;
    for(const link of links){const current=link===selected;link.classList.toggle('is-current',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  }
  const sync=()=>navigation();
  const observer=new MutationObserver(sync);
  const shell=document.querySelector('.pro-experience');if(shell)observer.observe(shell,{attributes:true,attributeFilter:['data-active']});
  observer.observe(root,{attributes:true,attributeFilter:['data-world']});
  let navFrame=0;
  window.addEventListener('scroll',()=>{if(root.dataset.world!=='creator')return;cancelAnimationFrame(navFrame);navFrame=requestAnimationFrame(sync);},{passive:true});
  const resize=()=>navigation(true);window.addEventListener('resize',resize);window.addEventListener('nur:world',sync);document.fonts.ready.then(resize);navigation(true);

  // Capture real computed palettes before/after the theme switch, including contact fields.
  const themeNodes=[...document.querySelectorAll<HTMLElement>('body,.bar,.menu,.pro-panel,.contact-form input,.contact-form textarea,.project-reader__surface')];
  type Palette={node:HTMLElement;control:ReturnType<typeof animate>;background:string;color:string};
  let palette:Palette[]=[];
  function restore(entry:Palette){entry.control.stop();entry.node.style.backgroundColor=entry.background;entry.node.style.color=entry.color;}
  function stopPalette(){palette.forEach(restore);palette=[];}
  function changeTheme(commit:()=>void,quiet=false) {
    const old=themeNodes.map(node=>({backgroundColor:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color}));
    stopPalette();
    commit();
    if(quiet||reduced.matches)return;
    themeNodes.forEach((node,index)=>{
      const after=getComputedStyle(node);
      if(old[index].backgroundColor===after.backgroundColor&&old[index].color===after.color)return;
      const background=node.style.backgroundColor,color=node.style.color;
      const control=animate(node,{backgroundColor:[old[index].backgroundColor,after.backgroundColor],color:[old[index].color,after.color]},{duration:.48,ease:motionEase('--ease-in-out')});
      const entry={node,control,background,color};
      palette.push(entry);void control.finished.then(()=>{if(palette.includes(entry)){restore(entry);palette=palette.filter(item=>item!==entry);}});
    });
    document.querySelectorAll<HTMLElement>('[data-theme-toggle] svg').forEach(icon=>{
      if(icon.getClientRects().length)animate(icon,{transform:['rotate(-65deg) scale(.65)','rotate(0deg) scale(1)'],opacity:[0,1]},{duration:.4,ease:motionEase()});
    });
  }
  const quiet=()=>{stopPalette();for(const node of targets)move(node,'none',0);pressed=null;navigation(true);};
  reduced.addEventListener('change',quiet);
  return {changeTheme};
}


