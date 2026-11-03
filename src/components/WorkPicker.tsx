import {useEffect, useLayoutEffect, useRef, useState, type MouseEvent} from 'react';
import {animate} from 'motion/mini';
import {AnimatePresence, LayoutGroup, LazyMotion, MotionConfig} from 'motion/react';
import * as m from 'motion/react-m';
import type {PickerProject} from '../data/project-types';
import {prepareProjectImage} from '../lib/project-images';
import {workCopy, t, words, type Locale} from '../data/professional';
import {motionEase, motionTiming} from '../lib/motion-settings';
import {useReducedMotionPreference} from '../lib/use-reduced-motion';

const loadFeatures = () => import('../lib/motion-features').then((module) => module.default);

export default function WorkPicker({
  language,
  projects
}: {
  language: Locale;
  projects: PickerProject[];
}) {
  const [selected, setSelected] = useState(0),
    [ready, setReady] = useState(false);
  const [quietSelection, setQuietSelection] = useState(true);
  const reduce = useReducedMotionPreference();
  const content = useRef<HTMLDivElement>(null),
    previous = useRef(0),
    intent = useRef(false);
  const previewAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const chosen = projects[selected];
  const [background, setBackground] = useState({project: projects[0], painted: true});
  useEffect(() => {
    if (!ready) return;
    let current = true;
    prepareProjectImage(chosen).then((painted) => {
      if (current) setBackground({project: chosen, painted});
    });
    return () => {
      current = false;
    };
  }, [chosen, ready]);
  useEffect(() => {
    function restore() {
      let saved = document.querySelector<HTMLElement>('.pro-experience')?.dataset.selectedProject;
      if (saved === undefined) {
        try {
          saved = sessionStorage.getItem('nur-selected-project') ?? undefined;
        } catch {}
      }
      const index = Number(saved);
      if (saved !== undefined && projects[index]) {
        intent.current = false;
        setQuietSelection(true);
        setSelected(index);
      }
    }
    restore();
    setReady(true);
    window.addEventListener('nur:project', restore);
    return () => window.removeEventListener('nur:project', restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const picker = document.querySelector<HTMLElement>('.pro-project-picker'),
      button = picker?.querySelectorAll<HTMLElement>('button')[selected];
    if (picker && button && picker.scrollWidth > picker.clientWidth)
      picker.scrollTo({left: button.offsetLeft - picker.offsetLeft, behavior: 'instant'});
  }, [selected, ready]);
  useLayoutEffect(() => {
    const element = content.current,
      from = previous.current;
    const deliberate = intent.current && from !== selected;
    previous.current = selected;
    intent.current = false;
    if (!element) return;
    const running = previewAnimation.current;
    if (reduce || quietSelection || !deliberate || typeof element.animate !== 'function') {
      previewAnimation.current = null;
      running?.cancel();
      element.style.removeProperty('clip-path');
      return;
    }
    if (running) {
      const clip = getComputedStyle(element).clipPath;
      running.cancel();
      element.style.clipPath = clip;
    }
    // Install the mask before paint so new content cannot flash before the wipe.
    // Sine easing keeps the sweep visible instead of spending most time on its tail.
    // Rapid choices continue the current reveal instead of restarting a hidden panel.
    if (!running)
      element.style.clipPath = selected > from ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)';
    const animation = animate(
      element,
      {clipPath: 'inset(0% 0% 0% 0%)'},
      {duration: motionTiming.project.preview, ease: motionEase('--ease-preview')}
    );
    previewAnimation.current = animation;
    void animation.finished.then(
      () => {
        if (previewAnimation.current === animation) {
          element.style.removeProperty('clip-path');
          previewAnimation.current = null;
        }
      },
      () => {
        if (previewAnimation.current === animation) {
          element.style.removeProperty('clip-path');
          previewAnimation.current = null;
        }
      }
    );
  }, [selected, reduce, quietSelection]);
  useEffect(
    () => () => {
      previewAnimation.current?.cancel();
      previewAnimation.current = null;
    },
    []
  );
  function selectProject(index: number, event: MouseEvent<HTMLButtonElement>) {
    if (index === selected) return;
    intent.current = true;
    setQuietSelection(event.detail === 0);
    setSelected(index);
    const parent = document.querySelector<HTMLElement>('.pro-experience');
    if (parent) parent.dataset.selectedProject = String(index);
    try {
      sessionStorage.setItem('nur-selected-project', String(index));
    } catch {}
  }
  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      <LazyMotion features={loadFeatures} strict>
        <div className="pro-work__island" data-picker-ready={ready}>
          <div className="pro-work__background" aria-hidden="true">
            <AnimatePresence initial={false}>
              <m.div
                className="pro-work__layer"
                key={background.project.id}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{
                  duration: quietSelection ? 0 : reduce ? 0.12 : motionTiming.project.background,
                  ease: motionEase('--ease-preview')
                }}
              >
                {background.project.image && background.painted ? (
                  <img
                    src={background.project.image}
                    srcSet={background.project.imageSet}
                    sizes="100vw"
                    alt=""
                    width={background.project.imageWidth}
                    height={background.project.imageHeight}
                    loading={ready ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : (
                  <span className="pro-work__word">{background.project.name}</span>
                )}
              </m.div>
            </AnimatePresence>
          </div>
          <div className="pro-content">
            {' '}
            <div className="pro-work__front">
              <div className="pro-work__heading">
                <h2 className="pro-title" id="work-title" tabIndex={-1}>
                  {t(words.work, language)}
                </h2>
                <p>{t(workCopy.instruction, language)}</p>
              </div>
              <LayoutGroup id="professional-work">
                <m.div
                  layoutScroll
                  className="pro-project-picker"
                  role="group"
                  aria-label={t(workCopy.select, language)}
                >
                  {projects.map((project, index) => (
                    <button
                      type="button"
                      key={project.id}
                      aria-controls="work-preview"
                      aria-pressed={selected === index}
                      onPointerEnter={() => void prepareProjectImage(project)}
                      onFocus={() => void prepareProjectImage(project)}
                      onTouchStart={() => void prepareProjectImage(project)}
                      onClick={(event) => selectProject(index, event)}
                      className="pro-project-option"
                    >
                      {selected === index && (
                        <m.span
                          className="pro-project-option__surface"
                          layoutId="selected-project"
                          aria-hidden="true"
                          transition={
                            quietSelection || reduce
                              ? {duration: 0}
                              : {
                                  type: 'spring',
                                  duration: motionTiming.project.selection,
                                  bounce: 0
                                }
                          }
                        />
                      )}
                      <span className="pro-option__name">{project.name}</span>
                      <span className="pro-option__kind">{t(project.kind, language)}</span>
                    </button>
                  ))}
                </m.div>
              </LayoutGroup>
              <div className="pro-nojs">
                {projects.map((project) => (
                  <a className="pro-link" href={'#' + project.id} key={project.id}>
                    {project.name}
                  </a>
                ))}
              </div>
              <article
                id="work-preview"
                className="pro-project-selection"
                aria-labelledby="work-preview-title"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="pro-preview__content" ref={content}>
                  <h3 id="work-preview-title">{chosen.name}</h3>
                  <p className="pro-project-kind">{t(words.personal, language)}</p>
                  <p className="pro-body">{t(chosen.summary, language)}</p>
                  <a href={'#' + chosen.id} className="pro-button">
                    {t(words.detail, language)}
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
