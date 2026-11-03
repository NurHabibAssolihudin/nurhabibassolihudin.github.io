import {scroll} from 'motion';
import {animate} from 'motion/mini';

interface Transfer {
  source: HTMLElement;
  target: HTMLElement;
  from: number;
  to: number;
  navigate(): void;
}

/** The identity follows native scroll; this controller never drives its position. */
export function createProjectTransfer(container: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup: (() => void) | undefined;
  function cancel() {
    cleanup?.();
  }
  function run({source, target, from, to, navigate}: Transfer) {
    cancel();
    if (reduced.matches || Math.abs(to - from) < 2 || typeof source.animate !== 'function') {
      navigate();
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(source);
    const start = range.getBoundingClientRect();
    range.selectNodeContents(target);
    const end = range.getBoundingClientRect();
    if (!start.width || !end.width) {
      navigate();
      return;
    }
    const sourceStyle = getComputedStyle(source),
      destinationStyle = getComputedStyle(target);
    const carrier = document.createElement('span');
    carrier.className = 'project-transfer';
    carrier.textContent = source.textContent;
    carrier.setAttribute('aria-hidden', 'true');
    carrier.inert = true;
    Object.assign(carrier.style, {
      fontFamily: sourceStyle.fontFamily,
      fontSize: sourceStyle.fontSize,
      fontWeight: sourceStyle.fontWeight,
      letterSpacing: sourceStyle.letterSpacing,
      color: sourceStyle.color,
      lineHeight: sourceStyle.lineHeight,
      transform: `translate(${start.left}px,${start.top}px) scale(1)`
    });
    const sourceOpacity = source.style.opacity,
      targetOpacity = target.style.opacity;
    document.body.append(carrier);
    source.style.opacity = '0';
    target.style.opacity = '0';
    let animation: ReturnType<typeof animate> | undefined,
      untrack: (() => void) | undefined,
      timer: ReturnType<typeof setTimeout> | undefined,
      ended = false;
    function finish() {
      if (ended) return;
      ended = true;
      untrack?.();
      animation?.cancel();
      clearTimeout(timer);
      carrier.remove();
      source.style.opacity = sourceOpacity;
      target.style.opacity = targetOpacity;
      container.removeEventListener('scrollend', onScrollEnd);
      if (cleanup === finish) cleanup = undefined;
    }
    function onScrollEnd(event: Event) {
      if (event.target === container) finish();
    }
    cleanup = finish;
    try {
      const destinationTop = end.top - (to - from);
      animation = animate(
        carrier,
        {
          transform: [
            `translate(${start.left}px,${start.top}px) scale(1)`,
            `translate(${end.left}px,${destinationTop}px) scale(${end.width / start.width},${end.height / start.height})`
          ],
          color: [sourceStyle.color, destinationStyle.color]
        },
        {duration: 1, ease: 'linear'}
      );
      untrack = scroll(animation, {container, offset: [`${from}px 0px`, `${to}px 0px`]});
      container.addEventListener('scrollend', onScrollEnd);
      timer = setTimeout(finish, 2000);
    } catch {
      finish();
    }
    navigate();
  }
  const interruptions = [
    'wheel',
    'pointerdown',
    'keydown',
    'resize',
    'popstate',
    'hashchange',
    'pagehide',
    'nur:world',
    'nur:transition-start'
  ];
  interruptions.forEach((name) =>
    window.addEventListener(name, cancel, {capture: true, passive: true})
  );
  reduced.addEventListener('change', cancel);
  return {
    run,
    cancel,
    dispose() {
      cancel();
      interruptions.forEach((name) => window.removeEventListener(name, cancel, true));
      reduced.removeEventListener('change', cancel);
    }
  };
}
