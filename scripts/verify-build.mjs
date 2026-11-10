import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import {markupSnapshot} from './markup-snapshot.mjs';
import {projectSectionIds} from '../src/data/navigation.ts';
const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const creator = html => html.slice(html.indexOf('<div class="world world--creator"'), html.indexOf('</main>')).trim();
const chapters = ['top', 'summary', 'work', 'experience-work', 'approach', 'contact'];
// Reviewed creator design: pin visible SSR content, structure and links while
// excluding Astro's volatile island compilation metadata.
const creatorHashes = JSON.parse(read('scripts/creator-snapshots.json'));
let checks = 0;
const sitemap = read('dist/sitemap.xml');
assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/); checks++;
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedUrls = ['/', '/en/', '/id/', ...['en', 'id'].flatMap(language => projectSectionIds.map(id => `/${language}/projects/${id.replace('project-', '')}/`))]
  .map(path => `https://nurhabibassolihudin.github.io${path}`);
assert.deepEqual([...sitemapUrls].sort(), expectedUrls.sort(), 'Sitemap must list every canonical public page exactly once'); checks++;
for (const entry of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  for (const language of ['en', 'id', 'x-default']) {
    assert.ok(entry[1].includes(`hreflang="${language}"`), 'Every sitemap URL needs reciprocal language alternatives'); checks++;
  }
  const url = new URL(entry[1].match(/<loc>([^<]+)<\/loc>/)[1]);
  assert.ok(existsSync(resolve(root, `dist/${url.pathname.slice(1)}index.html`)), 'Sitemap URL must exist in the static build'); checks++;
}
assert.ok(read('dist/robots.txt').includes('Sitemap: https://nurhabibassolihudin.github.io/sitemap.xml')); checks++;
for (const [route, language] of [['', 'en'], ['en/', 'en'], ['id/', 'id']]) {
  const html = read(`dist/${route}index.html`);
  assert.match(html, new RegExp(`<html[^>]*lang="${language}"`)); checks++;
  assert.equal((html.match(/<section\b[^>]*\bdata-chapter(?=[\s=>])/g) || []).length, chapters.length); checks++;
  for (const chapter of chapters) { assert.ok(html.includes(`id="${chapter}"`), `${route}: ${chapter} missing from static HTML`); checks++; }
  assert.ok(html.includes('PT Semesta Teknologi Informatika') && html.includes('mailto:nurhabibassolihudin12@gmail.com')); checks++;
  for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)"/g)) {
    const path = match[1];
    if (/\.[a-z\d]+$/i.test(path)) { assert.ok(existsSync(resolve(root, 'dist', path.slice(1))), `Missing build asset ${path}`); checks++; }
  }
  assert.ok(html.includes('hreflang="x-default"') && html.includes('property="og:url"')); checks++;
  assert.equal((html.match(/<astro-island\b/g) || []).length, 4, 'Professional gallery/contact and the deferred Crimson Violet experience need hydration'); checks++;
  assert.ok(/srcset="[^"]+\.webp 480w[^\"]+\.webp 960w/i.test(html),'Project preview needs generated responsive WebP assets'); checks++;
  assert.match(html,/data-astro-prefetch="hover"/, 'Locale links should prefetch on intent'); checks++;
  assert.ok(/<astro-island\b[^>]*client="visible"/.test(html), 'Work picker must defer hydration until needed'); checks++;
  assert.ok(!html.includes('/scenes.css') && !html.includes('.ttf'), 'Legacy scene CSS and TTF requests must not return'); checks++;
  assert.equal(createHash('sha256').update(markupSnapshot(creator(html))).digest('hex'), creatorHashes[language], `${language}: creator differs from expected content snapshot`); checks++;
  assert.ok(html.includes('data-crimson-experience')&&html.includes('data-creator-form'),'Crimson Violet must include its scene and contact form in SSR');checks++;
  for(const anchor of ['ctop','worlds','craft','tools','play']){assert.ok(html.includes(`id="${anchor}"`),`Missing creator anchor ${anchor}`);checks++;}
  assert.ok(html.includes('Original concept artwork')||html.includes('Studi visual')||html.includes('Visual study'),'Original artwork must not be presented as game screenshots');checks++;
  assert.ok(!html.includes('ipapi.co') && !html.includes('navigator.geolocation')); checks++;
  assert.match(html,/<dialog[^>]+id="project-reader"/,'Project reader must use a native modal');checks++;
  const contactStart = html.indexOf('<section id="contact"');
  const contact = html.slice(contactStart, html.indexOf('</section>', contactStart));
  assert.ok(contact.includes('data-contact-form') && contact.includes('aria-live="polite"'), 'Contact form and status must be server rendered'); checks++;
  for (const field of ['name', 'email', 'message']) {
    assert.ok(contact.includes(`for="contact-${field}"`) && contact.includes(`id="contact-${field}"`), 'Contact field needs a visible label'); checks++;
  }
  assert.ok(contact.includes('contact-afternoon') && contact.includes('Maximilian Bungart / Unsplash'), 'Contact photo needs local responsive output and provenance'); checks++;
}
for(const language of ['en','id'])for(const slug of projectSectionIds.map(id=>id.replace('project-',''))){
  const html=read(`dist/${language}/projects/${slug}/index.html`);
  assert.ok(read('dist/sitemap.xml').includes(`/${language}/projects/${slug}/`),'Every published case needs a sitemap URL');checks++;
  assert.match(html,/<h1[^>]*id="project-/,'Each case needs a standalone, readable title');checks++;
  assert.ok(html.includes(`rel="canonical" href="https://nurhabibassolihudin.github.io/${language}/projects/${slug}/"`));checks++;
  assert.ok(!html.includes('<astro-island'),'Case studies must remain readable without hydration');checks++;
  assert.ok((html.match(/<section>/g)||[]).length>=7,'Complete case content must be in static HTML');checks++;
}
for (const font of ['bricolage', 'manrope']) {
  const path = resolve(root, `dist/assets/fonts/${font}.woff2`);
  assert.equal(readFileSync(path).subarray(0, 4).toString(), 'wOF2'); checks++;
  assert.ok(!existsSync(resolve(root, `dist/assets/fonts/${font}.ttf`))); checks++;
}
console.log(`${checks} static build checks passed: complete content, anchors, assets, metadata, and preserved bilingual creator markup.`);
