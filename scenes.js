/* Scroll explains the stack. Object loops only run in the current, visible scene. */
(function(){
  'use strict';
  const root=document.documentElement;
  const deck=document.querySelector('.discipline-deck');
  if(!deck||!('IntersectionObserver' in window))return;
  const scenes=Array.from(deck.children);
  const surfaces=scenes.map(scene=>scene.querySelector('.discipline-scene__surface'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,visible=false;
  function update(){
    frame=0;
    const running=visible&&!document.hidden&&root.dataset.world==='builder'&&!root.classList.contains('is-crossing');
    if(!running){scenes.forEach(scene=>scene.classList.remove('is-active'));return;}
    const boxes=scenes.map(scene=>scene.getBoundingClientRect());
    const stack=!reduced.matches&&scenes.every((scene,index)=>scene.offsetHeight+32+index*22<innerHeight-12);
    if(root.classList.contains('scenes-flow')===stack)root.classList.toggle('scenes-flow',!stack);
    let active=0;
    boxes.forEach((box,index)=>{if(box.top<innerHeight*.57)active=index;});
    scenes.forEach((scene,index)=>{
      scene.classList.toggle('is-active',index===active&&boxes[index].bottom>0&&boxes[index].top<innerHeight);
      // Read positions together, then write only each surface's own composite transform.
      const next=boxes[index+1];
      const progress=next&&stack?Math.max(0,Math.min(1,(innerHeight*.8-next.top)/(innerHeight*.8-100))):0;
      surfaces[index].style.transform=progress?`translateY(${-10*progress}px) scale(${1-.035*progress})`:'none';
    });
    deck.dataset.active=String(active);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'80px 0px'}).observe(deck);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  deck.addEventListener('focusin',event=>{
    const scene=event.target.closest('.discipline-scene');
    if(!scene||reduced.matches||root.classList.contains('scenes-flow'))return;
    // A keyboard user can reach links in an older card under the stack. Reveal
    // its original flow position instead of leaving focus behind another card.
    const index=scenes.indexOf(scene);
    const top=scrollY+deck.getBoundingClientRect().top+scenes.slice(0,index).reduce((sum,item)=>sum+item.offsetHeight+parseFloat(getComputedStyle(item).marginBottom),0);
    window.scrollTo({top:top-parseFloat(getComputedStyle(scene).top)-8,behavior:'instant'});
    schedule();
  });
  document.addEventListener('visibilitychange',()=>{root.classList.toggle('scenes-hidden',document.hidden);schedule();});
  new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['data-world','class']});
  reduced.addEventListener('change',schedule);
  root.classList.add('has-scenes');schedule();
})();
