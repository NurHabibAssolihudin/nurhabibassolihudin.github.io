import {useEffect, useState} from 'react';
import {projects, t, words, type Locale} from '../data/professional';

export default function WorkPicker({language}: {language: Locale}) {
 const id = language === 'id';
 const [selected, setSelected] = useState(0), [ready, setReady] = useState(false);
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
 function selectProject(index: number) {
  setSelected(index);
  const parent = document.querySelector<HTMLElement>('.pro-experience');
  if (parent) parent.dataset.selectedProject = String(index);
  try {sessionStorage.setItem('nur-selected-project',String(index));} catch {}
 }
 return <div className="pro-work__island" data-picker-ready={ready}><div className="pro-work__background" aria-hidden="true">{chosen.image ? <img key={chosen.id} src={chosen.image} alt="" width={1360} height={860} loading="lazy" decoding="async" /> : <span className="pro-work__word">{chosen.name}</span>}</div><div className="pro-content">        <div className="pro-work__front"><div className="pro-work__heading"><h2 className="pro-title" id="work-title" tabIndex={-1}>{t(words.work, language)}</h2><p>{id ? 'Pilih pekerjaan, lalu lihat ceritanya.' : 'Choose a project, then explore its story.'}</p></div>
          <div className="pro-project-picker" role="group" aria-label={id ? 'Pilih pekerjaan' : 'Select a project'}>{projects.map((project, index) => <button type="button" key={project.id} aria-pressed={selected === index} onClick={() => selectProject(index)} className="pro-project-option"><span>{project.name}</span><span className="pro-option__kind">{t(project.kind, language)}</span><span aria-hidden="true">↗</span></button>)}</div>
          <div className="pro-nojs">{projects.map(project => <a className="pro-link" href={'#' + project.id} key={project.id}>{project.name} ↗</a>)}</div>
          <div className="pro-project-selection" aria-live="polite" aria-atomic="true"><h3>{chosen.name}</h3><p className="pro-overline">{t(words.personal, language)}</p><p className="pro-body">{t(chosen.summary, language)}</p><a href={'#' + chosen.id} className="pro-button">{t(words.detail, language)}<span aria-hidden="true">↗</span></a></div>
        </div>
      </div></div>;
}
