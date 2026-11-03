import {useEffect, useLayoutEffect, useRef, useState, type MouseEvent} from 'react';
import {animate} from 'motion/mini';
import {AnimatePresence, LayoutGroup, motion, useReducedMotion} from 'motion/react';
import {projects, workCopy, t, words, type Locale} from '../data/professional';
import {motionEase, motionTiming} from '../lib/motion-settings';

export default function WorkPicker({language}: {language: Locale}) {
 const [selected, setSelected] = useState(0), [ready, setReady] = useState(false);
 const [quietSelection, setQuietSelection] = useState(true);
 const reduce = useReducedMotion();
 const content = useRef<HTMLDivElement>(null), previous = useRef(0), intent = useRef(false);
 const previewAnimation = useRef<ReturnType<typeof animate> | null>(null);
 const chosen = projects[selected];
 useEffect(() => {
  function restore() {
   let saved = document.querySelector<HTMLElement>('.pro-experience')?.dataset.selectedProject;
   if (saved === undefined) { try { saved = sessionStorage.getItem('nur-selected-project') ?? undefined; } catch {} }
   const index = Number(saved);
   if (saved !== undefined && projects[index]) setSelected(index);
  }
  restore(); setReady(true); window.addEventListener('nur:project', restore);
  return () => window.removeEventListener('nur:project', restore);
 }, []);
 useEffect(() => {
  if (!ready) return;
  const picker = document.querySelector<HTMLElement>('.pro-project-picker'), button = picker?.querySelectorAll<HTMLElement>('button')[selected];
  if (picker && button && picker.scrollWidth > picker.clientWidth) picker.scrollTo({left:button.offsetLeft-picker.offsetLeft,behavior:'instant'});
 }, [selected, ready]);
 useLayoutEffect(() => {
  const element = content.current, from = previous.current;
  previous.current = selected;
  if (!element || from === selected || !intent.current) return;
  intent.current = false;
  const running = previewAnimation.current;
  running?.stop();
  if (reduce || quietSelection || typeof element.animate !== 'function') { previewAnimation.current = null; element.style.removeProperty('clip-path'); return; }
  // Install the mask before paint so new content cannot flash before the wipe.
  // Sine easing keeps the sweep visible instead of spending most time on its tail.
  // Rapid choices continue the current reveal instead of restarting a hidden panel.
  if (!running) element.style.clipPath = selected > from ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)';
  const animation = animate(element, {clipPath: 'inset(0% 0% 0% 0%)'}, {duration: motionTiming.project.preview, ease: motionEase('--ease-preview')});
  previewAnimation.current = animation;
  animation.finished.then(() => {
   if (previewAnimation.current === animation) { element.style.removeProperty('clip-path'); previewAnimation.current = null; }
  });
 }, [selected, reduce, quietSelection]);
 useEffect(() => () => previewAnimation.current?.stop(), []);
 function selectProject(index: number, event: MouseEvent<HTMLButtonElement>) {
  if (index === selected) return;
  intent.current = true;
  setQuietSelection(event.detail === 0);
  setSelected(index);
  const parent = document.querySelector<HTMLElement>('.pro-experience');
  if (parent) parent.dataset.selectedProject = String(index);
  try {sessionStorage.setItem('nur-selected-project',String(index));} catch {}
 }
 return <div className="pro-work__island" data-picker-ready={ready}><div className="pro-work__background" aria-hidden="true"><AnimatePresence initial={false}><motion.div className="pro-work__layer" key={chosen.id} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: quietSelection ? 0 : reduce ? .12 : motionTiming.project.background, ease: motionEase('--ease-preview')}}>{chosen.image ? <img src={chosen.image} alt="" width={1360} height={860} loading="lazy" decoding="async" /> : <span className="pro-work__word">{chosen.name}</span>}</motion.div></AnimatePresence></div><div className="pro-content">        <div className="pro-work__front"><div className="pro-work__heading"><h2 className="pro-title" id="work-title" tabIndex={-1}>{t(words.work, language)}</h2><p>{t(workCopy.instruction, language)}</p></div>
          <LayoutGroup id="professional-work"><motion.div layoutScroll className="pro-project-picker" role="group" aria-label={t(workCopy.select, language)}>{projects.map((project, index) => <button type="button" key={project.id} aria-controls="work-preview" aria-pressed={selected === index} onClick={event => selectProject(index, event)} className="pro-project-option">{selected === index && <motion.span className="pro-project-option__surface" layoutId="selected-project" aria-hidden="true" transition={quietSelection || reduce ? {duration: 0} : {type: 'spring', duration: motionTiming.project.selection, bounce: 0}} />}<span className="pro-option__name">{project.name}</span><span className="pro-option__kind">{t(project.kind, language)}</span></button>)}</motion.div></LayoutGroup>
          <div className="pro-nojs">{projects.map(project => <a className="pro-link" href={'#' + project.id} key={project.id}>{project.name}</a>)}</div>
          <article id="work-preview" className="pro-project-selection" aria-labelledby="work-preview-title" aria-live="polite" aria-atomic="true"><div className="pro-preview__content" ref={content}><h3 id="work-preview-title">{chosen.name}</h3><p className="pro-project-kind">{t(words.personal, language)}</p><p className="pro-body">{t(chosen.summary, language)}</p><a href={'#' + chosen.id} className="pro-button">{t(words.detail, language)}</a></div></article>
        </div>
      </div></div>;
}
