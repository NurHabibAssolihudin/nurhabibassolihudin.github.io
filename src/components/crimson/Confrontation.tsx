import {motion,useMotionValue,useSpring,useTransform} from 'motion/react';
import {useEffect,useRef} from 'react';

/** Original cinematic vector scene. No movie clip or third-party character asset. */
export default function Confrontation({shot,still,active}:{shot:number;still:boolean;active:boolean}){
  const ref=useRef<HTMLDivElement>(null);
  const targetX=useMotionValue(0),targetY=useMotionValue(0);
  const x=useSpring(targetX,{stiffness:70,damping:24}),y=useSpring(targetY,{stiffness:70,damping:24});
  const transform=useTransform([x,y],([a,b])=>`perspective(1100px) rotateY(${a}deg) rotateX(${b}deg)`);
  useEffect(()=>{
    const section=ref.current?.closest('section');if(!section||still)return;
    const aim=(event:PointerEvent)=>{if(event.pointerType!=='mouse')return;const r=section.getBoundingClientRect();targetX.set((event.clientX-r.left-r.width/2)/r.width*8);targetY.set(-(event.clientY-r.top-r.height/2)/r.height*5);};
    const reset=()=>{targetX.set(0);targetY.set(0);};
    section.addEventListener('pointermove',aim,{passive:true});section.addEventListener('pointerleave',reset);
    return()=>{section.removeEventListener('pointermove',aim);section.removeEventListener('pointerleave',reset);reset();};
  },[still,targetX,targetY]);
  return <div className="cv-confrontation" ref={ref} aria-hidden="true">
    <div className="cv-scene-rain"/>
    <motion.div className="cv-gun-camera" style={{transform:still?'none':transform}}>
      <motion.div className="cv-scene-breath" animate={{transform:active&&!still?['translateY(0px)','translateY(-8px)','translateY(0px)']:'none'}} transition={active&&!still?{duration:6,repeat:Infinity,ease:'easeInOut'}:{duration:0}}>
      <motion.svg viewBox="0 0 1000 800" className="cv-gun-scene" key={shot} initial={shot&&!still?{transform:'translateY(0px) rotate(0deg)'}:false} animate={shot&&!still?{transform:['translateY(0px) rotate(0deg)','translateY(40px) rotate(6deg)','translateY(0px) rotate(0deg)']}:{transform:'none'}} transition={shot&&!still?{duration:.95,times:[0,.18,1],ease:[.37,0,.63,1]}:{duration:0}}>
        <defs>
          <linearGradient id="cv-coat" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#262235"/><stop offset=".6" stopColor="#0b0d15"/><stop offset="1" stopColor="#572336"/></linearGradient>
          <linearGradient id="cv-steel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b5a4ad"/><stop offset=".22" stopColor="#514451"/><stop offset=".5" stopColor="#171822"/><stop offset=".78" stopColor="#806175"/><stop offset="1" stopColor="#262330"/></linearGradient>
          <radialGradient id="cv-barrel"><stop stopColor="#030407"/><stop offset=".7" stopColor="#08080e"/><stop offset=".72" stopColor="#5e4d5c"/><stop offset=".9" stopColor="#25222c"/><stop offset="1" stopColor="#af8f96"/></radialGradient>
          <linearGradient id="cv-glove"><stop stopColor="#4d3b49"/><stop offset=".5" stopColor="#191720"/><stop offset="1" stopColor="#070a12"/></linearGradient>
        </defs>
        <path d="M650 800q-90-160-165-262l-3-200q-10-201 134-213 147-8 172 167l33 209q94 132 160 299Z" fill="url(#cv-coat)"/>
        <path d="M495 358q-8-201 118-207 99 2 151 155l-56 65-95-17-92 36Z" fill="#11121d"/>
        <path d="m558 281 58-21 79 23-46 67-63-8Z" fill="#382738"/>
        <path d="m565 294 39-5m38-1 35 9" stroke="#cc6373" strokeWidth="4"/><path d="m614 309 10 27-20 4" fill="none" stroke="#856074" strokeWidth="2"/>
        <path d="m527 390 81 128 119-128-54 179 52 231H488l49-218Z" fill="#171721"/>
        <path d="m640 559 216 241H537l-95-185Z" fill="#3a2635"/>
        <path d="m746 630 149 170H691l-98-123Z" fill="#14151f"/>
        <path d="m507 467 115 48 53 150-77 63-83-114-76-87Z" fill="url(#cv-glove)" stroke="#6a4d60" strokeWidth="2"/>
        <path d="m528 502 33 76m-8-83 34 77m-5-76 35 66" stroke="#100e17" strokeWidth="8"/>
        <path d="m399 324 120-63 218 225-38 148-96 48-82-187-108-64Z" fill="#171722" stroke="#7d6675" strokeWidth="2"/>
        <path d="m399 324 120-63 218 225-125 30Z" fill="url(#cv-steel)"/>
        <path d="m405 328 93-40 181 206-66 15Z" fill="#695361"/>
        <path d="m421 321 71-25 4-23-55 19Z" fill="#181823"/>
        <path d="m613 516 82-19 9 64-73 18Z" fill="#403344"/>
        <path d="m636 584 62-14 31 73-77 35Z" fill="#090d15"/>
        <path d="m527 464 29 42-8 62 57 47 35-30-33-57" fill="none" stroke="#a48694" strokeWidth="10"/>
        <ellipse cx="427" cy="351" rx="73" ry="86" transform="rotate(-22 427 351)" fill="url(#cv-steel)"/>
        <ellipse cx="426" cy="350" rx="50" ry="62" transform="rotate(-22 426 350)" fill="url(#cv-barrel)"/>
        <ellipse cx="427" cy="350" rx="28" ry="38" transform="rotate(-22 427 350)" fill="#030408"/>
        <path d="m622 476 20-26m-6 40 20-26m-5 40 20-26m-6 40 20-26" stroke="#c095a0" strokeWidth="3"/>
        <path d="M774 794 644 695m117 99-128-86" stroke="#79364c" strokeWidth="2"/>
        {shot>0&&<motion.g key={`flash-${shot}`} initial={{opacity:0}} animate={still?{opacity:0}:{opacity:[0,.85,0]}} transition={{duration:.32,times:[0,.35,1]}}><path d="m427 350-170-36 112 66-44 160 108-100 149 85-87-145 110-110-153 36-60-167Z" fill="#f6c478"/><circle cx="427" cy="350" r="50" fill="#ead7aa"/></motion.g>}
      </motion.svg>
      </motion.div>
    </motion.div>
    <motion.div className="cv-scene-light" animate={{opacity:active&&!still?[.18,.28,.18]:.2}} transition={{duration:7,repeat:active&&!still?Infinity:0,ease:'easeInOut'}}/>
  </div>;
}
