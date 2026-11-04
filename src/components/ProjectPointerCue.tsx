import {useEffect, useRef, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import {motionTiming} from '../lib/motion-settings';

/** Brief click affordance; the native cursor and link remain the actual control. */
export default function ProjectPointerCue({
  stage,
  enabled
}: {
  stage: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}) {
  const cue = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const area = stage.current,
      node = cue.current;
    if (!enabled || !area || !node) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let controls: Animation[] = [];
    function stop() {
      controls.forEach((control) => control.cancel());
      controls = [];
      node!.hidden = true;
    }
    function position(event: PointerEvent) {
      if (!node!.hidden)
        node!.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    }
    const card = (target: EventTarget | null) =>
      target instanceof Element ? target.closest('[data-card-project]') : null;
    function enter(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !fine.matches || event.buttons) return;
      const target = card(event.target);
      if (!target || target === card(event.relatedTarget)) return;
      stop();
      node!.hidden = false;
      position(event);
      controls = [...node!.children].map((ring, index) =>
        ring.animate(
          [
            {transform: 'scale(.35)', opacity: 0.8, offset: 0},
            {transform: 'scale(.7)', opacity: 0.8, offset: 0.3},
            {transform: 'scale(1.65)', opacity: 0, offset: 1}
          ],
          {
            duration: motionTiming.gallery.cue * 1000,
            delay: index * motionTiming.gallery.cueStagger * 1000,
            iterations: 2,
            easing: 'linear'
          }
        )
      );
    }
    function leave(event: PointerEvent) {
      if (card(event.target) !== card(event.relatedTarget)) stop();
    }
    area.addEventListener('pointerover', enter);
    area.addEventListener('pointermove', position);
    area.addEventListener('pointerout', leave);
    area.addEventListener('pointerleave', stop);
    area.addEventListener('pointerdown', stop);
    fine.addEventListener('change', stop);
    window.addEventListener('blur', stop);
    window.addEventListener('resize', stop);
    window.addEventListener('nur:reader', stop);
    window.addEventListener('nur:chapter-start', stop);
    window.addEventListener('nur:transition-start', stop);
    document.addEventListener('visibilitychange', stop);
    return () => {
      stop();
      area.removeEventListener('pointerover', enter);
      area.removeEventListener('pointermove', position);
      area.removeEventListener('pointerout', leave);
      area.removeEventListener('pointerleave', stop);
      area.removeEventListener('pointerdown', stop);
      fine.removeEventListener('change', stop);
      window.removeEventListener('blur', stop);
      window.removeEventListener('resize', stop);
      window.removeEventListener('nur:reader', stop);
      window.removeEventListener('nur:chapter-start', stop);
      window.removeEventListener('nur:transition-start', stop);
      document.removeEventListener('visibilitychange', stop);
    };
  }, [stage, enabled]);
  return enabled
    ? createPortal(
        <span ref={cue} className="project-pointer-cue" aria-hidden="true" hidden>
          <i />
          <i />
        </span>,
        document.body
      )
    : null;
}
