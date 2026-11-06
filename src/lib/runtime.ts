import { chooseLanguage, supported } from './language.mjs';
import { initProfessionalNavigation } from './professional-navigation';
import { createMenuMotion } from './menu-motion';
import {initChapterMotion} from './chapter-motion';
import {initProjectReader} from './project-reader';
import {initContactForm} from './contact-form';
import {decodeFragment} from './url-fragment';
import {initInterfaceMotion} from './interface-motion';
import {chapterAliases as aliases} from '../data/navigation';

const root = document.documentElement, id = root.lang === 'id';
const professionalTitle = document.title;
const storage = { read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }, save(key: string, value: string) { try { localStorage.setItem(key, value); } catch {} } };
function syncThemeControls() {
  const dark = root.dataset.theme === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-checked', String(dark));
    button.title = id ? `Aktifkan mode ${dark ? 'terang' : 'gelap'}` : `Use ${dark ? 'light' : 'dark'} mode`;
  });
}
syncThemeControls();
const interfaceMotion=initInterfaceMotion();
const worlds = { builder: document.querySelector<HTMLElement>('.world--builder')!, creator: document.querySelector<HTMLElement>('.world--creator')! };
let current: 'builder' | 'creator' = root.dataset.world === 'creator' ? 'creator' : 'builder', busy = false;
let artworkReady: Promise<void> | null = null, creatorReady: Promise<void> | null = null;
let transitReady: Promise<NonNullable<Window['NurTransit']> | null> | null = null;
function prepareTransit() {
  if (!transitReady) transitReady = import('../artwork/planet-transit').then(module => {
    window.NurTransit = module.transit;
    return module.transit;
  }).catch(error => { console.warn('World transition could not start:', error); transitReady = null; return null; });
  return transitReady;
}
function prepareCreator() {
  if (!creatorReady) creatorReady = Promise.all([import('./creator-interactions.js'),import('../components/crimson/CreatorExperience')]).then(() => {}).catch(error => { console.warn('Creator interactions could not start:', error); creatorReady = null; });
  return creatorReady;
}
const menu = document.querySelector<HTMLElement>('#menu')!, menuButton = document.querySelector<HTMLButtonElement>('[data-menu]')!;
const menuMotion = createMenuMotion(menu, menuButton, id);
function closeMenu() { menuMotion.setOpen(false, busy); }
function setWorld(name: 'builder' | 'creator') {
  current = name; root.dataset.world = name;
  document.title = name === 'builder' ? professionalTitle : id ? 'Crimson Violet · game dan cerita' : 'Crimson Violet · games and stories';
  Object.entries(worlds).forEach(([world, element]) => { element.classList.toggle('is-live', world === name); element.inert = world !== name; });
  document.querySelector('.brand')?.setAttribute('href', name === 'builder' ? '#top' : '#ctop');
}
function saveWorld() { try { sessionStorage.setItem('nur-world-state', JSON.stringify({ world: current })); } catch {} }
function swap(name: 'builder' | 'creator', focus: boolean) {
  setWorld(name); closeMenu(); window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector<HTMLElement>('#professional-scroll')?.scrollTo({ top: 0, behavior: 'instant' });
  history.replaceState(null, '', location.pathname + location.search + (name === 'builder' ? '#top' : '#ctop'));
  window.dispatchEvent(new Event('nur:world'));
  if (focus) { const heading = worlds[name].querySelector<HTMLElement>('h1')!; heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  saveWorld(); window.NurField?.sync();
}

const params = new URLSearchParams(location.search), explicit = params.get('lang');
if (root.hasAttribute('data-auto-language')) {
  const language = chooseLanguage({ explicit, saved: storage.read('nur-language'), languages: navigator.languages });
  if (supported(explicit)) storage.save('nur-language', explicit!);
  if (language !== root.lang) { params.delete('lang'); location.replace(`/${language}/${params.size ? '?' + params : ''}${location.hash}`); }
}
document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach(link => link.addEventListener('click', () => { storage.save('nur-language', link.dataset.language!); link.hash = location.hash; saveWorld(); menuMotion.setOpen(false,true); window.NurTransit?.finish(); window.dispatchEvent(new Event('nur:transition-start')); }));
try { const saved = JSON.parse(sessionStorage.getItem('nur-world-state') || '{}'); if (saved.world === 'creator') current = 'creator'; } catch {}
function routeWorld(event?:Event) {
  const previousWorld=root.dataset.world;
  const requestedHash = location.hash;
  const hash = decodeFragment(requestedHash);
  window.NurTransit?.finish();
  if (location.hash !== requestedHash) history.replaceState(null, '', location.pathname + location.search + requestedHash);
  const owner = document.getElementById(aliases[hash] || hash)?.closest<HTMLElement>('.world')?.dataset.world;
  if (owner === 'builder' || owner === 'creator') {
    setWorld(owner);
    if(previousWorld!==owner)window.dispatchEvent(new Event('nur:world'));
    if (artworkReady) artworkReady.then(() => window.NurPlanet?.prepare(owner));
    if (owner === 'creator') prepareCreator();
  }
  if (owner === 'creator'&&(!event||previousWorld!==owner)) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' }));
  saveWorld();
}
setWorld(current); routeWorld();
window.addEventListener('popstate', routeWorld); window.addEventListener('hashchange', routeWorld); window.addEventListener('pagehide', saveWorld);
document.querySelectorAll('.year').forEach(element => { element.textContent = String(new Date().getFullYear()); });
document.addEventListener('click', async event => {
  const target = event.target as Element;
  if (menuMotion.isOpen && !document.querySelector('.bar')!.contains(target)) closeMenu();
  const theme = target.closest('[data-theme-toggle]');
  if (theme) { const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; interfaceMotion.changeTheme(()=>{root.dataset.theme = next; storage.save('theme', next); syncThemeControls();},event.detail===0); }
  if (target.closest('[data-menu]')) menuMotion.setOpen(!menuMotion.isOpen, event.detail === 0);
  if (target.closest('a[href^="#"]')) closeMenu();
  const cross = target.closest<HTMLButtonElement>('[data-cross]');
  if (!cross || busy) return;
  busy = true;
  window.dispatchEvent(new Event('nur:transition-start'));
  cross.setAttribute('aria-busy', 'true');
  try {
    const name = current === 'builder' ? 'creator' : 'builder';
    await Promise.all([artworkReady, prepareTransit()]);
    if (name === 'creator') await prepareCreator();
    window.NurPlanet?.prepare(name);
    if (window.NurTransit) await window.NurTransit.run({ root, rift: document.querySelector<HTMLElement>('#rift')!, worlds, name, origin: cross, swap, closeMenu });
    else swap(name, cross.matches(':focus-visible'));
  } finally { busy = false; cross.removeAttribute('aria-busy'); }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuMotion.isOpen) { menuMotion.setOpen(false, true); menuButton.focus(); } });
const header = document.querySelector<HTMLElement>('.bar')!;
new ResizeObserver(() => root.style.setProperty('--bar-height', matchMedia('(max-width:700px)').matches ? '0px' : header.getBoundingClientRect().height + 'px')).observe(header);

// All artwork lives in static Astro markup, so it can start without React.
// The two continuous renderers are independent; transition/creator code loads on intent.
async function startArtwork() {
  const files = ['/world-objects.js', '/field.js'];
  await Promise.all(files.map(async file => {
    try { await import(/* @vite-ignore */ file); } catch (error) { console.warn('Artwork could not start:', file, error); }
  }));
  window.NurPlanet?.prepare(current);
  if (current === 'creator') await prepareCreator();
}
initProfessionalNavigation();
initChapterMotion();
initProjectReader();
initContactForm();
root.dataset.navigationReady='true';
artworkReady = startArtwork();
for (const event of ['pointerover', 'focusin']) document.addEventListener(event, event => {
  if ((event.target as Element).closest('[data-cross]')) {
    prepareTransit();
    if (current === 'builder') prepareCreator();
  }
}, { passive: true });
