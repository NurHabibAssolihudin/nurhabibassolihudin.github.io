import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent
} from 'react';
import {
  LazyMotion,
  MotionConfig,
  useMotionValue,
  useTransform,
  useAnimationFrame
} from 'motion/react';
import * as m from 'motion/react-m';
import type {PickerProject} from '../data/project-types';
import {prepareProjectImage} from '../lib/project-images';
import {t, words, type Locale} from '../data/professional';
import {motionTiming} from '../lib/motion-settings';
import {useReducedMotionPreference} from '../lib/use-reduced-motion';
import ProjectArtwork from './ProjectArtwork';
import ProjectPointerCue from './ProjectPointerCue';

const loadFeatures = () => import('../lib/motion-features').then((module) => module.default);
interface Drag {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  at: number;
  moved: boolean;
}

export default function WorkPicker({
  language,
  projects
}: {
  language: Locale;
  projects: PickerProject[];
}) {
  const reduce = useReducedMotionPreference();
  const [ready, setReady] = useState(false),
    [selected, setSelected] = useState(0),
    [hovered, setHovered] = useState<number | null>(null),
    [browsing, setBrowsing] = useState(false),
    [primary, setPrimary] = useState(1);
  const stage = useRef<HTMLDivElement>(null),
    track = useRef<HTMLDivElement>(null);
  const phase = useMotionValue(0),
    transform = useTransform(phase, (value) => `translate3d(${value}px,0,0)`);
  const geometry = useRef({cycle: 0, pitch: 0, card: 0});
  const activity = useRef({
    visible: false,
    hover: false,
    focus: false,
    reader: false,
    hidden: false,
    browsing: false,
    reduced: false
  });
  const drag = useRef<Drag | null>(null),
    velocity = useRef(0),
    suppressClick = useRef(false);
  const hoverIdentity = useRef<number | null>(null),
    pointer = useRef<{x: number; y: number} | null>(null),
    wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function highlight(identity: number | null) {
    activity.current.hover = identity !== null;
    if (hoverIdentity.current === identity) return;
    hoverIdentity.current = identity;
    setHovered(identity);
  }
  function beginBrowsing() {
    if (!activity.current.browsing) setBrowsing(true);
    activity.current.browsing = true;
    highlight(null);
    if (stage.current) {
      stage.current.dataset.browsing = 'true';
      stage.current.dispatchEvent(new Event('nur:gallery-move'));
    }
  }
  function finishBrowsing() {
    if (drag.current || wheelTimer.current || Math.abs(velocity.current) > 8) return;
    if (activity.current.browsing) setBrowsing(false);
    activity.current.browsing = false;
    if (stage.current) delete stage.current.dataset.browsing;
    const point = pointer.current;
    if (!point || activity.current.reader || activity.current.hidden) return;
    // The track may have moved under a stationary cursor. Read the current hit
    // once at rest instead of retaining the old card or hit-testing every frame.
    const card = document.elementFromPoint(point.x, point.y)?.closest<HTMLElement>('[data-card-project]');
    if (card && stage.current?.contains(card))
      highlight(Number(card.dataset.cardCopy) * projects.length + Number(card.dataset.cardIndex));
  }
  const normalize = (value: number) => {
    const cycle = geometry.current.cycle;
    return cycle ? -cycle + (((value % cycle) + cycle) % cycle) : value;
  };
  useEffect(() => {
    activity.current.reduced = reduce;
    if (reduce) {
      velocity.current = 0;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = null;
      finishBrowsing();
    }
  }, [reduce]);
  useEffect(() => {
    function restore() {
      let value = document.querySelector<HTMLElement>('.pro-experience')?.dataset.selectedProject;
      if (value === undefined)
        try {
          value = sessionStorage.getItem('nur-selected-project') ?? undefined;
        } catch {}
      const index = Number(value);
      if (value !== undefined && projects[index]) {
        setSelected(index);
      }
    }
    restore();
    setReady(true);
    window.addEventListener('nur:project', restore);
    return () => window.removeEventListener('nur:project', restore);
  }, [projects]);
  useLayoutEffect(() => {
    if (!ready || !stage.current || !track.current) return;
    const element = stage.current;
    function measure() {
      const card = track.current?.querySelector<HTMLElement>('.project-card-slot');
      if (!card) return;
      const width = card.getBoundingClientRect().width,
        gap = parseFloat(getComputedStyle(card.parentElement!).columnGap) || 0,
        pitch = width + gap;
      const previousCycle = geometry.current.cycle,
        previousPhase = phase.get();
      geometry.current = {card: width, pitch, cycle: pitch * projects.length};
      // Hydration adds repeated sets without moving the project already painted
      // in static HTML. Resizing preserves the position within the same cycle.
      phase.set(
        previousCycle
          ? (previousPhase / previousCycle) * geometry.current.cycle
          : -geometry.current.cycle
      );
      velocity.current = 0;
    }
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    return () => resize.disconnect();
  }, [ready, projects.length, phase]);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        activity.current.visible = entries[0].isIntersecting;
        if (!activity.current.visible) velocity.current = 0;
      },
      {root: document.getElementById('professional-scroll'), threshold: 0.2}
    );
    observer.observe(element);
    const cancelDrag = () => {
      const gesture = drag.current;
      drag.current = null;
      velocity.current = 0;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = null;
      if (activity.current.browsing) setBrowsing(false);
      activity.current.browsing = false;
      delete element.dataset.browsing;
      highlight(null);
      delete element.dataset.dragging;
      if (gesture && element.hasPointerCapture(gesture.id))
        element.releasePointerCapture(gesture.id);
    };
    const visibility = () => {
      activity.current.hidden = document.hidden;
      if (document.hidden) cancelDrag();
    };
    const reader = (event: Event) => {
      activity.current.reader = (event as CustomEvent).detail.open;
      cancelDrag();
    };
    const world = () => {
      activity.current.visible =
        document.documentElement.dataset.world === 'builder' &&
        document.querySelector<HTMLElement>('.pro-experience')?.dataset.active === 'work';
      cancelDrag();
    };
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || activity.current.reader) return;
      event.preventDefault();
      pointer.current = {x: event.clientX, y: event.clientY};
      beginBrowsing();
      phase.set(normalize(phase.get() - event.deltaX));
      velocity.current = 0;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelTimer.current = null;
        finishBrowsing();
      }, motionTiming.gallery.wheelIdle * 1000);
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('nur:reader', reader);
    window.addEventListener('nur:world', world);
    element.addEventListener('wheel', wheel, {passive: false});
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('nur:reader', reader);
      window.removeEventListener('nur:world', world);
      element.removeEventListener('wheel', wheel);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
    };
  }, [phase]);
  useAnimationFrame((_time, delta) => {
    const state = activity.current;
    if (
      !ready ||
      !geometry.current.cycle ||
      !state.visible ||
      state.hidden ||
      state.reader ||
      state.reduced ||
      drag.current
    )
      return;
    const dt = Math.min(delta, 40) / 1000;
    if (Math.abs(velocity.current) > 8) {
      phase.set(normalize(phase.get() + velocity.current * dt));
      velocity.current *= Math.exp(-dt / 0.28);
    } else {
      if (state.browsing) finishBrowsing();
      if (!state.browsing && !state.hover && !state.focus)
        phase.set(normalize(phase.get() - motionTiming.gallery.speed * dt));
    }
  });
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick.current = false;
    velocity.current = 0;
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      at: event.timeStamp,
      moved: false
    };
    if (event.pointerType === 'mouse') event.preventDefault();
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') pointer.current = {x: event.clientX, y: event.clientY};
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    if (!gesture.moved) {
      const dx = event.clientX - gesture.startX,
        dy = event.clientY - gesture.startY;
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < 8) return;
      gesture.moved = true;
      beginBrowsing();
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = 'true';
      if (
        document.activeElement instanceof HTMLElement &&
        event.currentTarget.contains(document.activeElement)
      )
        document.activeElement.blur();
      activity.current.focus = false;
    }
    const dx = event.clientX - gesture.lastX,
      elapsed = Math.max(8, event.timeStamp - gesture.at);
    const momentum = velocity.current * 0.5 + (dx / elapsed) * 500;
    const limit = geometry.current.pitch * 4;
    velocity.current = Math.max(-limit, Math.min(limit, momentum));
    phase.set(normalize(phase.get() + dx));
    gesture.lastX = event.clientX;
    gesture.at = event.timeStamp;
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    // Touch implicitly captures on the pressed card. Transferring capture to
    // the stage emits a bubbling loss from that card, not the end of our drag.
    if (event.type === 'lostpointercapture' && event.target !== event.currentTarget) return;
    if (drag.current?.id !== event.pointerId) return;
    if (event.type !== 'pointerup') velocity.current = 0;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    finishBrowsing();
  }
  function focusCard(element: HTMLAnchorElement) {
    activity.current.focus = true;
    velocity.current = 0;
    const area = stage.current;
    if (!area) return;
    const rect = element.parentElement!.getBoundingClientRect(),
      bounds = area.getBoundingClientRect();
    if (element.matches(':focus-visible') || rect.left < bounds.left + 12 || rect.right > bounds.right - 12)
      phase.set(phase.get() + bounds.left + bounds.width / 2 - (rect.left + rect.width / 2));
    area.scrollLeft = 0;
  }
  function key(event: KeyboardEvent<HTMLAnchorElement>, group: number, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? projects.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length;
    track.current
      ?.querySelector<HTMLAnchorElement>(`[data-card-copy="${group}"][data-card-index="${next}"]`)
      ?.focus({preventScroll: true});
  }
  function choose(group: number, index: number) {
    const focused = document.activeElement;
    if (
      focused instanceof HTMLElement &&
      track.current?.contains(focused) &&
      focused.dataset.cardCopy !== String(group)
    )
      focused.blur();
    setPrimary(group);
    setSelected(index);
    const shell = document.querySelector<HTMLElement>('.pro-experience');
    if (shell) shell.dataset.selectedProject = String(index);
    try {
      sessionStorage.setItem('nur-selected-project', String(index));
    } catch {}
  }
  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      <LazyMotion features={loadFeatures} strict>
        <div className="project-gallery" data-picker-ready={ready}>
          <div className="project-gallery__heading">
            <h2 id="work-title" className="pro-title" tabIndex={-1}>
              {t(words.work, language)}
            </h2>
          </div>
          <div
            className="project-gallery__stage"
            ref={stage}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerEnd}
            onPointerCancel={pointerEnd}
            onLostPointerCapture={pointerEnd}
            onPointerLeave={(event) => {
              if (!drag.current?.moved) pointerEnd(event);
              pointer.current = null;
              highlight(null);
            }}
            onClickCapture={(event) => {
              if (suppressClick.current) {
                event.preventDefault();
                event.stopPropagation();
                suppressClick.current = false;
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                activity.current.focus = false;
            }}
          >
            <m.div className="project-gallery__track" ref={track} style={{transform}}>
              {(ready ? [0, 1, 2] : [1]).map((group) => (
                <div
                  className="project-gallery__set"
                  key={group}
                  aria-hidden={group !== primary ? true : undefined}
                >
                  {projects.map((project, index) => {
                    const identity = group * projects.length + index,
                      distance = hovered === null ? 99 : identity - hovered,
                      active = distance === 0;
                    const move = reduce
                      ? 'translate3d(0,0,0) scale(1)'
                      : active
                        ? 'translate3d(0,-16px,0) scale(1.09)'
                        : Math.abs(distance) === 1
                          ? `translate3d(${distance * 24}px,6px,0) scale(.97)`
                          : 'translate3d(0,0,0) scale(1)';
                    return (
                      <div
                        className="project-card-slot"
                        key={project.id}
                        style={{zIndex: active ? 3 : 1}}
                      >
                        <m.a
                          href={`/${language}/projects/${project.id.replace('project-', '')}/`}
                          className="project-card"
                          data-card-project={project.id}
                          data-card-copy={group}
                          data-card-index={index}
                          data-project={project.id}
                          data-active={active}
                          data-selected={selected === index}
                          tabIndex={group === primary ? 0 : -1}
                          initial={false}
                          animate={{transform: move}}
                          transition={
                            reduce || browsing
                              ? {duration: 0}
                              : {
                                  type: 'spring',
                                  duration: motionTiming.gallery.hover,
                                  bounce: 0.12
                                }
                          }
                          onPointerEnter={(event) => {
                            if (event.pointerType !== 'mouse' || activity.current.browsing || drag.current?.moved) return;
                            pointer.current = {x: event.clientX, y: event.clientY};
                            highlight(identity);
                            void prepareProjectImage(project);
                          }}
                          onPointerLeave={(event) => {
                            if (event.pointerType !== 'mouse') return;
                            if (hoverIdentity.current === identity) highlight(null);
                          }}
                          onFocus={(event) => {
                            highlight(identity);
                            focusCard(event.currentTarget);
                            void prepareProjectImage(project);
                          }}
                          onBlur={() => {
                            if (hoverIdentity.current === identity) highlight(null);
                          }}
                          onKeyDown={(event) => key(event, group, index)}
                          onClick={() => choose(group, index)}
                          draggable={false}
                        >
                          <m.span className="project-card__light" aria-hidden="true" initial={false} animate={{opacity:active?1:0,transform:active?'translate3d(25%,0,0)':'translate3d(-24%,0,0)'}} transition={{duration:reduce||browsing?0:.64}} />
                          <ProjectArtwork project={project} active={active} still={reduce||browsing} />
                          <div className="project-card__copy">
                            <h3 data-card-title>{project.name}</h3>
                            <p>{t(project.kind, language)}</p>
                            <span className="project-card__action">
                              {t(words.detail, language)}
                            </span>
                          </div>
                        </m.a>
                      </div>
                    );
                  })}
                </div>
              ))}
            </m.div>
          </div>
          <ProjectPointerCue stage={stage} enabled={ready && !reduce} />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
