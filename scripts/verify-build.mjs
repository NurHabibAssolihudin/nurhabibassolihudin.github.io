import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const creator = html => html.slice(html.indexOf('<div class="world world--creator"'), html.indexOf('</main>')).trim();
const baselineCreator = read('templates/creator.html').trim().replaceAll('src="assets/', 'src="/assets/');
const chapters = ['top', 'summary', 'work', 'project-orca', 'project-ocaty', 'project-oxelot', 'experience-work', 'approach', 'contact'];
const creatorHashes = { en: 'dc29c00ecb5fda5c796aff20e38ceab0784910fb4819004319c4dda307758916', id: '28d8cc60739fd7f431de5f4d8eab3eb99bbf694ff509baa1715346fb758dff34' };
let checks = 0;
for (const [route, language] of [['', 'en'], ['en/', 'en'], ['id/', 'id']]) {
  const html = read(`dist/${route}index.html`);
  assert.match(html, new RegExp(`<html[^>]*lang="${language}"`)); checks++;
  assert.equal((html.match(/<section\b[^>]*\bdata-chapter(?=[\s=>])/g) || []).length, 9); checks++;
  for (const chapter of chapters) { assert.ok(html.includes(`id="${chapter}"`), `${route}: ${chapter} missing from static HTML`); checks++; }
  assert.ok(html.includes('PT Semesta Teknologi Informatika') && html.includes('mailto:nurhabibassolihudin12@gmail.com')); checks++;
  for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)"/g)) {
    const path = match[1];
    if (/\.[a-z\d]+$/i.test(path)) { assert.ok(existsSync(resolve(root, 'dist', path.slice(1))), `Missing build asset ${path}`); checks++; }
  }
  assert.ok(html.includes('hreflang="x-default"') && html.includes('property="og:url"')); checks++;
  assert.equal((html.match(/<astro-island\b/g) || []).length, 1, 'Only the work picker needs hydration'); checks++;
  assert.ok(/<astro-island\b[^>]*client="visible"/.test(html), 'Work picker must defer hydration until needed'); checks++;
  assert.ok(!html.includes('/scenes.css') && !html.includes('.ttf'), 'Legacy scene CSS and TTF requests must not return'); checks++;
  if (language === 'en') { assert.equal(creator(html), baselineCreator, 'Creator content changed during professional migration'); checks++; }
  assert.equal(createHash('sha256').update(creator(html).replaceAll('\r', '')).digest('hex'), creatorHashes[language], `${language}: creator differs from merged baseline`); checks++;
  assert.ok(!html.includes('ipapi.co') && !html.includes('navigator.geolocation')); checks++;
}
for (const font of ['bricolage', 'manrope']) {
  const path = resolve(root, `dist/assets/fonts/${font}.woff2`);
  assert.equal(readFileSync(path).subarray(0, 4).toString(), 'wOF2'); checks++;
  assert.ok(!existsSync(resolve(root, `dist/assets/fonts/${font}.ttf`))); checks++;
}
console.log(`${checks} static build checks passed: complete content, anchors, assets, metadata, and preserved bilingual creator markup.`);
