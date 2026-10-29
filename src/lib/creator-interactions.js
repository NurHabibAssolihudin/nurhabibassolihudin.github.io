/* Real controls: tool-to-project navigation, interruptible native details, section state. */
(function(){
  'use strict';
  const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const easing=getComputedStyle(root).getPropertyValue('--ease').trim();
  const widgets=document.querySelectorAll('[data-toolbox]');
  widgets.forEach(widget=>{
    const controls=[...widget.querySelectorAll('[data-tool]')],title=widget.querySelector('.toolbox__title'),links=widget.querySelector('.toolbox__links'),path=widget.querySelector('.toolbox__connection'),result=widget.querySelector('.toolbox__result');
    const projects=[...document.querySelectorAll('.world--builder [data-tech]')];let feedback;
    function select(button,interactive){
      const tool=button.dataset.tool;
      controls.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
      title.textContent=tool;links.replaceChildren();
      projects.forEach(project=>{
        const related=project.dataset.tech.split(' ').includes(tool);
        if(interactive)project.classList.toggle('is-related',related);
        if(!related)return;
        const item=document.createElement('li'),link=document.createElement('a'),arrow=document.createElement('span');
        link.href='#'+project.id;link.textContent=project.querySelector('.panel__title,.more__name').textContent+' ';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);item.append(link);links.append(item);
      });
      path.setAttribute('d',`M${+button.dataset.x*6} ${+button.dataset.y*4.2}Q300 340 300 210`);
      if(interactive&&!reduced.matches){feedback?.cancel();feedback=result.animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing});}
    }
    controls.forEach(button=>button.addEventListener('click',()=>select(button,true)));
    reduced.addEventListener('change',()=>{if(reduced.matches)feedback?.cancel();});
    select(controls[0],false);widget.querySelector('.toolbox__all').open=false;root.classList.add('has-tools');
  });

  const accordions=[];
  document.querySelectorAll('details.project-details,details.process-step,details.toolbox__all').forEach(details=>{
    const summary=details.querySelector(':scope>summary');if(!summary||!details.animate)return;
    const state={details,target:details.open,animation:null};accordions.push(state);summary.setAttribute('aria-expanded',String(state.target));
    function settle(){state.animation?.cancel();state.animation=null;details.open=state.target;details.style.removeProperty('overflow');summary.setAttribute('aria-expanded',String(state.target));}
    state.settle=settle;
    summary.addEventListener('click',event=>{
      if(reduced.matches)return;
      event.preventDefault();
      const height=details.getBoundingClientRect().height;
      state.target=!state.target;state.animation?.cancel();details.open=true;
      const style=getComputedStyle(details);
      const edges=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
      const target=state.target?details.scrollHeight+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth):summary.getBoundingClientRect().height+edges;
      details.style.overflow='hidden';summary.setAttribute('aria-expanded',String(state.target));
      const animation=details.animate([{height:height+'px'},{height:target+'px'}],{duration:220,easing});state.animation=animation;
      animation.finished.then(()=>{if(state.animation===animation)settle();},()=>{});
    });
    details.addEventListener('toggle',()=>{if(!state.animation){state.target=details.open;summary.setAttribute('aria-expanded',String(details.open));}});
  });
  function settleAll(){accordions.forEach(state=>state.settle());}
  reduced.addEventListener('change',settleAll);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settleAll();});
  new MutationObserver(()=>{if(root.classList.contains('is-crossing'))settleAll();}).observe(root,{attributes:true,attributeFilter:['class']});

  const headings=[...document.querySelectorAll('.h2')];
  headings.forEach(heading=>{
    const mask=document.createElement('span'),text=document.createElement('span');mask.className='heading-mask';
    while(heading.firstChild)text.append(heading.firstChild);mask.append(text);heading.append(mask);heading.classList.add('has-heading-motion');
  });
  root.classList.add('has-components');
  if('IntersectionObserver' in window){
    const entrances=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-seen');entrances.unobserve(entry.target);}}),{threshold:.15});headings.forEach(heading=>entrances.observe(heading));
    const nav=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting&&entry.target.closest('.world.is-live')).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      if(!visible.length)return;
      document.querySelectorAll('.bar .nav__set a').forEach(link=>{
        const active=link.hash==='#'+visible[0].target.id;link.classList.toggle('is-current',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-8% 0px -65% 0px',threshold:0});document.querySelectorAll('.world>section[id]').forEach(section=>nav.observe(section));
  }else headings.forEach(heading=>heading.classList.add('is-seen'));
})();
