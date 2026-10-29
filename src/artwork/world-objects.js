/* Two authored orbital scenes. Flat-lit materials, projected meshes, no external asset or shader. */
(function(){
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  const controllers=[],mounted=new WeakSet(),TAU=Math.PI*2;
  let held=false;
  const globe=document.createElement('canvas');globe.width=globe.height=400;
  const globeInk=globe.getContext('2d');
  if(globeInk){
    // Material illumination only: the globe has no land, noise, atlas or cartographic texture.
    const blue=globeInk.createRadialGradient(116,95,8,215,211,228);
    blue.addColorStop(0,'#7196ff');blue.addColorStop(.3,'#4264ff');blue.addColorStop(.73,'#2344d5');blue.addColorStop(1,'#101d69');
    globeInk.fillStyle=blue;globeInk.beginPath();globeInk.arc(200,200,196,0,TAU);globeInk.fill();
  }
  const facesOfBox=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
  function scene(context,{creator,time=0,aimX=0,aimY=0,charge=0}){
    const tasks=[];
    const orbitTime=time*3;
    const yaw=creator?-.48+aimX*.15:aimX*.15,pitch=creator?-.62+aimY*.1:-.13+aimY*.12,roll=creator?-.18:-.24;
    function project(p){
      const cx=Math.cos(yaw),sx=Math.sin(yaw),x=p[0]*cx+p[2]*sx,z=-p[0]*sx+p[2]*cx;
      const cp=Math.cos(pitch),sp=Math.sin(pitch),y=p[1]*cp-z*sp,zz=p[1]*sp+z*cp;
      const cr=Math.cos(roll),sr=Math.sin(roll),scale=190*3.8/(3.8-zz);
      return{x:320+(x*cr-y*sr)*scale,y:320+(x*sr+y*cr)*scale,z:zz,scale:scale/190};
    }
    function polygon(points,color,layer=0){const ps=points.map(project);tasks.push({z:ps.reduce((n,p)=>n+p.z,0)/ps.length+layer,draw(){context.fillStyle=color;context.beginPath();ps.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.closePath();context.fill();}});}
    function facing(n){return n[1]*Math.sin(pitch)+(-n[0]*Math.sin(yaw)+n[2]*Math.cos(yaw))*Math.cos(pitch)>0;}
    function prism(outline,top,bottom,colors,layer=0){
      if(facing([0,-1,0]))polygon(outline.map(([x,z])=>[x,top,z]),colors[0],layer);
      if(facing([0,1,0]))polygon([...outline].reverse().map(([x,z])=>[x,bottom,z]),colors[2],layer);
      const center=outline.reduce((c,p)=>[c[0]+p[0]/outline.length,c[1]+p[1]/outline.length],[0,0]);
      outline.forEach(([x,z],i)=>{const next=outline[(i+1)%outline.length];let n=[next[1]-z,0,x-next[0]];if(n[0]*((x+next[0])/2-center[0])+n[2]*((z+next[1])/2-center[1])<0)n=n.map(v=>-v);if(facing(n))polygon([[x,top,z],[next[0],top,next[1]],[next[0],bottom,next[1]],[x,bottom,z]],colors[1+i%(colors.length-1)],layer);});
    }
    function orbitPoint(angle,radius,incline){return[Math.cos(angle)*radius,Math.sin(angle)*incline*radius,Math.sin(angle)*Math.sqrt(1-incline*incline)*radius];}
    function track(radius,incline){
      for(let part=0;part<2;part++){
        const points=[];for(let i=0;i<=96;i++){const p=project(orbitPoint(i/96*TAU,radius,incline));points.push(p);}
        tasks.push({z:part?1.8:-1.8,draw(){context.strokeStyle='rgba(115,145,225,.25)';context.lineWidth=1;context.beginPath();let pen=false;points.forEach(p=>{if((p.z>=0)===!!part){if(pen)context.lineTo(p.x,p.y);else context.moveTo(p.x,p.y);pen=true;}else pen=false;});context.stroke();}});
      }
    }
    function satellite(angle,index){
      const radius=index%2?1.22:1.16,incline=index%2?-.24:.47,center=orbitPoint(angle,radius,incline),size=[.78,.65,.72,.62][index];
      const c=Math.cos(-angle),s=Math.sin(-angle);
      function box(offset,extent,solar){
        const vertices=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){const xx=(offset[0]+x*extent[0])*size,yy=(offset[1]+y*extent[1])*size,zz=(offset[2]+z*extent[2])*size;vertices.push([xx*c+zz*s+center[0],yy+center[1],-xx*s+zz*c+center[2]]);}
        const colors=solar?['#14245b','#5478dc','#263e8c','#799bff','#1d2c63','#395bc2']:['#7e90ac','#dce3ed','#9baac3','#f0f1ed','#596d8e','#bdcadd'];
        facesOfBox.forEach((indices,i)=>polygon(indices.map(k=>vertices[k]),colors[i]));
      }
      box([0,0,0],[.09,.07,.075],false);box([-.22,0,0],[.12,.018,.105],true);box([.22,0,0],[.12,.018,.105],true);box([0,-.115,0],[.012,.05,.012],false);
    }
    function mothership(){
      const drift=Math.sin(time*.5)*.018;
      const left=[[-.18,.62],[-.55,.28],[-.97,-.50],[-.68,-.79],[-.25,-.28]];
      const right=left.map(([x,z])=>[-x,z]).reverse();
      prism(left,.02+drift,.15+drift,['#62748e','#29394e','#132037','#42536c']);
      prism(right,.02+drift,.15+drift,['#9aa8bb','#42536c','#1b293f','#61738a']);
      // Outboard armour leaves a recognisable, swept carrier silhouette.
      prism([[-.67,-.77],[-.88,-.50],[-.98,-.58],[-.72,-.92]],-.035+drift,.12+drift,['#aab7c8','#34445c','#1c293e']);
      prism([[.67,-.77],[.72,-.92],[.98,-.58],[.88,-.50]],-.035+drift,.12+drift,['#7d8fa8','#24364c','#122035']);
      prism([[-.24,-.78],[.24,-.78],[.34,-.16],[.19,.66],[0,1.02],[-.19,.66],[-.34,-.16]],-.11+drift,.16+drift,['#8495af','#293b56','#16253c','#4c607c']);
      // Raised spine and a separate command island, rather than surface HUD graphics.
      polygon([[-.13,-.11+drift,-.58],[.13,-.11+drift,-.58],[0,-.34+drift,-.18]],'#d1d8df');
      polygon([[.13,-.11+drift,-.58],[.12,-.11+drift,.43],[0,-.34+drift,-.18]],'#7085a1');
      polygon([[.12,-.11+drift,.43],[-.12,-.11+drift,.43],[0,-.34+drift,-.18]],'#b4c0d0');
      polygon([[-.12,-.11+drift,.43],[-.13,-.11+drift,-.58],[0,-.34+drift,-.18]],'#435773');
      prism([[-.15,-.58],[.15,-.58],[.16,-.25],[-.16,-.25]],-.37+drift,-.18+drift,['#c3cbd4','#41546b','#6a7d95'],.5);
      polygon([[-.105,-.374+drift,-.55],[.105,-.374+drift,-.55],[.11,-.374+drift,-.45],[-.11,-.374+drift,-.45]],'#ff5032',.5);
      for(const x of [-.085,.085])prism([[x-.01,-.40],[x+.01,-.40],[x+.01,-.38],[x-.01,-.38]],-.57+drift,-.37+drift,['#d8dfe5','#7d8fa8','#435773'],.5);
      for(const side of [-1,1]){
        polygon([[side*.37,.015+drift,.10],[side*.47,.015+drift,-.07],[side*.67,.015+drift,-.34],[side*.54,.015+drift,-.41]],'#172538',.13);
        polygon([[side*.40,.012+drift,.05],[side*.43,.012+drift,.01],[side*.61,.012+drift,-.33],[side*.58,.012+drift,-.35]],'#ff5032',.14);
      }
      // A recessed hangar and three warm engine apertures are physical parts of the hull.
      polygon([[-.13,-.115+drift,.45],[.13,-.115+drift,.45],[.10,-.115+drift,.68],[0,-.115+drift,.83],[-.10,-.115+drift,.68]],'#101620');
      polygon([[-.065,-.118+drift,.49],[.065,-.118+drift,.49],[.045,-.118+drift,.67],[-.045,-.118+drift,.67]],charge?'#ffb56a':'#ff5032');
      for(const x of [-.16,0,.16])polygon([[x-.045,-.035+drift,-.785],[x+.045,-.035+drift,-.785],[x+.045,.085+drift,-.785],[x-.045,.085+drift,-.785]],'#ff6b3d');
    }
    function skull(angle,index){
      const center=project(orbitPoint(angle,1.18,index%2?.36:-.2));
      // Embers follow the actual orbital wake, with deterministic age and no random flashing.
      for(let j=1;j<=15;j++){
        const p=project(orbitPoint(angle-j*.025,1.18,index%2?.36:-.2));
        const flicker=Math.sin(time*2.4+j*2.1+index),radius=(1-j/17)*(1.6+(j%3)*.8)*p.scale;
        tasks.push({z:p.z,draw(){context.globalAlpha=(1-j/17)*.72;context.fillStyle=j%3===0?'#ffd58b':j%2?'#ff5032':'#ff962f';context.beginPath();context.arc(p.x+flicker*3,p.y-j*.55,radius,0,TAU);context.fill();context.globalAlpha=1;}});
      }
      tasks.push({z:center.z,draw(){
        const scale=center.scale*[.82,.72,.79,.67][index],lick=Math.sin(time*3.2+index)*3;
        context.save();context.translate(center.x,center.y);context.scale(scale,scale);context.rotate(Math.sin(angle)*.10);
        context.fillStyle='#ef3821';context.beginPath();context.moveTo(-16,1);context.bezierCurveTo(-29,-18,-12,-26,-20,-46);context.quadraticCurveTo(-7,-40,-7,-57-lick);context.quadraticCurveTo(5,-46,10,-65+lick);context.quadraticCurveTo(26,-40,18,-32);context.quadraticCurveTo(31,-28,18,-5);context.closePath();context.fill();
        context.fillStyle='#ff922e';context.beginPath();context.moveTo(-12,-2);context.quadraticCurveTo(-17,-22,-8,-36);context.quadraticCurveTo(0,-29,5,-49-lick);context.quadraticCurveTo(7,-33,14,-34);context.quadraticCurveTo(21,-15,12,0);context.closePath();context.fill();
        context.fillStyle='#ffe0a0';context.beginPath();context.moveTo(-7,-8);context.quadraticCurveTo(-8,-25,0,-34);context.quadraticCurveTo(2,-23,10,-20);context.lineTo(10,-5);context.closePath();context.fill();
        // Broad cheekbones, hollow eyes, nasal opening and a separated toothed jaw.
        context.fillStyle='#eeece2';context.beginPath();context.moveTo(-14,-7);context.bezierCurveTo(-20,-24,-7,-32,5,-29);context.bezierCurveTo(23,-28,24,-13,17,-5);context.lineTo(11,1);context.lineTo(10,10);context.lineTo(-7,10);context.lineTo(-9,1);context.closePath();context.fill();
        context.fillStyle='#b3b9c2';context.beginPath();context.moveTo(11,-26);context.quadraticCurveTo(25,-19,17,-5);context.lineTo(11,1);context.lineTo(10,10);context.lineTo(4,10);context.lineTo(6,-6);context.closePath();context.fill();
        context.fillStyle='#131823';context.beginPath();context.moveTo(-12,-17);context.lineTo(-3,-15);context.lineTo(-4,-8);context.lineTo(-11,-9);context.closePath();context.moveTo(5,-15);context.lineTo(15,-18);context.lineTo(14,-10);context.lineTo(6,-8);context.closePath();context.fill();
        context.beginPath();context.moveTo(1,-8);context.lineTo(-2,-2);context.lineTo(4,-2);context.closePath();context.fill();
        context.fillRect(-5,3,12,3);for(const x of [-3,1,5])context.fillRect(x,4,1.5,5);
        context.restore();
      }});
    }
    if(creator){
      mothership();for(let i=0;i<4;i++)skull(.48+i*TAU/4+orbitTime*.22,i);
    }else{
      track(1.16,.47);track(1.22,-.24);
      tasks.push({z:0,draw(){context.drawImage(globe,190,190,260,260);}});
      for(let i=0;i<4;i++)satellite(.35+i*TAU/4+orbitTime*(i%2?.13:.17),i);
    }
    tasks.sort((a,b)=>a.z-b.z).forEach(task=>task.draw());
  }
  function prepare(world){
  document.querySelectorAll(`.world--${world==='creator'?'creator':'builder'} .core__canvas`).forEach(canvas=>{
    if(mounted.has(canvas))return;mounted.add(canvas);
    const context=canvas.getContext('2d');if(!context||!globeInk)return;
    const button=canvas.closest('.core'),creator=canvas.closest('.world').dataset.world==='creator';
    let frame=0,last=0,previous=0,time=0,visible=false,aimX=0,aimY=0,targetX=0,targetY=0,charge=0;
    function draw(stamp,force=false){
      frame=0;if(!visible||document.hidden||button.closest('.world').dataset.world!==document.documentElement.dataset.world)return;
      if(!force&&stamp-last<1000/24){wake();return;}
      const elapsed=previous?Math.min(stamp-previous,80):42;last=previous=stamp;
      if(!held&&!reduced.matches){time+=elapsed*.001;aimX+=(targetX-aimX)*.15;aimY+=(targetY-aimY)*.15;}
      context.setTransform(canvas.width/640,0,0,canvas.height/640,0,0);context.clearRect(0,0,640,640);
      scene(context,{creator,time,aimX,aimY,charge});
      canvas.dataset.state=held?'held':reduced.matches?'static':'orbiting';if(!held&&!reduced.matches)wake();
    }
    function wake(){if(!frame&&visible&&!document.hidden&&!held&&button.closest('.world').dataset.world===document.documentElement.dataset.world)frame=requestAnimationFrame(draw);}
    function resize(){const width=button.getBoundingClientRect().width;if(!width)return;const size=Math.max(1,Math.round(Math.min(width*(devicePixelRatio||1),innerWidth<700?400:640)));if(canvas.width!==size){canvas.width=canvas.height=size;}wake();}
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){previous=0;resize();wake();}else if(frame){cancelAnimationFrame(frame);frame=0;}},{rootMargin:'0px'}).observe(canvas);
    new ResizeObserver(resize).observe(button);
    button.addEventListener('pointermove',event=>{if(!fine.matches||reduced.matches)return;const r=button.getBoundingClientRect();targetX=(event.clientX-r.left)/r.width-.5;targetY=(event.clientY-r.top)/r.height-.5;wake();});button.addEventListener('pointerleave',()=>{targetX=targetY=0;wake();});
    controllers.push({charge(value){charge=value?1:0;},hold(value){if(frame){cancelAnimationFrame(frame);frame=0;}if(!value)wake();},snapshot(){if(!button.closest('.world').classList.contains('is-live'))return;visible=true;resize();if(frame){cancelAnimationFrame(frame);frame=0;}draw(performance.now(),true);},wake});
    button.classList.add('has-planet');canvas.dataset.renderer='vector-2d';canvas.dataset.object=creator?'mothership':'blue-planet';canvas.dataset.orbiters='4';
  });
  }
  window.NurPlanet={
    prepare,
    charge(value){controllers.forEach(c=>c.charge(value));},hold(value){held=value;controllers.forEach(c=>c.hold(value));},snapshot(){controllers.forEach(c=>c.snapshot());},
    emblem(ink,world){
      const image=document.createElement('canvas');image.width=image.height=200;const source=image.getContext('2d');if(!source)return false;
      source.scale(200/640,200/640);scene(source,{creator:world==='creator'});
      const data=source.getImageData(0,0,200,200).data;ink.fillStyle='#f1efe7';
      for(let y=4;y<200;y+=5)for(let x=4;x<200;x+=5){const index=(y*200+x)*4;if(data[index+3]<120)continue;ink.fillStyle=world==='creator'&&data[index]>data[index+1]*1.3?'#ff753d':'#f1efe7';ink.beginPath();ink.arc(x+10,y-5,1.5,0,TAU);ink.fill();}return true;
    }
  };
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)controllers.forEach(c=>c.wake());});reduced.addEventListener('change',()=>{window.NurPlanet.snapshot();controllers.forEach(c=>c.wake());});
  prepare(document.documentElement.dataset.world);
})();
