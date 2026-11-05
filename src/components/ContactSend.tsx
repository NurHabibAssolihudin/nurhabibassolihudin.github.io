import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {sections,t,type Locale} from '../data/professional';

type State = 'idle'|'sending'|'sent'|'error';
/** Adapted from Motion's free AnimatePresence modes example; native form semantics stay intact. */
export default function ContactSend({language,available}:{language:Locale;available:boolean}) {
  const ref=useRef<HTMLButtonElement>(null);
  const [ready,setReady]=useState(false),[state,setState]=useState<State>('idle'),[quiet,setQuiet]=useState(false);
  const reduce=useReducedMotion();
  useEffect(()=>{
    const form=ref.current?.closest('form');if(!form)return;
    const change=(event:Event)=>{const detail=(event as CustomEvent).detail;setState(detail.state);setQuiet(detail.quiet);};
    const edit=()=>setState(value=>value==='sent'?'idle':value);
    form.addEventListener('nur:contact-state',change);form.addEventListener('input',edit);setReady(true);
    return()=>{form.removeEventListener('nur:contact-state',change);form.removeEventListener('input',edit);};
  },[]);
  const copy=sections.contact;
  const key=state==='error'?'idle':state;
  const label=key==='sending'?t(copy.sending,language):key==='sent'?(language==='id'?'Terkirim':'Sent'):t(copy.send,language);
  const still=reduce||quiet;
  return <motion.button ref={ref} className="pro-button contact-form__send" type="submit" aria-label={label} disabled={!ready||!available||state==='sending'} whileTap={still?undefined:{scale:.97}}>
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span className="contact-send__state" key={key} aria-hidden="true" initial={still?false:{opacity:0,transform:'translateY(16px)'}} animate={{opacity:1,transform:'translateY(0px)'}} exit={still?{opacity:0}:{opacity:0,transform:'translateY(-16px)'}} transition={still?{duration:0}:{type:'spring',stiffness:340,damping:30}}>
        <span className="contact-send__icon">
          {key==='sent'?<motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><motion.path d="M5 12.5 9.5 17 19 7" initial={{pathLength:still?1:0}} animate={{pathLength:1}} transition={{duration:still?0:.3}} /></motion.svg>:
          key==='sending'?<motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" animate={still?undefined:{rotate:360}} transition={{duration:1.1,repeat:Infinity,ease:'linear'}}><path d="M20 12a8 8 0 1 1-8-8" /></motion.svg>:
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="m3 10 18-7-7 18-4-7-7-4Z M10 14 21 3" /></svg>}
        </span><span>{label}</span>
      </motion.span>
    </AnimatePresence>
  </motion.button>;
}
