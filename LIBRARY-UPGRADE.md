# Library integration — 3 November 2026

This pass implements six improvements on top of the existing portfolio, preserving its full professional/Crimson Violet world switch, destination emblems, gesture rules and approved project-preview tempo.

## Changes

1. **Section arrival (corrected 4 November).** Decorative planes/circles were rejected as visually unclear and removed. Actual supporting components open after the native scroll container settles: scope, picker/preview, project descriptions/contributions, employment and working method. Preparation occurs off screen, so visible content never vanishes to restart an entrance. The static Astro section owns preparation even while React is still hydrating. Titles stay visible and stationary; contact actions/profiles use a calm opacity entrance. Interaction, interruption, hiding, resize and reduced-motion changes restore content. Keyboard, direct links and history omit entrances.
2. **Project continuity.** Pointer activation of a selected project's detail link carries its name into the matching heading. Motion's `scroll()` binds the identity transform to native scrolling. Cleanup restores both original names after settlement, Escape, resize, history or world/locale navigation. The module warms near selected work. Before it is ready, the existing detail link still navigates normally.
3. **Motion feature loading.** `WorkPicker` uses `m`, asynchronous `LazyMotion` and `domMax`, retaining shared-layout selection. `domAnimation` would omit the layout feature used here. React and these features stay deferred until the work section approaches. Mini Motion remains sufficient for finite DOM effects elsewhere.
4. **Astro images.** The original screenshots now pass through build-time `getImage()`: 480px, 960px and original/1440px-capped WebP variants, plus 440px detail thumbnails. The picker receives URLs and dimensions, without server image tooling. Hover/focus/touch intent prepares and decodes an image before painting it. Pending preparation keeps the prior background; failed preparation uses the project name and can retry later. Original PNGs remain linked for full-size viewing.
5. **Locale navigation.** Astro hover prefetch and native cross-document View Transitions retain ordinary static-document navigation. Theme, world, current section and selected project persist. The initial world is established before first paint. A static professional chapter can be positioned before snapshot capture. If the work island or creator scene is not ready, the snapshot transition is skipped; the page does not wait for React and does not freeze an incorrect initial project. Reduced motion and unsupported browsers use normal navigation. No client router or third-party location service is introduced.
6. **Content structure.** Three professional projects and three creator projects use schema-validated Astro collections. Bilingual creator copy lives in typed data and Astro components; the old `templates/creator.html` is removed. The small shared header/footer/planet templates remain. Canonical markup hashes pinned from the pre-refactor build guard the creator's existing content, structure and links while allowing compiler whitespace and attribute-order changes.

## Measured cost

3 November build snapshot, compared with the previously pushed `b5559d5` build, before the 4 November component-reveal correction. These are historical artifact sizes, not a current bundle benchmark or real-network/physical-device performance measurements.

| Artifact | Before | After |
| --- | ---: | ---: |
| Picker component chunk, raw | 138,854 B | 20,606 B |
| Picker component chunk, gzip | 46,473 B | 8,155 B |
| Separate `domMax` feature chunk, gzip | bundled above | 30,771 B |
| Shared layout/runtime chunk, gzip | bundled above | 9,086 B |
| All generated `_astro` JS, raw | 389,082 B | 403,223 B |
| All generated `_astro` JS, sum of per-file gzip | 127,179 B | 135,347 B |
| ORCA screenshot / 960px WebP | 53,156 B PNG | 15,560 B |
| Ocaty screenshot / 960px WebP | 74,983 B PNG | 25,722 B |

The picker chunk reduction is a split, not a 118KB net saving. Total generated JavaScript increases by 8,168 gzip bytes for the new behavior, prefetch and split-chunk overhead. Features are deferred by role; the initial landing still excludes React, the picker, `domMax` and the project-transfer module. Image savings vary with the responsive candidate requested; a high-density large screen can request a larger variant. Gzip totals do not establish the server's compression or transfer behavior.

## Implementation references

- [Astro native and client-router view transitions](https://docs.astro.build/en/guides/view-transitions/): the native multipage route avoids changing script lifecycle and canvas ownership.
- [Astro prefetch](https://docs.astro.build/en/guides/prefetch/), [build-time image processing](https://docs.astro.build/en/guides/images/) and [Content Collections](https://docs.astro.build/en/guides/content-collections/).
- [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion), [feature bundle choices](https://motion.dev/docs/react-reduce-bundle-size) and [scroll-linked animation](https://motion.dev/docs/scroll).
- [Chrome cross-document lifecycle and snapshot readiness](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document): opt-in is inline before the first rendering opportunity; rejected/aborted transition readiness is handled. The implementation avoids render-blocking hydration.

## Validation and limits

The production build/typecheck reports zero errors, warnings and hints. The 13 language/gesture unit tests and 109 static build checks pass. Static checks include complete routes, generated responsive assets, metadata, one deferred island, valid links and unchanged creator content snapshots in both languages.

Local browser evidence is stored in ignored `.taste-skill/`: `library-results.json`, `library-locale-results.json`, `library-after/`, `library-inspect/`, and the existing Motion regression results. The suites cover section settlement, cleanup, stable glyphs, project-name continuity, image decode failure, locale prefetch, native snapshot acceptance/fallback, persistence, history, no-JS and reduced-motion behavior. Desktop/mobile screenshots and intermediate motion frames were inspected. Physical touch-device feel, production network performance and deployment are not established by these checks.

The 3 November implementation passed 271 browser assertions, but owner feedback showed that passing the functional checks did not establish useful visible motion. The decorative-arrival expectations in `library-results.json` are superseded by the 4 November `content-motion-results.json` and its before/during/after observations of real components. The earlier world, picker, locale and image suites remain historical regression evidence. The 3 November rendered inspector at 1440/768/390px used explicit allowances for the established palette/fluid type, later-phase imagery/video and canvas/nested-scroll detection limits; it did not automatically inspect every nested chapter.

## Component-motion correction — 4 November 2026

Owner feedback exposed that the new decoration was the only noticeable change and had no clear meaning. The correction uses real content entrances instead of low-opacity decorative planes. Titles provide a fixed reading anchor. Static section attributes prepare content before it enters the viewport; Motion opens supporting regions after scroll settlement. Preparation does not mutate React's server-rendered attributes. An already visible destination is left visible during reversal. Contact fades its actual actions and professional profiles, with no arrival circle.

The focused browser suite passes 137 checks across EN/ID at 1440/390px: preparation, settled real-component reveals, stationary titles, cleanup, reversal, keyboard, direct hashes, resize, reduced motion and simulated native touch. Seven additional checks deliberately delay React loading: the first preview still opens, hydration has no mismatch/exception, selection and the identity handoff remain usable, and no mask or animation survives completion. That delayed run exposed a fallback element becoming `display:none` before its animation promise settled; cleanup now has an authored-lifetime deadline and restores original inline properties as well as cancelling effects. The final build reports zero errors/warnings/hints, the 13 unit tests and 109 static assertions pass, and scoped source lint is clean. Intermediate desktop/mobile frames are in ignored `.taste-skill/content-motion/`; supporting content is visibly opening rather than a separate background shape flashing. These checks establish behavior, not that the owner's visual preference has been satisfied.

The subsequent owner correction makes arrival a first-visit welcome per section, remembered for the tab session. Returning through scroll, links, history, reload or another locale never masks already-read content. Keyboard/direct/reduced-motion visits count as seen; an interrupted started welcome is not replayed, while a cancelled navigation to an unreached section does not consume it. A focused suite passes 56 checks covering first versus repeated visits, reload, ID/EN, keyboard, interruption, cancelled preparation and blocked-storage fallback. Build/typecheck, 13 unit tests and 109 output assertions pass. Earlier multi-profile entrance tests require fresh visit state per independent scenario.

## Code quality review — 4 November 2026

Reviewed the complete pending library/content pass and its subsequent motion corrections. The following findings are resolved:

- The installed Motion hook retains its initial reduced-motion value, and the imperative preview effect also returned early on preference-only changes. The picker now uses a live `useSyncExternalStore` subscription, updates its Motion policy, and cancels a running mask immediately when motion is reduced or a project is restored externally. Cancellation/unmount clear playback ownership.
- A malformed percent-encoded hash could throw during startup before controls, navigation and artwork were initialized. Safe fragment decoding now handles malformed values as unknown anchors. Bootstrap, runtime and professional navigation share the canonical chapter IDs/aliases, including valid encoded anchors.
- Image preparation cached every viewport-specific key indefinitely. The cache is now capped at 16 entries with least-recently-used eviction and retry after failure. An older evicted failure cannot delete a newer pending preparation with the same key.
- Collection project order could diverge from the runtime's chapter/picker indices. Build-time validation now rejects missing, duplicate, unknown or reordered project IDs with an actionable message referencing the canonical navigation list.
- Section settlement ignores nested scroll-completion events, and the project handoff invokes navigation once even if effect setup fails. The picker and new motion/data modules are formatted for readable maintenance.

The final build/typecheck has zero errors, warnings and hints; 21 unit tests and 109 static-output checks pass. Fresh browser suites pass 171 assertions: 23 review regressions, 59 picker, 56 first-visit/return, 21 locale/loading and 12 interruption/fallback. Tests include live preference changes during a reveal, external project restoration, malformed/encoded fragments, reload, language switching, reduced motion and complete world access. These are local browser checks, not physical-device performance or deployment validation.

Preview runs at `http://127.0.0.1:4173/` after `npm run build` and `npm run preview`. Publishing uses the existing GitHub Actions workflow on pushes to `main`; generated output remains ignored.
