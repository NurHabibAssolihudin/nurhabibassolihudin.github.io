import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const template = readFileSync(resolve(root, 'templates/page.html'), 'utf8');
const id = JSON.parse(readFileSync(resolve(root, 'locales/id.json'), 'utf8'));
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function render(language, auto = false) {
  const dictionary = language === 'id' ? id : {};
  // Translate text nodes and human-readable attributes without touching scripts,
  // links, styles, class names or the original two-world markup.
  let html = template.split(/(<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<[^>]+>)/g).map(part => {
    if (part.startsWith('<!--') || part.startsWith('<script')) return part;
    if (part.startsWith('<')) {
      return part.replace(/(alt|aria-label|content)="([^"]*)"/g, (all, attribute, value) => own(dictionary, value) ? `${attribute}="${dictionary[value].replaceAll('"', '&quot;')}"` : all);
    }
    const key = part.trim();
    return own(dictionary, key) ? part.replace(key, dictionary[key]) : part;
  }).join('');
  html = html.replace('<html lang="en"', `<html lang="${language}"${auto ? ' data-auto-language' : ''}`);
  html = html.replace(/<script>document\.documentElement[\s\S]*?<\/script>/, `<script>document.documentElement.classList.add("js");try{var theme=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",theme==="light"||theme==="dark"?theme:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}</script>`);
  html = html.replace('href="styles.css?v=1"', 'href="/styles.css?v=5"').replace('src="script.js?v=1"', 'src="/script.js?v=8"').replaceAll('src="assets/', 'src="/assets/');
  html = html.replace('</head>', '<link rel="stylesheet" href="/prototype.css?v=8" />\n<link rel="stylesheet" href="/scenes.css?v=1" />\n<link rel="stylesheet" href="/planet.css?v=2" />\n<link rel="stylesheet" href="/polish.css?v=1" />\n</head>');
  const localeUrl = `https://nurhabibassolihudin.github.io/${language}/`;
  html = html.replace('rel="canonical" href="https://nurhabibassolihudin.github.io/"', `rel="canonical" href="${localeUrl}"`).replace('property="og:url" content="https://nurhabibassolihudin.github.io/"', `property="og:url" content="${localeUrl}"`);
  html = html.replace('</head>', `<link rel="alternate" hreflang="en" href="https://nurhabibassolihudin.github.io/en/" />
<link rel="alternate" hreflang="id" href="https://nurhabibassolihudin.github.io/id/" />
<link rel="alternate" hreflang="x-default" href="https://nurhabibassolihudin.github.io/" />
<meta property="og:locale" content="${language === 'id' ? 'id_ID' : 'en_US'}" />
</head>`);
  const label = language === 'id' ? 'Bahasa' : 'Language';
  const languageLinks = `<nav class="language-switch" aria-label="${label}"><a href="/en/" lang="en" hreflang="en" data-language="en"${language === 'en' ? ' aria-current="true"' : ''}>EN</a><a href="/id/" lang="id" hreflang="id" data-language="id"${language === 'id' ? ' aria-current="true"' : ''}>ID</a></nav>`;
  html = html.replace('<div class="bar__actions">', `<div class="bar__actions">\n      ${languageLinks}`);
  html = html.replace('<main id="main">', `<main id="main">\n<noscript><p class="wrap no-script">${language === 'id' ? 'Kedua dunia ditampilkan di bawah. Pilihan EN/ID tetap dapat digunakan.' : 'Both worlds are shown below. EN/ID links remain available.'}</p></noscript>`);
  html = html.replace('</body>', '<script type="module" src="/locale.js?v=3"></script>\n</body>');
  return '<!-- Generated from templates/page.html and locales/id.json. -->\n' + html;
}
for (const language of ['en', 'id']) {
  mkdirSync(resolve(root, language), { recursive: true });
  writeFileSync(resolve(root, language, 'index.html'), render(language));
}
writeFileSync(resolve(root, 'index.html'), render('en', true));
console.log('Built two-world portfolio in English and Indonesian.');
