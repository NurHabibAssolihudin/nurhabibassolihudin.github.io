/* One shared point field. The orb bends its structure; each world has its own flow.
   GPU point sprites keep the moving work proportional to dots, not viewport pixels. */
(function () {
  'use strict';
  const root=document.documentElement;
  const canvas=document.querySelector('.world-field');
  if(!canvas)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  let gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
  let context,program,buffer,uniforms,points=[],count=0,width=0,height=0,dpr=1;
  let frame=0,last=0,phase=0,held=false,lost=false,dirty=true,charged=false,disorder=0,targetDisorder=0;
  let geometry={orb:[0,0,200],heroBottom:0,quiet:[0,0],protect:new Float32Array(12)};
  const touches=[];
  const vertex=`precision highp float;
    attribute vec3 home;
    uniform vec2 viewport;
    uniform vec3 orb;
    uniform vec4 touch[6];
    uniform vec4 protect[3];
    uniform vec2 quiet;
    uniform float time,creator,disorder,dpr,heroBottom,light;
    varying vec4 ink;
    float gaussian(float x){return exp(-x*x);}
    void main(){
      vec2 origin=vec2(orb.x,max(-orb.z*.8,orb.y));
      vec2 q=(home.xy-origin)/orb.z;
      float r=length(q),angle=atan(q.y,q.x);
      vec2 radial=q/max(r,.02),tangent=vec2(-radial.y,radial.x);
      float envelope=gaussian((r-1.6)*.65);
      vec2 organised=vec2(sin(q.y*1.9+q.x*.3)*7.,sin(q.x*1.6)*13.);
      vec2 fluid=tangent*(sin(r*1.7-time*.16)*29.+sin(angle*3.+r*2.-time*.1)*16.);
      fluid+=vec2(sin(q.y*2.2+time*.12),cos(q.x*1.8-time*.14))*11.;
      vec2 p=home.xy+mix(organised,fluid,creator)*envelope;
      p+=radial*sin(r*3.2-time*.19)*9.*envelope;
      p+=vec2(sin(home.z*91.7),cos(home.z*73.1))*disorder*(16.+envelope*26.);
      float excitation=0.;
      for(int i=0;i<6;i++){
        vec2 delta=p-touch[i].xy;
        float energy=exp(-dot(delta,delta)/max(1.,touch[i].w*touch[i].w))*touch[i].z;
        excitation+=energy;
        p+=normalize(delta+vec2(.001)) * energy * 7.;
      }
      float ordered=pow(.5+.5*sin(q.y*12.+sin(q.x*1.8)*2.4+time*.12),12.);
      float flowing=pow(.5+.5*sin(angle*3.+r*7.8+sin(q.x*2.)-time*.23),8.);
      float stream=mix(ordered,flowing,creator);
      float mass=(.12+.50*envelope)*(.24+.76*stream);
      mass*=.55+.45*gaussian((q.x-.1)*.42);
      float hero=1.-step(heroBottom,p.y);
      float outside=(1.-hero)*.42+hero;
      float alpha=(.07+mass*1.05+excitation*.65)*outside;
      float work=smoothstep(quiet.x-35.,quiet.x+20.,p.y)*(1.-smoothstep(quiet.y-20.,quiet.y+35.,p.y));
      alpha*=1.-work*.82;
      for(int i=0;i<3;i++){
        vec4 box=protect[i];
        float mask=smoothstep(box.x-36.,box.x,p.x)*(1.-smoothstep(box.z,box.z+36.,p.x));
        mask*=smoothstep(box.y-24.,box.y,p.y)*(1.-smoothstep(box.w,box.w+24.,p.y));
        alpha*=1.-mask*.96;
      }
      // The artefact is the source, and remains the brightest solid in the scene.
      alpha*=smoothstep(.68,1.08,length((p-orb.xy)/orb.z));
      vec3 signal=mix(vec3(.27,.43,1.),vec3(1.,.26,.12),creator);
      vec3 base=mix(vec3(.42,.49,.64),vec3(.20,.26,.40),light*(1.-hero));
      vec3 color=mix(base,signal,min(1.,stream*.8+excitation*.75));
      ink=vec4(color,min(.72,alpha));
      gl_Position=vec4(p.x/viewport.x*2.-1.,1.-p.y/viewport.y*2.,0.,1.);
      gl_PointSize=(1.55+mass*2.6+min(1.,excitation)*.65)*dpr;
    }`;
  const fragment=`precision mediump float;varying vec4 ink;
    void main(){float dotAlpha=1.-smoothstep(.26,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(ink.rgb,ink.a*dotAlpha);}`;
  function setupGL(){
    const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    const position=gl.getAttribLocation(program,'home');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
    uniforms=Object.fromEntries(['viewport','orb','touch[0]','protect[0]','quiet','time','creator','disorder','dpr','heroBottom','light'].map(key=>[key,gl.getUniformLocation(program,key)]));
    gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  }
  if(gl){try{setupGL();canvas.dataset.renderer='webgl';}catch(error){gl=null;}}
  if(!gl){
    // A canvas that already acquired GL cannot acquire 2D, so replace it on failure.
    const replacement=canvas.cloneNode(false);
    canvas.replaceWith(replacement);
    // Compilation failures are unusual; the static renderer shares the same geometry.
    context=replacement.getContext('2d');
    if(!context)return;
    replacement.dataset.renderer='static';
  }
  const surface=gl?canvas:context.canvas;
  function measure(){
    const world=document.querySelector('.world.is-live')||document.querySelector('.world');
    const orb=world.querySelector('.core').getBoundingClientRect();
    const hero=world.querySelector('.hero').getBoundingClientRect();
    const work=world.querySelector('.work').getBoundingClientRect();
    geometry.orb=[orb.left+orb.width/2,orb.top+orb.height/2,Math.max(100,orb.width*.37)];
    geometry.heroBottom=hero.bottom;
    geometry.quiet=[work.top,work.bottom];
    ['.hero__h1','.hero__copy','.hero__corecap'].forEach((selector,index)=>{
      const box=world.querySelector(selector).getBoundingClientRect();
      geometry.protect.set([box.left-8,box.top-8,box.right+8,box.bottom+8],index*4);
    });
    surface.dataset.world=root.dataset.world;
    dirty=false;
  }
  function resize(){
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
    surface.width=Math.round(width*dpr);surface.height=Math.round(height*dpr);
    points=[];
    const pitch=width<700?15:16;
    for(let y=8,row=0;y<height+20;y+=pitch,row++)for(let x=8;x<width+20;x+=pitch){
      const seed=((x*13+y*37)%997)/997;
      points.push(x+(row%2)*pitch*.24,y,seed);
    }
    count=points.length/3;
    if(gl){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);}
    surface.dataset.points=String(count);dirty=true;wake();
  }
  function staticFrame(){
    const creator=root.dataset.world==='creator';
    const [cx,cy,radius]=geometry.orb;
    context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,width,height);
    for(let i=0;i<points.length;i+=3){
      const x=points[i],y=points[i+1],q=(x-cx)/radius,v=(y-cy)/radius;
      const distance=Math.hypot(q,v),angle=Math.atan2(v,q);
      const stream=Math.pow(.5+.5*Math.sin(creator?angle*3+distance*7.8:v*12+Math.sin(q*1.8)*2.4),8);
      let alpha=(.05+stream*.32)*Math.exp(-Math.pow((distance-1.6)*.65,2));
      if(y>geometry.heroBottom)alpha*=.30;
      if(y>geometry.quiet[0]&&y<geometry.quiet[1])alpha*=.18;
      for(let j=0;j<12;j+=4)if(x>geometry.protect[j]-20&&x<geometry.protect[j+2]+20&&y>geometry.protect[j+1]-20&&y<geometry.protect[j+3]+20)alpha*=.04;
      if(distance<1.)alpha=0;
      context.fillStyle=creator?`rgba(231,79,53,${alpha})`:`rgba(91,127,236,${alpha})`;
      context.beginPath();context.arc(x,y,.9+stream*.35,0,Math.PI*2);context.fill();
    }
  }
  function paint(now,force=false){
    if(lost||document.hidden)return;
    const elapsed=last?Math.min(now-last,80):42;last=now;
    if(dirty)measure();
    if(!gl){staticFrame();surface.dataset.state='static';return;}
    if(!held&&!reduced.matches){phase+=elapsed*.001;disorder+=(targetDisorder-disorder)*(1-Math.exp(-elapsed/260));}
    else if(force)disorder=targetDisorder;
    const touchData=new Float32Array(24);
    if(!reduced.matches&&!held)touches.forEach((point,index)=>{
      const age=(now-point.time)/1000;
      touchData.set([point.x,point.y,Math.max(0,1-age/1.1)*.75,24+age*35],index*4);
    });
    gl.useProgram(program);gl.viewport(0,0,surface.width,surface.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uniforms.viewport,width,height);gl.uniform3fv(uniforms.orb,geometry.orb);
    gl.uniform4fv(uniforms['touch[0]'],touchData);gl.uniform4fv(uniforms['protect[0]'],geometry.protect);
    gl.uniform2fv(uniforms.quiet,geometry.quiet);gl.uniform1f(uniforms.time,phase);
    gl.uniform1f(uniforms.creator,root.dataset.world==='creator'?1:0);gl.uniform1f(uniforms.disorder,disorder);
    gl.uniform1f(uniforms.dpr,dpr);gl.uniform1f(uniforms.heroBottom,geometry.heroBottom);
    gl.uniform1f(uniforms.light,root.dataset.theme==='light'?1:0);gl.drawArrays(gl.POINTS,0,count);
    surface.dataset.state=held?'held':reduced.matches?'static':charged?'charging':disorder>.02?'settling':'flowing';
  }
  function tick(now){frame=0;if(document.hidden||held||lost)return;if(now-last<1000/24){wake();return;}paint(now);if(gl&&!reduced.matches)wake();}
  function wake(){if(!frame&&!document.hidden&&!held&&!lost)frame=requestAnimationFrame(tick);}
  function snapshot(){dirty=true;paint(performance.now(),true);}
  function invalidate(){dirty=true;if(gl&&!reduced.matches)wake();else snapshot();}
  window.NurField={
    charge(value){charged=value;targetDisorder=value ? .65 : 0;if(!value)disorder=Math.max(disorder,.65);wake();},
    hold(value){held=value;if(frame){cancelAnimationFrame(frame);frame=0;}if(!value){last=0;dirty=true;wake();}},
    snapshot,
    sync(){dirty=true;snapshot();wake();}
  };
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('scroll',invalidate,{passive:true});
  window.addEventListener('pointermove',event=>{
    if(!fine.matches||reduced.matches||held)return;
    const now=performance.now();if(touches.length&&now-touches[0].time<32)return;
    touches.unshift({x:event.clientX,y:event.clientY,time:now});touches.length=Math.min(touches.length,6);wake();
  },{passive:true});
  new MutationObserver(invalidate).observe(root,{attributes:true,attributeFilter:['data-world','data-theme']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;surface.dataset.state='paused';}else{last=0;invalidate();}});
  reduced.addEventListener('change',()=>{touches.length=0;if(frame)cancelAnimationFrame(frame);frame=0;last=0;snapshot();wake();});
  if(gl)surface.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;if(frame)cancelAnimationFrame(frame);frame=0;surface.hidden=true;root.classList.remove('has-field');});
  root.classList.add('has-field');resize();snapshot();wake();
})();
