import { mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public');
// This directory is generated, ignored, and must resolve directly inside this repository.
if (dirname(output) !== root || output !== resolve(root, 'public')) throw new Error('Unsafe public output path');
rmSync(output, { recursive: true, force: true });
const generated = {
  'styles.css': 'src/styles/styles.css',
  'prototype.css': 'src/styles/prototype.css',
  'polish.css': 'src/styles/polish.css',
  'planet.css': 'src/styles/planet.css',
  'field.js': 'src/artwork/field.js',
  'world-objects.js': 'src/artwork/world-objects.js',
  'planet-transit.js': 'src/artwork/planet-transit.js',
  'components.js': 'src/lib/creator-interactions.js',
};
const assets = ['robots.txt', 'sitemap.xml', 'assets/door.svg', 'assets/ocaty.png', 'assets/orca-workspace.png', 'assets/fonts/bricolage.woff2', 'assets/fonts/manrope.woff2', 'assets/fonts/Bricolage-OFL.txt', 'assets/fonts/Manrope-OFL.txt'];
for (const file of assets) generated[file] = file;
for (const [file, source] of Object.entries(generated)) {
  const destination = resolve(output, file);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(root, source), destination);
}
