# NurHabib portfolio

Static portfolio for GitHub Pages. No dependencies or build service required for hosting. Both locale pages are generated HTML. The full-page builder/creator switch remains essential. The current local prototype explores sculptural futurism, a clean blue planet with four satellites and an alimagine mothership with flaming skull orbiters, a responsive point field, a dotted cover and circular world opening and compact project previews.

`field.js` renders one planet-influenced point field: ordered blue builder currents and fluid vermilion creator swirls. It pauses during world crossing, then settles into the new world. Drawing is capped at 24fps/DPR 1.5; reduced motion and missing WebGL use static rendering. Text and project areas stay quiet. No extra library or network service is required.

The Builder discipline section at `#platforms` uses three scroll-stacked explanatory scenes. Original SVG modules, memory pieces and service blocks animate only in the active panel. `scenes.css` and `scenes.js` keep this experiment separate. Cards stay in normal flow when the viewport is too short, motion is reduced or JavaScript is disabled. Their links open the matching project article; full-page world switching is preserved.

Copy in both languages describes project functions without repeated production or shipping claims. `polish.css` supplies shared spacing tokens, consistent heading scale, compact project rows, heading/image entrances and control feedback. `components.js` connects the tool selector to real project anchors and enhances native technical/process details with interruptible height animation. Reduced motion uses instant details; without JavaScript the complete tool table and both worlds remain readable. Portal captions activate the same full-page crossing as their objects.

```sh
npm run dev    # http://127.0.0.1:4173
npm run build  # regenerate /, /en/ and /id/ from scripts/build-pages.mjs
npm test       # explicit choice, saved preference and browser-language fallback
```

Edit English markup in `templates/page.html` and Indonesian translations in `locales/id.json`, then run `npm run build`. `scripts/build-pages.mjs` translates text and accessible attributes. The baseline styles are in `styles.css`; the current experiment is isolated in `prototype.css`. `world-objects.js` renders both orbital scenes in Canvas 2D, without WebGL or downloaded textures. It uses a cached blue globe, projected satellite/mothership meshes, skull sprites and deterministic flame/ember animation. `planet-transit.js` owns the bitmap dot front and circular opening, and `script.js` controls world state. `planet.css` contains the object fallback and transition styling. Language navigation is in `locale.js`. Root defaults to readable English without JavaScript. Explicit locale pages never auto-redirect. `?lang=id` and `?lang=en` at root set a preference. Language links retain the current section and world.

Automatic selection at root: explicit query > saved manual choice > first supported browser language > English. The owner chose browser preferences rather than country detection. There are no geolocation service calls, IP lookups or GPS permission requests. The prototype uses existing self-hosted Bricolage and Manrope fonts. Manual language and theme use localStorage; world state uses sessionStorage. Controls remain usable if storage is denied.

The rejected visual iteration remains in `.taste-skill/rejected-redesign/`. Its generated landscape is not referenced by the site. The original baseline is in `.taste-skill/pre-orb-prototype/`; the previous calm material experiment is in `.taste-skill/pre-sculptural/`. Existing Ocaty and ORCA images remain unchanged and can be enlarged from their compact thumbnails. No commit, push or deployment is implied by preview.
