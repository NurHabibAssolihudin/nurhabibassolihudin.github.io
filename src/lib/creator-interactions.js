/* Native section ownership stays outside the deferred React scene. */
export {};
const root=document.documentElement;
let current='';
const nav=new IntersectionObserver(entries=>{
  if(root.dataset.world!=='creator')return;
  const visible=entries.filter(entry=>entry.isIntersecting&&entry.target.closest('.world.is-live')).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if(!visible.length||current===visible[0].target.id)return;
  current=visible[0].target.id;
  document.querySelectorAll('.bar .nav__set--creator a').forEach(link=>{
    const active=link.hash==='#'+current;link.classList.toggle('is-current',active);
    if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });
  window.dispatchEvent(new Event('nur:creator-section'));
},{rootMargin:'-8% 0px -65% 0px',threshold:0});
document.querySelectorAll('.world--creator section[id]').forEach(section=>nav.observe(section));
