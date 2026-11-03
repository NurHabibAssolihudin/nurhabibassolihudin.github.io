import {delay} from 'motion';
import {animate} from 'motion/mini';
import {motionEase, motionTiming} from '../lib/motion-settings';

type Playback = {finished: Promise<unknown>; cancel(): void};
type Sequence = [HTMLElement, {opacity?: number | number[]; transform?: string | string[]; clipPath?: string[]}, {at?: number; duration: number; ease?: [number, number, number, number]}][];
let finishActive: (() => void) | undefined;

/** A destination emblem travels out of its source, holds, then opens the next world. */
async function run({root, rift, worlds, name, origin, swap, closeMenu}: WorldTransitOptions) {
  finishActive?.();
  const experience = document.querySelector<HTMLElement>('#experience');
  const emblem = document.createElement('canvas');
  const ink = emblem.getContext('2d');
  const keyboard = origin.matches(':focus-visible');
  if (!rift || !experience || !ink || typeof experience.animate !== 'function') { swap(name, keyboard); return; }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const quiet = reduced.matches;
  const width = innerWidth, height = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  const source = worlds[root.dataset.world as PortfolioWorld];
  const sourceHero = source.querySelector<HTMLElement>('.hero__grid');
  const bar = document.querySelector<HTMLElement>('.bar');
  const box = source.querySelector('.core')!.getBoundingClientRect();
  const visible = box.bottom > 0 && box.top < height;
  const x = visible ? Math.max(0, Math.min(width, box.left + box.width / 2)) : width / 2;
  const y = visible ? Math.max(0, Math.min(height, box.top + box.height / 2)) : height / 2;
  const radius = Math.max(Math.hypot(x, y), Math.hypot(width - x, y), Math.hypot(x, height - y), Math.hypot(width - x, height - y)) + 80;
  const travel = `translate(calc(-50% + ${x - width / 2}px), calc(-50% + ${y - height / 2}px)) scale(.72)`;
  const centered = 'translate(-50%, -50%) scale(1)';
  const ease = motionEase(), travelEase = motionEase('--ease-in-out');
  const timing = motionTiming.world;
  const controls: Playback[] = [];
  let swapped = false, ended = false, interrupted = false;
  let interrupt!: () => void;
  const interruption = new Promise<void>(resolve => { interrupt = resolve; });

  const disc = (kind: string, color: string) => {
    const element = document.createElement('div');
    element.className = `portal__disc portal__disc--${kind}`;
    element.style.cssText = `left:${x}px;top:${y}px;background:${color};transform:translate(-50%,-50%) scale(.95);opacity:0`;
    return element;
  };
  const rim = disc('rim', name === 'creator' ? '#ff5032' : '#4264ff');
  const cover = disc('cover', '#101722');
  const veil = document.createElement('div');
  veil.className = 'portal__veil';
  veil.style.opacity = '0';
  const signature = document.createElement('div');
  signature.className = 'portal__signature';
  signature.style.transform = quiet ? centered : travel;
  signature.style.opacity = '0';
  signature.dataset.destination = name;
  emblem.width = 220 * dpr; emblem.height = 190 * dpr;
  emblem.className = 'portal__emblem';
  ink.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!window.NurPlanet?.emblem?.(ink, name)) { swap(name, keyboard); return; }
  const label = document.createElement('p');
  label.className = 'portal__name';
  label.textContent = name === 'creator' ? 'Crimson Violet' : 'NurHabib';
  signature.append(emblem, label);

  async function play(sequence: Sequence) {
    if (interrupted) return;
    const batch = sequence.map(([element, keyframes, {at = 0, ...options}]) => animate(element, keyframes, {ease, ...options, delay: at}));
    controls.push(...batch);
    await Promise.race([Promise.all(batch.map(animation => animation.finished)), interruption]);
  }
  async function hold(seconds: number) {
    let cancel = () => {};
    await Promise.race([new Promise<void>(resolve => { cancel = delay(() => resolve(), seconds); }), interruption]);
    cancel();
  }
  function changeWorld() {
    if (swapped) return;
    swapped = true;
    swap(name, false);
    // The entire destination is prepared behind the opaque cover, not during reveal.
    worlds[name].querySelectorAll('.hero .reveal').forEach(element => element.classList.add('in'));
    window.NurPlanet?.snapshot(); window.NurField?.snapshot();
  }
  function cleanup() {
    if (ended) return;
    ended = true;
    // Discard the effects: the outgoing world can already be display:none, where
    // stop()/commitStyles() cannot sample it. All temporary styles are reset below.
    controls.forEach(animation => animation.cancel());
    [sourceHero, worlds[name].querySelector<HTMLElement>('.hero__grid'), bar].forEach(element => {
      element?.style.removeProperty('opacity'); element?.style.removeProperty('transform');
    });
    experience!.style.removeProperty('clip-path');
    experience!.style.removeProperty('background-color');
    experience!.inert = false; experience!.removeAttribute('aria-busy');
    rift.replaceChildren(); rift.classList.remove('is-on');
    delete rift.dataset.phase;
    root.classList.remove('is-crossing', 'is-planet-crossing', 'is-planet-opening');
    window.NurPlanet?.charge(false); window.NurPlanet?.hold(false);
    window.NurField?.charge(false); window.NurField?.hold(false);
    window.removeEventListener('resize', stop);
    window.removeEventListener('pagehide', stop);
    document.removeEventListener('visibilitychange', visibility);
    document.removeEventListener('keydown', escape);
    reduced.removeEventListener('change', stop);
    finishActive = undefined;
    if (keyboard && !document.hidden) {
      const heading = worlds[name].querySelector<HTMLElement>('h1');
      if (heading) heading.tabIndex = -1;
      heading?.focus({preventScroll: true});
    }
  }
  function stop() { interrupted = true; interrupt(); changeWorld(); cleanup(); }
  function visibility() { if (document.hidden) stop(); }
  function escape(event: KeyboardEvent) { if (event.key === 'Escape') stop(); }

  try {
    closeMenu();
    root.classList.add('is-crossing', 'is-planet-crossing');
    experience.inert = true; experience.setAttribute('aria-busy', 'true');
    experience.style.backgroundColor = getComputedStyle(root).getPropertyValue('--scene').trim();
    window.NurPlanet?.charge(true); window.NurPlanet?.hold(true);
    window.NurField?.charge(true); window.NurField?.hold(true);
    rift.replaceChildren(...(quiet ? [veil, signature] : [rim, cover, signature]));
    rift.dataset.engine = 'motion'; rift.dataset.phase = 'gather'; rift.classList.add('is-on');
    finishActive = stop;
    window.addEventListener('resize', stop);
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('keydown', escape);
    reduced.addEventListener('change', stop);

    const closing: Sequence = quiet
      ? [[veil, {opacity: 1}, {duration: timing.quietEnter}], [signature, {opacity: 1}, {at: 0, duration: timing.quietEnter}]]
      : [
        [rim, {opacity: 1, transform: `translate(-50%, -50%) scale(${radius / 64 + .8})`}, {duration: timing.gather - .04, ease: travelEase}],
        [cover, {opacity: 1, transform: `translate(-50%, -50%) scale(${radius / 64})`}, {at: .04, duration: timing.gather - .04, ease: travelEase}],
        // Show the destination earlier, then give it a separate stable reading beat.
        [signature, {opacity: 1}, {at: .08, duration: .2}],
        [signature, {transform: centered}, {at: .04, duration: timing.gather - .04, ease: travelEase}],
      ];
    if (!quiet && sourceHero) closing.push([sourceHero, {opacity: .56, transform: 'scale(.985)'}, {at: 0, duration: timing.gather}]);
    if (!quiet && bar) closing.push([bar, {opacity: 0}, {at: 0, duration: .16}]);
    await play(closing);
    if (interrupted) return;
    changeWorld();
    rift.dataset.phase = 'signature';
    await hold(quiet ? timing.quietHold : timing.signatureHold);
    if (interrupted) return;
    rift.dataset.phase = 'reveal';

    if (quiet) {
      await play([[veil, {opacity: 0}, {duration: timing.quietExit}], [signature, {opacity: 0}, {at: 0, duration: timing.quietEnter}]]);
    } else {
      const revealRadius = Math.hypot(width / 2, height / 2) + 20;
      const center = `at ${width / 2}px ${height / 2}px`;
      experience.style.clipPath = `circle(0px ${center})`;
      root.classList.add('is-planet-opening');
      rim.hidden = cover.hidden = true;
      const destinationHero = worlds[name].querySelector<HTMLElement>('.hero__grid');
      const opening: Sequence = [
        [experience, {clipPath: [`circle(0px ${center})`, `circle(${revealRadius}px ${center})`]}, {duration: timing.reveal}],
        [signature, {opacity: 0, transform: 'translate(-50%, -50%) scale(1.24)'}, {at: .04, duration: .2}],
      ];
      if (destinationHero) opening.push([destinationHero, {opacity: [.72, 1], transform: ['scale(1.015)', 'scale(1)']}, {at: 0, duration: timing.reveal}]);
      if (bar) opening.push([bar, {opacity: 1}, {at: .24, duration: .2}]);
      await play(opening);
    }
  } finally {
    changeWorld(); cleanup();
  }
}

export const transit = {run, finish() { finishActive?.(); }};
