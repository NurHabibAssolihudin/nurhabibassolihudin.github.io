/* Bitmap dot front + compositor circle reveal. Each illustration is painted once. */
(function(){
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),clamp=x=>Math.max(0,Math.min(1,x));
  window.NurTransit={async run({root,rift,worlds,name,origin,swap,closeMenu}){
    const keyboard=origin?.matches(':focus-visible'),experience=document.querySelector('#experience');
    const front=document.createElement('canvas'),context=front.getContext('2d');
    if(!rift||!experience||!context||reduced.matches||!front.animate){swap(name,keyboard);window.NurPlanet?.snapshot();return;}
    const width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),outgoing=worlds[root.dataset.world],bar=document.querySelector('.bar');
    const box=outgoing.querySelector('.core').getBoundingClientRect();
    const focal=box.bottom>0&&box.top<height?{x:clamp((box.left+box.width/2)/width)*width,y:clamp((box.top+box.height/2)/height)*height}:{x:width/2,y:height/2};
    const farthest=(x,y)=>Math.max(Math.hypot(x,y),Math.hypot(width-x,y),Math.hypot(x,height-y),Math.hypot(width-x,height-y))+70;
    const signal=name==='creator'?'#ff5032':'#4264ff',size=560,center=size/2,solid=218;
    front.width=front.height=Math.round(size*dpr);context.setTransform(dpr,0,0,dpr,0,0);front.className='portal__canvas';
    front.style.cssText=`inset:auto;left:${focal.x}px;top:${focal.y}px;width:${size}px;height:${size}px;transform-origin:center;`;
    // One filled disc with a broken particulate edge. There is no per-frame raster work.
    context.fillStyle='#101722';context.beginPath();context.arc(center,center,solid,0,Math.PI*2);context.fill();
    for(let i=0;i<210;i++){
      const angle=i*2.39996,radius=solid+((i*47)%49),r=2+(i*13)%9;
      context.fillStyle=i%31===0?signal:'#101722';context.beginPath();context.arc(center+Math.cos(angle)*radius,center+Math.sin(angle)*radius,r,0,Math.PI*2);context.fill();
    }
    const emblem=document.createElement('canvas');emblem.width=220*dpr;emblem.height=190*dpr;emblem.className='portal__emblem';
    const ink=emblem.getContext('2d');ink.setTransform(dpr,0,0,dpr,0,0);ink.fillStyle='#f1efe7';
    if(!window.NurPlanet?.emblem?.(ink,name)){
      ink.beginPath();ink.arc(110,90,40,0,Math.PI*2);ink.fill();
    }
    emblem.style.left=width/2+'px';emblem.style.top=height/2-35+'px';
    const label=document.createElement('p');label.className='portal__name';label.textContent=name==='creator'?'alimagine':'Nur';label.style.left=width/2+'px';label.style.top=height/2+50+'px';
    const total=1810,coverEnd=650,revealStart=760,easing=getComputedStyle(root).getPropertyValue('--ease-in-out').trim();
    let clock,cover,opening,incoming,departing,barMotion,frame=0,swapped=false,done=false;
    function changeWorld(){
      if(swapped)return;swapped=true;
      // This class is applied only once the closing disc fully covers the viewport.
      root.classList.add('is-planet-opening');departing?.cancel();barMotion?.cancel();
      experience.style.clipPath='circle(0px at 50% 50%)';swap(name,keyboard);
      worlds[name].querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('in'));
      window.NurPlanet?.snapshot();window.NurField?.snapshot();
      const destination=worlds[name].querySelector('.core').getBoundingClientRect(),x=clamp((destination.left+destination.width/2)/width)*width,y=clamp((destination.top+destination.height/2)/height)*height;
      const reach=farthest(x,y),at=` at ${x}px ${y}px)`;
      opening=experience.animate({clipPath:['circle(0px'+at,'circle('+reach+'px'+at]},{duration:1050,easing,fill:'both'});opening.pause();
      incoming=worlds[name].querySelector('.hero__grid').animate([{transform:'scale(1.025)',opacity:.7},{transform:'scale(1)',opacity:1}],{duration:1050,easing:getComputedStyle(root).getPropertyValue('--ease').trim(),fill:'both'});incoming.pause();
      rift.dataset.reach=String(reach);front.hidden=true;
    }
    function draw(time){
      if(time>=coverEnd)changeWorld();
      else{cover.currentTime=time;departing.currentTime=time;barMotion.currentTime=time;rift.dataset.phase='cover';}
      if(swapped){
        const t=Math.max(0,time-revealStart);opening.currentTime=t;incoming.currentTime=t;
        const progress=opening.effect.getComputedTiming().progress||0;rift.dataset.radius=(+rift.dataset.reach*progress).toFixed(1);rift.dataset.phase=t?'reveal':'turn';
      }
      const enter=clamp((time-220)/330),exit=clamp((time-revealStart)/280),alpha=enter*(1-exit);
      emblem.style.opacity=String(alpha);emblem.style.transform=`translate(-50%,-50%) scale(${.92+enter*.08+exit*.14})`;label.style.opacity=String(alpha);
    }
    function stop(){clock?.finish();}
    function visibility(){if(document.hidden)stop();}
    try{
      closeMenu();root.classList.add('is-crossing','is-planet-crossing');
      window.NurPlanet?.charge(true);window.NurPlanet?.hold(true);window.NurField?.charge(true);window.NurField?.hold(true);
      rift.replaceChildren(front,emblem,label);rift.classList.add('is-on');rift.dataset.mode='planet';rift.dataset.originX=focal.x.toFixed(1);rift.dataset.originY=focal.y.toFixed(1);
      // The clock is first on this canvas, so dev tools can scrub the complete sequence.
      clock=front.animate([{opacity:1},{opacity:1}],{duration:total,fill:'both'});
      const end=farthest(focal.x,focal.y)/solid;
      cover=front.animate([{transform:'translate(-50%,-50%) scale(.005)'},{transform:`translate(-50%,-50%) scale(${end})`}],{duration:coverEnd,easing,fill:'both'});cover.pause();
      departing=outgoing.querySelector('.hero__grid').animate([{transform:'scale(1)',opacity:1},{transform:'scale(.97)',opacity:.5}],{duration:coverEnd,easing,fill:'both'});departing.pause();
      barMotion=bar.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-30px)',opacity:0}],{duration:coverEnd,easing,fill:'both'});barMotion.pause();
      window.addEventListener('resize',stop);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',stop);
      function tick(){if(done)return;draw(Number(clock.currentTime)||0);frame=requestAnimationFrame(tick);}
      draw(0);frame=requestAnimationFrame(tick);await clock.finished.catch(()=>{});
    }finally{
      done=true;if(frame)cancelAnimationFrame(frame);changeWorld();
      [clock,cover,opening,incoming,departing,barMotion].forEach(animation=>animation?.cancel());experience.style.removeProperty('clip-path');
      rift.replaceChildren();rift.classList.remove('is-on');['phase','mode','originX','originY','radius','reach'].forEach(key=>delete rift.dataset[key]);
      root.classList.remove('is-crossing','is-planet-crossing','is-planet-opening');
      window.NurPlanet?.charge(false);window.NurPlanet?.hold(false);window.NurField?.charge(false);window.NurField?.hold(false);
      window.removeEventListener('resize',stop);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',stop);
    }
  }};
})();
