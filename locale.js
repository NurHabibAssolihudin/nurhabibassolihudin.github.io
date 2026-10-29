import { chooseLanguage, supported } from './language.mjs';
const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
const save = language => { try { localStorage.setItem('nur-language', language); } catch {} };
document.querySelectorAll('[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    save(link.dataset.language);
    link.hash = location.hash;
    // Save the live world before locale navigation. Storage denial is harmless.
    try { sessionStorage.setItem('nur-world-state', JSON.stringify({ world: document.documentElement.dataset.world })); } catch {}
  });
});
if (document.documentElement.hasAttribute('data-auto-language')) {
  const params = new URLSearchParams(location.search);
  const explicit = params.get('lang');
  const language = chooseLanguage({ explicit, saved: read('nur-language'), languages: navigator.languages || [navigator.language] });
  if (supported(explicit)) save(explicit);
  if (language !== document.documentElement.lang) {
    params.delete('lang');
    location.replace(`/${language}/${params.size ? `?${params}` : ''}${location.hash}`);
  }
}
