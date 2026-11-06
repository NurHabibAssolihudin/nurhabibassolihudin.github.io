import {useEffect,useRef,useState,type ReactNode} from 'react';
import {AnimatePresence,MotionConfig,motion,useInView} from 'motion/react';
import BlurText from '../react-bits/BlurText';
import ScrollVelocity from '../react-bits/ScrollVelocity';
import GameArtwork from './GameArtwork';
import CreatorContact from './CreatorContact';
import {creatorCopy as copy} from '../../data/creator';
import {t,type Copy,type Locale} from '../../data/professional';
import {useReducedMotionPreference} from '../../lib/use-reduced-motion';
import {useCreatorActivity} from './useCreatorActivity';

interface Game {name:Copy;meta:Copy;body:Copy;stack:Copy;crest:Copy}
export default function CreatorExperience({language,games,endpoint,portal}:{language:Locale;games:Game[];endpoint:string;portal?:ReactNode}){
  const id=language==='id',reduce=useReducedMotionPreference(),{active,fine}=useCreatorActivity();
  const marquee=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),source=useRef<HTMLButtonElement|null>(null);
  const marqueeVisible=useInView(marquee,{amount:.05});
  const [selected,setSelected]=useState<number|null>(null),[reader,setReader]=useState(false),[step,setStep]=useState(0);
  function openGame(index:number,button:HTMLButtonElement){source.current=button;setSelected(index);setReader(true);}
  function finishClose(){dialog.current?.close();setSelected(null);source.current?.focus({preventScroll:true});}
  useEffect(()=>{if(selected!==null&&!dialog.current?.open)dialog.current?.showModal();},[selected]);
  useEffect(()=>{if(!active&&dialog.current?.open){dialog.current.close();setSelected(null);setReader(false);}},[active]);
  const enter={opacity:0,transform:'translateY(42px)'};
  const entered={opacity:1,transform:'translateY(0px)'};
  return <MotionConfig reducedMotion={reduce?'always':'never'}><div className="cv-root" data-crimson-experience>
    <section className="hero cv-hero" id="ctop" aria-labelledby="cv-title"><div className="cv-hero-grid hero__grid cv-wrap">
      <div className="cv-hero-top"><p>{id?'Game. Cerita. Kemungkinan lain.':'Games. Stories. Other possibilities.'}</p><span>{id?'Ruang bermain independen':'An independent play space'}</span></div>
      <h1 id="cv-title" className="cv-sr">Crimson Violet — {id?'game dan cerita interaktif':'games and interactive stories'}</h1>
      <div className="cv-wordmark" aria-hidden="true"><BlurText text="CRIMSON" animateBy="letters" delay={45} blur={5} distance={30} stepDuration={.44} className="cv-crimson"/><BlurText text="VIOLET" animateBy="letters" delay={55} blur={5} distance={30} stepDuration={.44} className="cv-violet"/></div>
      <div className="cv-portal">{portal}</div>
      <div className="cv-hero-bottom"><p>{id?'Aku membuat game dan cerita interaktif. Kadang mulai dari satu mekanik. Kadang dari adegan yang susah dilupakan.':'I make games and interactive stories. Sometimes it starts with one mechanic. Sometimes with a scene that stays with you.'}</p><a className="cv-link" href="#worlds">{id?'Lihat karya':'See the work'}<span aria-hidden="true">↘</span></a></div>
      <div className="cv-orbit-rule" aria-hidden="true"/>
    </div></section>
    <div className="cv-marquee" ref={marquee} aria-hidden="true" data-paused={!active||!marqueeVisible||reduce}><ScrollVelocity texts={[games.slice(0,2).map(game=>t(game.name,language).toUpperCase()).join(' / ')+' /',t(games[2].name,language).toUpperCase()+' /']} velocity={38} fontWeight={800} fontSize="clamp(38px,8vw,120px)" gap={38} numCopies={4} paused={!active||!marqueeVisible||reduce} skewWithVelocity={7} outlineAlternate={true}/></div>
    <section id="worlds" className="cv-work cv-wrap" aria-labelledby="cv-work-title">
      <div className="cv-section-head"><h2 id="cv-work-title">{id?'Pilih adeganmu.':'Pick your scene.'}</h2><p>{t(copy.work.lead,language)}</p></div>
      <div className="cv-poster-wall">{games.map((game,index)=><motion.button key={index} className={`cv-poster cv-poster--${index}`} aria-label={`${t(game.name,language)}: ${id?'buka catatan proyek':'open project notes'}`} aria-haspopup="dialog" onClick={event=>openGame(index,event.currentTarget)} initial={enter} whileInView={entered} viewport={{once:true,amount:.15}} whileHover={fine&&!reduce?{transform:'translateY(-14px)',transition:{duration:.32,delay:0}}:undefined} whileTap={reduce?undefined:{transform:'translateY(0px) scale(.985)',transition:{duration:.12,delay:0}}} transition={{duration:reduce?0:.88,delay:reduce?0:index*.1,ease:[.37,0,.63,1]}}>
        <div className="cv-poster-art"><GameArtwork index={index} seed={`cv-poster-${index}`}/><span className="cv-concept-label">{id?'Studi visual':'Visual study'}</span></div>
        <div className="cv-poster-copy"><p>{t(game.meta,language)}</p><h3>{t(game.name,language)}</h3><p className="cv-poster-summary">{t(game.body,language)}</p><span className="cv-poster-open">{id?'Catatan proyek':'Project notes'}<span aria-hidden="true">＋</span></span></div>
      </motion.button>)}</div>
    </section>
    <section id="craft" className="cv-craft" aria-labelledby="cv-craft-title"><div className="cv-wrap cv-craft-grid">
      <div><h2 id="cv-craft-title">{id?'Di balik':'Behind'}<br/><em>{id?'adegan.':'the scenes.'}</em></h2><p>{t(copy.process.lead,language)}</p></div>
      <div className="cv-cut-board"><div className="cv-cut-shape" aria-hidden="true">{[0,1,2].map(index=><motion.span key={index} animate={{transform:`translate(${(index-1)*(step===1?64:42)}px,${step===2?(index-1)*28:0}px) rotate(${(index-1)*18+step*45}deg)`}} transition={{type:'spring',stiffness:110,damping:22}}/>)}</div>
        <div className="cv-step-tabs" role="tablist" aria-label={id?'Proses kreatif':'Creative process'}>{copy.process.steps.map((item,index)=><button key={index} type="button" role="tab" id={`cv-step-${index}`} aria-selected={step===index} aria-controls="cv-step-panel" tabIndex={step===index?0:-1} onClick={()=>setStep(index)} onKeyDown={event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;setStep(next);document.getElementById(`cv-step-${next}`)?.focus();}}}>{step===index&&<motion.span layoutId="cv-step-marker" className="cv-step-marker" transition={{duration:.28}}/>}<span>{t(item.title,language)}</span></button>)}</div>
        <div id="cv-step-panel" role="tabpanel" aria-labelledby={`cv-step-${step}`}><AnimatePresence mode="wait" initial={false}><motion.p key={step} initial={reduce?false:{opacity:0,transform:'translateY(12px)'}} animate={{opacity:1,transform:'translateY(0px)'}} exit={{opacity:0}} transition={{duration:.3}}>{t(copy.process.steps[step].body,language)}</motion.p></AnimatePresence></div>
      </div>
    </div></section>
    <section id="tools" className="cv-tools cv-wrap" aria-labelledby="cv-tools-title"><h2 id="cv-tools-title">{id?'Bahan':'The raw'}<br/><em>{id?'bakunya.':'materials.'}</em></h2><dl>{copy.tools.rows.filter(row=>row.term.en!=='Studio').map((row,index)=><motion.div key={index} initial={enter} whileInView={entered} viewport={{once:true,amount:.2}} transition={{duration:reduce?0:.8,delay:index*.07,ease:[.37,0,.63,1]}}><dt>{t(row.term,language)}</dt><dd>{t(row.value,language)}</dd></motion.div>)}</dl></section>
    <CreatorContact language={language} endpoint={endpoint} still={reduce} active={active}/>
    <div className="cv-end"><span>CRIMSON VIOLET</span><small>© NurHabib</small><a href="#ctop">{id?'Kembali ke atas':'Back to top'}</a></div>
    <dialog ref={dialog} className="cv-dialog" aria-labelledby="cv-game-title" onCancel={event=>{event.preventDefault();setReader(false);}} onClick={event=>{if(event.target===event.currentTarget)setReader(false);}}>
      <AnimatePresence onExitComplete={finishClose}>{reader&&selected!==null&&<motion.div className="cv-game-reader" key={selected} initial={reduce?false:{opacity:0,transform:'translateY(50px) scale(.97)'}} animate={{opacity:1,transform:'translateY(0px) scale(1)'}} exit={{opacity:0,transform:reduce?'none':'translateY(24px) scale(.98)'}} transition={{duration:reduce?.12:.58,ease:[.37,0,.63,1]}}>
        <button type="button" className="cv-close" autoFocus onClick={()=>setReader(false)}>{id?'Tutup catatan':'Close notes'}<span aria-hidden="true">×</span></button>
        <div className="cv-reader-art"><GameArtwork index={selected} seed="cv-reader"/><span className="cv-concept-label">{id?'Artwork konsep orisinal, bukan screenshot game':'Original concept artwork, not a game screenshot'}</span></div>
        <div className="cv-reader-copy">{/* taste-skill-ignore: actual project status and technology metadata, not a decorative label. */}<p className="cv-kicker">{t(games[selected].meta,language)}</p><h2 id="cv-game-title">{t(games[selected].name,language)}</h2><p>{t(games[selected].body,language)}</p><p className="cv-reader-stack">{t(games[selected].stack,language)}</p><a href="#play" onClick={()=>{dialog.current?.close();setReader(false);setSelected(null);}}>{id?'Bicara tentang proyek ini':'Talk about this project'}</a></div>
      </motion.div>}</AnimatePresence>
    </dialog>
  </div></MotionConfig>;
}
