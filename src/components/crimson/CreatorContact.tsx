import {sendContact,resumeContact} from '../../lib/contact-transport';
import {useEffect,useRef,useState,type SubmitEvent} from 'react';
import {AnimatePresence,motion,useInView} from 'motion/react';
import Confrontation from './Confrontation';
import type {Locale} from '../../data/professional';

const email='nurhabibassolihudin12@gmail.com';
export default function CreatorContact({language,endpoint,still,active}:{language:Locale;endpoint:string;still:boolean;active:boolean}){
  const id=language==='id';
  const ref=useRef<HTMLElement>(null),form=useRef<HTMLFormElement>(null),busy=useRef(false),abort=useRef<AbortController|null>(null),alive=useRef(true);
  const onscreen=useInView(ref,{amount:.15});
  const [shot,setShot]=useState(0),[state,setState]=useState<'idle'|'sending'|'sent'|'error'|'draft'>('idle'),[draft,setDraft]=useState('');
  const [ready,setReady]=useState(false);
  useEffect(()=>{alive.current=true;setReady(true);return()=>{alive.current=false;abort.current?.abort();};},[]);
  useEffect(()=>{const resume=()=>{busy.current=false;if(!endpoint||!form.current)return;setState('idle');void resumeContact(form.current,endpoint).then(result=>{if(alive.current&&result)setState(result==='accepted'?'sent':'error');});};resume();const show=(event:PageTransitionEvent)=>{if(event.persisted)resume();};window.addEventListener('pageshow',show);return()=>window.removeEventListener('pageshow',show);},[endpoint]);
  async function submit(event:SubmitEvent<HTMLFormElement>){
    event.preventDefault();if(busy.current||!form.current?.reportValidity())return;
    const node=form.current,fields=new FormData(node);
    if(fields.get('website'))return;
    const snapshot={name:String(fields.get('name')??''),email:String(fields.get('email')??''),message:String(fields.get('message')??'')};
    busy.current=true;setShot(value=>value+1);setState('sending');
    const start=performance.now();
    let outcome:'sent'|'error'|'draft'='draft';
    if(endpoint){
      const controller=new AbortController();abort.current=controller;

      try{
        const result=await sendContact(node,endpoint,{...snapshot,website:'',language},controller.signal);
        if(result.navigating)return;
        outcome=result.ok?'sent':'error';
      }catch{outcome='error';}finally{abort.current=null;}
    }else{
      setDraft(`mailto:${email}?subject=${encodeURIComponent('Crimson Violet — '+snapshot.name)}&body=${encodeURIComponent(`${snapshot.message}\n\n${snapshot.name}\n${snapshot.email}`)}`);
    }
    // Transport starts immediately; the graphic never claims inbox delivery.
    const remaining=still?0:Math.max(0,1100-(performance.now()-start));
    if(remaining)await new Promise(resolve=>setTimeout(resolve,remaining));
    busy.current=false;if(!alive.current)return;
    if(outcome==='sent'&&Object.entries(snapshot).every(([name,value])=>new FormData(node).get(name)===value))node.reset();
    setState(outcome);
  }
  return <section id="play" className="cv-contact" ref={ref} aria-labelledby="cv-contact-title" data-contact-state={state} data-shot={shot}>
    <Confrontation shot={shot} still={still||!active||!onscreen} active={active&&onscreen}/>
    <div className="cv-contact-shade" aria-hidden="true"/>
    <div className="cv-contact-layout cv-wrap">
      <div className="cv-contact-intro"><h2 id="cv-contact-title">{id?'Bicara.':'Say it.'}<br/><em>{id?'Aku dengar.':"I'm listening."}</em></h2><p>{id?'Ada game, cerita, atau ide yang ingin kamu bicarakan?':'A game, a story, or an idea you want to talk about?'}</p></div>
      <motion.div className="cv-message" initial={false} animate={shot&&!still?{transform:['translateX(0px)','translateX(-5px)','translateX(4px)','translateX(0px)']}:{transform:'none'}} transition={shot&&!still?{duration:.42,times:[0,.2,.4,1]}:{duration:0}}>
        <form ref={form} onSubmit={submit} data-creator-form aria-labelledby="cv-contact-title" aria-busy={state==='sending'||undefined}>
          <label htmlFor="cv-name">{id?'Siapa yang menghubungi?':"Who's on the other side?"}<input id="cv-name" name="name" autoComplete="name" required maxLength={100}/></label>
          <label htmlFor="cv-email">{id?'Ke mana saya membalas?':'Where can I reply?'}<input id="cv-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
          <label htmlFor="cv-message">{id?'Apa ceritamu?':"What's your story?"}<textarea id="cv-message" name="message" rows={4} required maxLength={5000}/></label>
          <label className="cv-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
          <motion.button type="submit" className="cv-fire" disabled={!ready||state==='sending'} whileTap={still?undefined:{scale:.97}}>
            <AnimatePresence mode="wait" initial={false}><motion.span key={state==='sending'?'sending':'ready'} initial={still?false:{opacity:0,transform:'translateY(8px)'}} animate={{opacity:1,transform:'translateY(0px)'}} exit={{opacity:0}} transition={{duration:.18}}>{state==='sending'?(endpoint?(id?'Mengirim…':'Sending…'):(id?'Menyiapkan…':'Preparing…')):(endpoint?(id?'Lepaskan pesan':'Fire message'):(id?'Siapkan pesan':'Prepare message'))}</motion.span></AnimatePresence>
            <span className="cv-trigger-mark" aria-hidden="true">＋</span>
          </motion.button>
          <p className="cv-delivery-note">{!endpoint&&(id?'Pesan dibuka sebagai draf di aplikasi emailmu.':'Your message opens as a draft in your email app.')}</p>
          <div role="status" aria-live="polite" className="cv-send-status">
            {state==='sent'&&(id?'Pesan sudah diterima layanan pengiriman. Terima kasih.':'The delivery service has accepted your message. Thank you.')}
            {state==='error'&&(id?'Pengiriman belum berhasil. Pesanmu tetap tersimpan di sini.':'The message could not be sent. Your draft is still here.')}
            {state==='draft'&&<a href={draft}>{id?'Buka draf email':'Open email draft'}</a>}
          </div>
        </form>
      </motion.div>
      <div className="cv-contact-links"><a href={`mailto:${email}`}>{email}</a><a href="https://github.com/NurHabibAssolihudin" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/nurhabib-assolihudin" target="_blank" rel="noreferrer">LinkedIn</a></div>
    </div>
    {shot>0&&<motion.svg key={`impact-${shot}`} className="cv-impact" viewBox="0 0 300 300" aria-hidden="true" initial={{opacity:0}} animate={still?{opacity:0}:{opacity:[0,.8,.35,0]}} transition={{duration:1.1,times:[0,.2,.65,1]}}><circle cx="150" cy="150" r="12" fill="#090b12"/><g stroke="#dd947b" strokeWidth="1" fill="none"><path d="m150 150-48-64-14-65m62 129 69-48 44-7m-113 55 30 74-9 58m-21-132-79 31-41-14m120-17 56 34 18 56m-74-90 4-95 33-39"/><path d="m102 86-35 4m152 12-2-32m-37 154 36-12m-145-31-11 33"/></g></motion.svg>}
  </section>;
}
