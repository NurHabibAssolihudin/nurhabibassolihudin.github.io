# Phase 1 verification — 29 October 2026

Implementation branch: `migration/professional-phase-1`. Baseline: merged `7577aa0`. Local production preview: `http://127.0.0.1:4173/id/` from `dist/`. The original verification was local; the owner subsequently authorized commit/push to main. Pages publishing cutover is separate.

## Scope

Astro + React + TypeScript + Motion mini. Nine professional sections, selectable work with real background previews, project details and owner-confirmed contributions, employment, working approach and relaxed functional contact. EN/ID, theme and complete creator-world crossing remain. No new images, portraits, lounge scene or Chrimson Violet redesign are included.

Owner-confirmed facts: Ocaty, ORCA and Oxelot are personal projects, including branding, planning, code, deployment and marketing. R&D Developer at PT Semesta Teknologi Informatika for more than one year. No dates, company duties, metrics or business results were invented.

The original phase-1 results below describe the first implementation. The subsequent mobile/navigation revision removes the pager and its reserved space; see the revision record at the end.

## Reproducible build checks

- `npm run build`: Astro typecheck, 11 source files, zero errors/warnings/hints; three static routes emitted.
- `npm test`: three language-preference tests pass.
- `npm run verify:build`: 83 assertions pass, covering complete static sections, anchor destinations, referenced build assets, metadata and creator preservation. Normalized creator markup hashes for **both languages** match the merged baseline. Line endings are normalized for Windows/Linux.
- `.github/workflows/validate.yml` runs installation, build, unit tests and static validation. This workflow has not been run on GitHub and does not deploy.

## Browser coverage

Installed Chrome via the design skill's isolated headless CDP helper; actual in-app browser inspected separately. Local scripts and JSON evidence are in ignored `.taste-skill/phase1-qa.mjs`, `phase1-qa-results.json`, `phase1-fallback.mjs` and `phase1-fallback-results.json`.

Final result: 58/58 main browser checks and 13/13 fallback checks pass.

Main checks cover EN/ID at 1440×900, 768×900, 390×844 and 320×844; hydration, horizontal overflow, viewport fit or readable flow, artwork initialization, selected-project background/description, detail navigation, return selection, browser Back, language context, small wheel movement, deliberate wheel navigation, keyboard, both crossing directions, reduced motion, short screens, stationary touch, touch swipe, momentum and uncaught exceptions. The professional background becomes static outside the landing view. Short-screen navigation reserves its own space below the reading area.

Fallback checks cover no JavaScript, WebGL unavailable, Canvas unavailable, storage denied, root browser-language detection and honest neutral Oxelot background. Both complete worlds remain readable without JavaScript, with direct links to every project. Canvas failure retains the SVG artwork and immediate complete-world switching.

Emulated touch uses explicit touchstart/move/end events. This is not proof of physical Android/iPhone behavior. Physical trackpad, Safari, zoom/browser UI changes and mobile frame-time measurements remain manual follow-up checks. External project destinations were preserved; these local tests do not establish their current uptime or authentication behavior.

## Visual review

Direction is the owner's established graphite/bone/cobalt sculptural poster identity, with existing Bricolage/Manrope and original orbital fleets. No new gallery direction, artwork, stock imagery or video was introduced. The two contrasting orbital scenes are the doorway between the person's professional and creative practice. The live things are the planet crossing and project selector.

Screenshots were examined at desktop, tablet and phone widths, including each section, project details, light/dark contact and the creator round trip. Fixes from review: full-section preview placement, simpler functional section headings, preserved artwork selectors after migration, wheel intent/momentum behavior, and separate bottom navigation on short views.

The general design inspector needs four scoped exceptions:

- `eyebrow`: its remaining finding is the functional instruction “Pilih pekerjaan, lalu lihat ceritanya.” before a project title after controls in document order. Decorative pre-heading labels were removed.
- `numbering`: 01/09 is the actual current/total section indicator inside navigation.
- `few-pictures`: the owner explicitly put new imagery in phase 2; phase 1 uses the existing screenshots and canvas/SVG artwork.
- `still-page`: the inspector scrolls the window and counts DOM transforms; this experience scrolls an internal section container and renders its portal/background in canvas. Interaction tests verify entrances and world transitions directly.

The scoped visual gate reports 0 failures and 4 warnings (before the final caption-bound and field-pause fixes, verified in the final browser suite).

Remaining style warnings: the retained bone palette, fluid type sizes across nine sections, absent footage (phase boundary), and deliberate horizontal mobile project picker (with previous/next controls). They are not claims of universal inspector approval. Evidence: `.taste-skill/phase1-gate/report.json` and responsive screenshots.

ROUND 1
Seen in one second: greeting and blue orbital planet.
Idea (one sentence): the two contrasting fleets connect Nur's software practice and creative world.
Live thing: select a real project preview or cross to the creator world.
Layout words by section: hero=split / summary=scope / work=index-preview / details=case split / experience=role split / approach=ordered text / contact=quiet invitation.
Scores: design 6.5 · usability 8 · creativity 7 · content 7 → overall 7.1.
Caps applied: fewer than four real pictures; phase 2 imagery remains intentionally pending.
Top three problems: supporting professional sections remain primarily typographic (phase 2 imagery); 428×668 navigation initially covered content (fixed with a dedicated navigation area); work previews initially occupied only the content rectangle (fixed to full-section coverage).

ROUND 2
Seen in one second: greeting/planet, or a clearly selected project when entering work directly.
Idea and live thing: unchanged, with functional navigation and preserved complete worlds.
Scores: design 6.5 · usability 8 · creativity 7 · content 7 → overall 7.1.
Caps applied: phase 2 imagery is still pending. This is an internal critique, not an external award or user evaluation.
Remaining limits: professional supporting sections need imagery before judging final visual identity; contact is functional and quiet, without the future lounge scene. Physical-device gesture/performance verification remains open.

## Performance boundaries

Motion mini replaced the larger hybrid animation import: the professional UI bundle fell from about 88KB to about 30KB before compression. Emitted React/UI framework chunks total about 79KB gzip, excluding the small inline runtime and preserved renderers. The earlier 60KB critical-JS ambition is not met. No claim of optimal mobile performance is made. The planet renderer pauses when off screen; the professional point field stops continuous animation outside the hero. Existing creator rendering behavior remains.

The generated public allowlist omits unused 2.7MB background artwork and the unused ORCA screenshot. Source assets remain in the repository. Build output no longer includes source prompts or stale root-generated HTML. Do not publish the repository root as the new site; deployment cutover must upload `dist/`.

## Revision — remove presentation controls and compact mobile navigation

Owner request on 29 October: the portfolio must not present itself as a slideshow. Removed the section counter, previous/next section controls, project picker pagination controls, and all reserved bottom navigation space. Panels use balanced content insets. Existing content links, scrolling, touch and keyboard navigation remain.

At widths up to 700px, only one 44px dropdown trigger is shown in the top-right corner. The header is an overlay and reserves no vertical row; professional content uses the full viewport height. Language, theme and world crossing are available inside the dropdown. Escape dismisses it and restores focus to the trigger; clicking outside or choosing a section closes it. Without JavaScript, mobile navigation links remain visible in normal flow.

Current validation: build/typecheck succeeds with zero diagnostics, three language unit tests and 83 static build checks pass. `.taste-skill/no-ppt-qa.mjs` passes 54/54 assertions across EN/ID at 320, 390, 428, 768 and 1440px, including the absence of pagination, full mobile viewport use, menu controls, theme, Escape focus, section/language context, desktop header preservation and both world-crossing directions. The 13 fallback checks also pass again. No uncaught browser exceptions were recorded. Screenshots: `.taste-skill/no-ppt-ocaty-390.jpg`, `no-ppt-mobile-menu.jpg`, and the corresponding width variants. Previous phase-1 pager tests and the numbering inspector allowance describe the superseded interface.

The existing in-app tab could be listed but the browser connector could not acquire it for reload (`browser.user` unavailable). Visual and interaction verification used an isolated local Chrome session; the existing preview server continues to serve the updated `dist/` output. Refresh the open preview to load the revision.

## Revision — stable section text after navigation

The owner reported a short text vibration after moving between sections. A frame sample reproduced a second animation after scroll settling: `transform: none → translateY(10px) → translateY(0)` and `opacity: 1 → 0.75 → 1`. This was the staggered entrance in `Professional.tsx`, separate from the section's scroll movement.

Removed that entrance, its Motion mini import/animation cleanup, and unused `data-enter` hooks. Section settling now updates only section/project/navigation state. No replacement wave effect was added. Existing scrolling, content actions and the world-crossing animation remain.

Build/typecheck and 83 static build assertions pass. `.taste-skill/text-stable-qa.mjs` passes 17/17 checks across EN/ID at 390 and 1440px. Each ORCA/Ocaty navigation was sampled for 1.25 seconds: heading, lead and detail blocks retained `transform: none`, opacity 1, and zero relative movement inside their section. No uncaught browser exceptions were observed. Evidence: `.taste-skill/text-stable-results.json`; screenshots `text-stable-390.jpg` and `text-stable-1440.jpg`.

## Revision — immediate wheel direction reversal

The owner reported that reversing scroll direction sometimes did nothing until the cursor was moved. Reproduced at a fixed pointer position: from `#work`, a down wheel command followed 100ms later by up still landed on `#project-orca`.

Cause: the momentum lock returned before inspecting the new event's direction, discarding intentional reverse input along with same-direction momentum. The lock also used only the last settled section, which would skip a section if reversal were enabled during an unfinished smooth scroll.

The handler now checks direction before suppressing locked events. Intentional opposite input can retarget immediately, relative to the requested destination. Small opposite noise is still rejected; same-direction tails still cannot queue extra sections. Links, keyboard navigation, browser history and world switches reset stale wheel state.

Build/typecheck, 83 static build checks and three language tests pass. `.taste-skill/wheel-reversal-qa.mjs` passes 30/30 native-wheel checks across EN/ID at 390 and 1440px: both reversal directions at 80ms and 480ms with a stationary pointer, same-direction momentum, tiny opposite noise, accumulated trackpad reversal, rapid down/up/down, both document boundaries and a fresh same-direction gesture after idle. No uncaught browser exceptions were recorded. Evidence: `.taste-skill/wheel-reversal-results.json` and `wheel-reversal-fixed-mobile.jpg`. Physical mouse/trackpad verification by the owner remains distinct from this automated browser coverage.

## Revision — repeat scrolling in the same direction

The previous reversal fix left a rolling lock that required both an expired 650ms timer and 180ms without wheel input. Rejected events updated the idle timestamp, so a sustained series of same-direction wheel steps could remain suppressed indefinitely. Reproduced: eight 120px down steps 120ms apart still advanced only from work to ORCA.

Replaced the rolling lock with `src/lib/wheel-navigation.ts`. Fresh discrete input, renewed pushes and steady deliberate input are distinguished from small nudges/decaying tails. During a movement, at most one same-direction follow-up is retained. It starts when the requested section actually arrives; deliberate reversal cancels it and retargets immediately. Explicit navigation clears pending state. Fine steady input can resume after arrival without requiring opposite input. This supersedes the historical timeout-lock behavior described above.

Portable regression coverage is in `scripts/wheel-navigation.test.mjs`: repeated same-direction input, rapid equal detents, steady/fine trackpad input, bounded pending commands, no fixed cooldown, decaying tails, renewed pushes, reverse cancellation, noise and state reset. All 16 tests including the three language tests pass; build/typecheck has zero diagnostics and the 83 static build checks pass.

Native-browser coverage: 26 repeated-scroll checks across EN/ID at 390/1440px, including down/down and up/up at 120/400ms plus 30/800ms cadence cases, continuous input, pending cancellation, explicit navigation and reduced motion. The 30 reversal/momentum checks also pass again. After refining fine-input continuation, the final focused browser suite rechecks fine steady movement, decaying momentum and 30ms repeated detents at both widths. Local evidence: `.taste-skill/repeat-scroll-results.json`, `wheel-reversal-results.json`, and `steady-scroll-final-results.json`. These are automated browser checks, not a physical-device performance certification.

Input timing uses the wheel event timestamp, rather than handler execution time. A diagnostic captured a 102ms event interval processed 148ms apart during rendering; using processing time had incorrectly classified that decaying tail as a fresh gesture. An irregular-interval regression and focused native-browser checks cover the correction.

Final focused browser results: 7/7 checks pass for fine sustained input, decaying momentum and fast repeated detents, across 390/1440px. The revised interaction has no fixed cooldown that must expire before another intentional same-direction command is accepted. One retained follow-up is the maximum; it is cleared by explicit navigation or reversal.

## Revision — one gesture must not replay into another section

Owner feedback exposed a flaw in the retained follow-up: one fast burst (three 120px events about 30ms apart) from work reached Ocaty, passing ORCA without another user action. The previous tests explicitly expected a second movement from input received during the first transition; that expectation was incorrect for the intended one-gesture/one-section experience.

Removed pending commands entirely. `arrive()` now only clears the active target and cannot return another destination; the component no longer starts navigation from settlement. Same-direction events during movement are discarded. Fast repeated equal deltas and steady fine input remain one gesture even if their tail extends past arrival. A fresh same-direction gesture after settling still works; deliberate reversal can still interrupt immediately. Native touch behavior is unchanged.

Replaced the obsolete queue tests with regressions for no replay, no automatic movement on arrival, same-direction continuation after settling, burst tails across arrival, fine trackpad gestures, renewed input, reversal, noise and reset. All 13 unit tests (including three language tests), build/typecheck and 83 static build assertions pass.

`.taste-skill/single-gesture-qa.mjs` passes 30/30 native-browser checks in EN/ID at 390/1440px: burst up/down advances once; waiting without input cannot advance again; a new burst can advance again in the same direction; sustained fast/fine bursts and decaying momentum do not skip; reduced motion also stays at one section per burst. Explicit CDP event timestamps preserve the intended input cadence independently of driver/rendering delay. The 30 reversal/momentum checks also pass again. A 428×668 layout inspection confirms full section navigation is active and all professional sections fit (flow fallback is false).

Evidence: `.taste-skill/single-gesture-results.json`, `wheel-reversal-results.json`, and `single-gesture-fixed-mobile.jpg`. The earlier repeated-input/queue reports above describe superseded behavior. Physical input verification remains distinct from automated browser coverage.

## Optimization pass — 29 October 2026

Completed font, startup, CSS, navigation geometry and canvas optimizations. Current implementation and measurements are documented in `OPTIMIZATION-REPORT.md`. The professional sections are now static Astro markup; only the work picker hydrates with React, when needed. Measurement no longer routes through readHash. The previously corrected gesture no-queue/reversal policy is unchanged and its browser regressions pass again. No new artwork, phase-2 imagery, Chrimson Violet redesign or publication is included.

Current checks: 13 unit tests, 102 static build assertions, 144 existing browser assertions and 23 optimization-specific assertions pass. The last cold-start check confirms no React/client/WorkPicker requests until work approaches visibility, and only the active orbital renderer is initialized. Current EN/ID glyph coverage and retained advances match the original fonts. See the optimization report for the exact byte-count definitions and physical-device limitations.

## Revision — keep selected work independent from scroll position

Reproduced the owner report: selecting Ocaty in work and scrolling down to ORCA changed the preview/session choice from Ocaty to ORCA. Scrolling up did not encounter another project, which explains the directional difference.

Removed preview updates from section settlement. Scroll/keyboard navigation now changes only the active reading section. Existing selection also wins over reload/history hashes; a direct project URL may seed a picker only if no existing choice was restored. Explicit project selection/detail-link actions remain functional.

Build/typecheck, 102 static build assertions and 13 unit tests pass. `.taste-skill/selection-persistence-qa.mjs` passes 31/31 browser checks in EN/ID at 390/1440px: Ocaty across scroll-up/return and scroll-down-through-ORCA/return, Oxelot across keyboard navigation, matching preview/detail link, session persistence, reload on a different detail, browser Back, explicit detail actions and fresh deep-link seeding. The test waits for the deferred picker to be interactive before clicking it. No uncaught exceptions were observed. Evidence: `.taste-skill/selection-persistence-results.json` and `selection-persistent-1440.jpg`.

## Main delivery and source cleanup

The owner requested commit and push to main, then explicitly chose to remove the obsolete implementation and reconfigure Pages themselves. Root/en/id HTML snapshots, the old page controller/build scripts and unused discipline scenes are removed. Active artwork/styles now live under src/; four focused shared templates replace the monolithic page template, and unused translations are pruned. Build output remains dist/; CI uploads it as portfolio-dist without changing Pages settings or deploying.

After cleanup, build/typecheck reports 22 files with zero errors, warnings or hints; all 13 unit tests and 102 static build checks pass. Both creator markup hashes still match the merged baseline. Fresh production-preview browser runs pass 54 navigation/mobile/world checks and 31 selection-persistence checks. The browser runs were completed after the build finished writing dist/.
