# Portfolio optimization — 29 October 2026

Local branch: `migration/professional-phase-1`. Build output: `dist/`. The owner subsequently authorized commit and push to main; Pages publishing cutover is separate. No new imagery or creative-world redesign is included.

## Measured changes

| Measurement | Before | After |
| --- | ---: | ---: |
| Self-hosted font files | 177,304 B (TTF) | 40,024 B (WOFF2), 77.4% smaller |
| External JavaScript loaded on landing | 279,392 B | 42,034 B, 85.0% smaller |
| Initial local resource bodies | 572,865 B | 192,582 B |
| Legacy scene stylesheet | 5,765 B | Not requested or shipped |
| Initialized orbital scenes before first crossing | 2 | 1 |
| WebGL preserveDrawingBuffer | true | false |

Landing-resource numbers are decoded body bytes from fresh isolated Chrome sessions against the local production preview, before HTTP compression. They exclude the HTML document/inline bootstrap, describe the initial landing view, and are not a production transfer or frame-rate claim. React, its renderer and WorkPicker are deferred; approximately 71,887 B gzip of those chunks loads when the work picker is needed. Total eventual JavaScript is not reduced by the full landing percentage.

## Implementation

- Static professional content moved to `Professional.astro` and `Panel.astro`; `WorkPicker.tsx` is the single visible-triggered React island. Plain project links remain usable before hydration and without JavaScript.
- The initial full-viewport layout is established before visibility observation. This fixes a cold-start race where temporary pre-controller geometry could otherwise hydrate the island immediately.
- `professional-navigation.ts` caches section nodes/offsets. Settling uses numeric offsets and scrollTop. Content measurement does not call hash navigation. Real viewport/flow changes preserve a previously aligned section; content-only measurement never scrolls.
- Navigation IDs are separate from bilingual descriptions, so the initial navigation bundle does not include all project copy. The tested wheel-intent module and its no-queue policy are retained.
- Existing fonts are subset/compressed with fonttools 4.68.0 and Brotli 1.2.1. Retained glyph advances match their TTF sources; current EN/ID text has no missing previously supported glyphs. Font sources/licenses remain, and `scripts/optimize-fonts.py` provides regeneration tooling. Runtime and CI builds require only the generated assets.
- Planet, field and portal scripts load in parallel, independent of React. Creator interactions load on demand or portal hover/focus. Orbital scenes initialize once per visited world; repeated preparation cannot duplicate their observers.
- The field has no retained-portal GPU readback requirement, so buffer preservation is disabled. Uniform storage is reused, geometry refreshes after fonts settle, and pointer events outside the professional hero do not wake its field.
- Unused discipline scene sources are removed. Original TTF files remain in the asset library; only WOFF2 files are shipped.

## Verification

- Build/typecheck: 17 source files, zero errors/warnings/hints; three static locale routes emitted.
- Unit tests: 13/13 pass, including language and gesture regressions.
- Static build validation: 102 assertions pass, including preserved creator markup in both languages, one deferred island, WOFF2 signatures and absence of obsolete initial assets.
- Existing browser regressions: 54 navigation/mobile/world checks, 13 fallback checks, 30 single-gesture checks, 30 reversal checks and 17 text-stability checks pass.
- Optimization-specific browser checks: 23/23 pass, including no React on landing, no creator interaction fetch at startup, active-only orbital initialization, font geometry equality, no navigation on content resize, no section rectangle reads in settlement, deferred picker hydration, selection/history/locale context, viewport alignment, repeated world crossings, visible creator canvas and stable observer count. No uncaught exceptions or hydration console errors were recorded.
- Before/after hero screenshots were reviewed. Headline, lead and summary bounding boxes and font families match exactly. Desktop/mobile styles and the world portal remain visually consistent.

Evidence is local and ignored: `.taste-skill/optimization-before.json`, `optimization-after.json`, `optimization-qa-results.json`, before/after hero screenshots, `optimization-final-mobile.jpg`, and `optimization-creator-mobile.jpg`.

Physical Android/iPhone frame time, real network performance, production caching and deployment remain unmeasured. In particular, no mobile FPS improvement percentage is claimed.

## Main delivery and source cleanup

The owner requested commit and push to main, then explicitly chose to remove the obsolete implementation and reconfigure Pages themselves. Root/en/id HTML snapshots, the old page controller/build scripts and unused discipline scenes are removed. Active artwork/styles now live under src/; four focused shared templates replace the monolithic page template, and unused translations are pruned. Build output remains dist/; CI uploads it as portfolio-dist without changing Pages settings or deploying.
