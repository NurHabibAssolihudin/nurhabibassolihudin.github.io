import {animate} from 'motion/mini';
import {projectSectionIds} from '../data/navigation';
import {decodeFragment} from './url-fragment';
import {motionTiming, motionEase} from './motion-settings';

export function initProjectReader() {
  const dialog = document.querySelector<HTMLDialogElement>('#project-reader');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const surface = dialog.querySelector<HTMLElement>('.project-reader__surface')!;
  const scroller = dialog.querySelector<HTMLElement>('.project-reader__scroll')!;
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-reader-close]')!;
  const articles = [...dialog.querySelectorAll<HTMLElement>('.project-story')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let phase: 'closed' | 'opening' | 'open' | 'closing' = 'closed',
    source: HTMLElement | null = null,
    flight: HTMLElement | null = null;
  let active: HTMLElement | undefined,
    controls: ReturnType<typeof animate>[] = [],
    revision = 0;
  let sourceOpacity = '',
    ownedHistory = false,
    exitHistory = false,
    exitFocus = false;
  let returnFocus: HTMLElement | null = null;
  let focusFrame = 0;
  function restoreFocusAfterHistory() {
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => {
      if (
        phase === 'closed' &&
        decodeFragment(location.hash) === 'work' &&
        returnFocus?.isConnected
      ) {
        returnFocus.focus({preventScroll: true});
        returnFocus = null;
      }
    });
  }
  const notify = (open: boolean) =>
    window.dispatchEvent(new CustomEvent('nur:reader', {detail: {open}}));
  function cancel() {
    revision++;
    controls.forEach((control) => control.cancel());
    controls = [];
    flight?.remove();
    flight = null;
  }
  function parts() {
    return active
      ? [
          ...active.querySelectorAll<HTMLElement>(
            '.project-story__hero>:not(.project-story__material),.project-story__body'
          )
        ]
      : [];
  }
  function finishOpening() {
    if (phase === 'closed' || phase === 'closing') return;
    cancel();
    phase = 'open';
    dialog!.dataset.phase = 'open';
    surface.style.removeProperty('transform');
    parts().forEach((element) => element.style.removeProperty('opacity'));
    if (active) active.inert = false;
  }
  function finishClosing(restoreFocus: boolean) {
    cancel();
    phase = 'closed';
    dialog!.dataset.phase = 'closed';
    dialog!.close();
    source?.style.setProperty('opacity', sourceOpacity);
    if (source && sourceOpacity === '') source.style.removeProperty('opacity');
    parts().forEach((element) => element.style.removeProperty('opacity'));
    articles.forEach((article) => {
      article.hidden = true;
      article.inert = false;
    });
    surface.style.removeProperty('transform');
    notify(false);
    if (restoreFocus) {
      returnFocus = source?.isConnected ? source : document.getElementById('work-title');
      restoreFocusAfterHistory();
    }
    active = undefined;
    source = null;
  }
  function originTransform() {
    if (!source || !source.isConnected) return null;
    const from = source.getBoundingClientRect(),
      to = dialog!.getBoundingClientRect();
    if (
      from.right <= 0 ||
      from.left >= innerWidth ||
      from.bottom <= 0 ||
      from.top >= innerHeight ||
      !from.width
    )
      return null;
    return `translate3d(${from.left - to.left}px,${from.top - to.top}px,0) scale(${from.width / to.width},${from.height / to.height})`;
  }
  function completeClose() {
    if (active) active.style.removeProperty('opacity');
    finishClosing(exitFocus);
    if (exitHistory) {
      if (ownedHistory && history.state?.nurProjectReader) history.back();
      else history.replaceState(null, '', '#work');
    }
    ownedHistory = false;
  }
  async function close(updateHistory = true, instant = false) {
    if (phase === 'closed' || phase === 'closing') return;
    exitHistory = updateHistory;
    exitFocus = updateHistory || decodeFragment(location.hash) === 'work';
    cancel();
    phase = 'closing';
    dialog!.dataset.phase = 'closing';
    const version = revision;
    const destination = originTransform();
    if (!instant && !reduced.matches && destination) {
      if (active) controls.push(animate(active, {opacity: 0}, {duration: 0.12}));
      controls.push(
        animate(
          surface,
          {transform: destination},
          {duration: motionTiming.gallery.close, ease: motionEase('--ease-preview')}
        )
      );
      await Promise.allSettled(controls.map((control) => control.finished));
    }
    if (version !== revision) return;
    completeClose();
  }
  async function open(id: string, card: HTMLElement | null, quiet = false, push = false) {
    const article = articles.find((item) => item.id === id);
    if (!article) return;
    cancelAnimationFrame(focusFrame);
    returnFocus = null;
    if (phase !== 'closed') {
      if (article === active) {
        if (phase === 'closing') {
          cancel();
          phase = 'opening';
          article.style.removeProperty('opacity');
          finishOpening();
        }
        return;
      }
      finishClosing(false);
    }
    source = card;
    sourceOpacity = card?.style.opacity || '';
    active = article;
    const index = projectSectionIds.indexOf(id),
      shell = document.querySelector<HTMLElement>('.pro-experience');
    if (shell) shell.dataset.selectedProject = String(index);
    try {
      sessionStorage.setItem('nur-selected-project', String(index));
    } catch {}
    window.dispatchEvent(new Event('nur:project'));
    articles.forEach((item) => {
      item.hidden = item !== article;
    });
    article.style.removeProperty('opacity');
    article.inert = false;
    dialog!.dataset.project = id;
    dialog!.setAttribute('aria-labelledby', `${id}-title`);
    notify(true);
    dialog!.showModal();
    scroller.scrollTop = 0;
    closeButton.focus({preventScroll: true});
    phase = 'opening';
    dialog!.dataset.phase = 'opening';
    ownedHistory = push || Boolean(history.state?.nurProjectReader);
    if (push) history.pushState({nurProjectReader: true}, '', '#' + id);
    const from = originTransform();
    if (quiet || reduced.matches || !from) {
      finishOpening();
      return;
    }
    const title = article.querySelector<HTMLElement>('[id$="-title"]')!,
      cardTitle = card?.querySelector<HTMLElement>('[data-card-title]');
    if (cardTitle) {
      const a = cardTitle.getBoundingClientRect(),
        b = title.getBoundingClientRect(),
        style = getComputedStyle(cardTitle);
      flight = document.createElement('span');
      flight.className = 'project-reader__title-flight';
      flight.textContent = cardTitle.textContent;
      flight.setAttribute('aria-hidden', 'true');
      Object.assign(flight.style, {
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        color: style.color
      });
      // Top-layer descendants stay above the native dialog's backdrop.
      dialog!.append(flight);
      const ratio = parseFloat(getComputedStyle(title).fontSize) / parseFloat(style.fontSize);
      const initialScale = a.height / parseFloat(style.lineHeight);
      controls.push(
        animate(
          flight,
          {
            transform: [
              `translate3d(${a.left}px,${a.top}px,0) scale(${initialScale})`,
              `translate3d(${b.left}px,${b.top}px,0) scale(${ratio})`
            ],
            color: getComputedStyle(title).color
          },
          {duration: motionTiming.gallery.open, ease: motionEase('--ease-preview')}
        )
      );
    }
    surface.style.transform = from;
    if (source) source.style.opacity = '0';
    article.inert = true;
    const content = parts();
    content.forEach((element) => (element.style.opacity = '0'));
    controls.push(
      animate(
        surface,
        {transform: 'translate3d(0,0,0) scale(1,1)'},
        {duration: motionTiming.gallery.open, ease: motionEase('--ease-preview')}
      )
    );
    content.forEach((element, index) =>
      controls.push(
        animate(
          element,
          {opacity: 1},
          {duration: motionTiming.gallery.content, delay: 0.28 + Math.min(index, 3) * 0.04}
        )
      )
    );
    const version = revision;
    await Promise.allSettled(controls.map((control) => control.finished));
    if (version === revision && phase === 'opening') finishOpening();
  }
  function click(event: MouseEvent) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const card = (event.target as Element).closest<HTMLElement>('[data-card-project]');
    if (!card) return;
    const id = card.dataset.cardProject!;
    if (!projectSectionIds.includes(id)) return;
    event.preventDefault();
    void open(id, card, event.detail === 0, true);
  }
  function route() {
    const id = decodeFragment(location.hash);
    if (projectSectionIds.includes(id)) void open(id, null, true, false);
    else {
      void close(false);
      if (id === 'work' && returnFocus) restoreFocusAfterHistory();
    }
  }
  function interrupt() {
    if (phase === 'opening') finishOpening();
    else if (phase === 'closing') completeClose();
  }
  function external() {
    if (phase !== 'closed') finishClosing(false);
  }
  closeButton.addEventListener('click', () => void close());
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    void close(true, true);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        void close();
    }
  });
  dialog.addEventListener(
    'wheel',
    () => {
      if (phase === 'opening') finishOpening();
    },
    {passive: true}
  );
  dialog.addEventListener(
    'touchstart',
    () => {
      if (phase === 'opening') finishOpening();
    },
    {passive: true}
  );
  window.addEventListener('resize', interrupt);
  reduced.addEventListener('change', interrupt);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) interrupt();
  });
  window.addEventListener('pagehide', external);
  window.addEventListener('nur:world', external);
  window.addEventListener('nur:transition-start', external);
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
  document.addEventListener('click', click);
  route();
}
