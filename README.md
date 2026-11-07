# NurHabib portfolio

Bilingual portfolio built with Astro, React, TypeScript and Motion. Motion orchestrates world crossing, an interactive flowing project gallery, card-to-reader expansion and the dropdown menu. Section navigation retains its native scroll/gesture controller, and the planetary artwork retains its custom renderers. Astro generates readable static HTML at `/`, `/en/`, `/id/` and bilingual project URLs under `/{language}/projects/{slug}/`; GitHub Pages serves `dist/` without a running application server.

```sh
npm ci
npm run dev          # source preview: http://127.0.0.1:4173
npm run build        # typecheck + static dist/
npm run preview      # inspect dist/ at the same address; stop dev first
npm test             # language, gesture, fragment, image-cache and content-order regressions
npm run verify:build # validate emitted content, links/assets and preserved creator
```

Node 24 is used for local verification and CI. Dependencies are pinned by `package-lock.json`. `.github/workflows/build.yml` builds and checks every push to `main` and pull request targeting `main`. Successful pushes to `main` upload `dist/` as a Pages artifact and publish it in a dependent deployment job. Pull requests only validate. The workflow can also be run manually; publishing is restricted to `main`. Generated output is ignored by Git.

## Editing

- `src/components/Professional.astro`, `Panel.astro`: static professional sections.
- `src/components/WorkPicker.tsx`: the professional gallery React island; loads near the selected-work section.
- `src/components/ProjectArtwork.tsx`: shared project illustrations; server rendered in case-study covers and included in the gallery island.
- `src/components/ProjectReader.astro`, `ProjectStory.astro`, `src/lib/project-reader.ts`: native dialog, complete static case studies, and interruptible card expansion with focus/history ownership.
- `src/lib/professional-navigation.ts`: cached section geometry, anchors, keyboard, history and gesture wiring.
- `src/lib/wheel-navigation.ts`: tested gesture intent handling, with no queued movements.
- `src/data/professional.ts`: typed English/Indonesian section copy. `src/content/projects/*.json` contains validated project facts; `src/data/navigation.ts` keeps section IDs out of the content bundle.
- `src/content.config.ts`, `src/lib/project-content.ts`: Astro collection schemas and build-time responsive WebP generation. Project IDs/order must match `src/data/navigation.ts`; mismatches fail the build before routing and picker indices can diverge. Preview props contain only the fields needed by the picker.
- `src/styles/professional.css`, `project-gallery.css`: professional layout, gallery, reader and standalone case-study layouts.
- `src/layouts/Portfolio.astro`, `src/pages/`: shared static layout, locale routes and metadata.
- `src/lib/runtime.ts`: shared language, theme, menu and complete world switching.
- `src/artwork/planet-transit.ts`: lazy-loaded Motion crossing, retaining the original destination emblems.
- `src/lib/menu-motion.ts`, `motion-settings.ts`: interruptible dropdown motion and the shared CSS easing tokens.
- `src/lib/use-reduced-motion.ts`, `url-fragment.ts`, `project-images.ts`: live OS motion preference, safe fragment decoding and bounded image preparation with retry.
- `src/lib/chapter-motion.ts`: finite, first-visit section arrivals. The earlier scroll-linked project-name handoff has been replaced by card expansion.
- `src/components/Creator.astro`, `CreatorPortal.astro`, `src/data/creator.ts`, `src/content/games/*.json`: typed bilingual creator components and validated game content. The earlier creator HTML template has been replaced; build snapshots guard the same content, structure and links.
- `templates/{header,footer,planet}.html`, `locales/id.json`: small shared markup templates and only their used translations, assembled by `src/lib/world-markup.ts`.
- `src/artwork/`: field, orbital objects and world crossing. `src/lib/creator-interactions.js` owns creator interactions. `scripts/prepare-public.mjs` copies the continuous renderers, creator interactions and shared styles into generated `public/` using an explicit allowlist. Vite bundles the TypeScript Motion transition separately.

The professional world has six scrolling sections: landing, overview, projects, experience, working approach and contact. Project cards flow continuously, pause for interaction, respond to hover/focus, and support direct dragging. Opening a card expands it into a native modal reader with its complete case study; closing restores the source card and URL. Project details are no longer scrolling chapters. Explicit project choices persist; ordinary section navigation does not change them. Legacy `#project-orca`, `#project-ocaty` and `#project-oxelot` hashes open the corresponding reader above the gallery. Old `#platforms`, `#stack` and `#about` links retain their aliases.

Touch uses native CSS Scroll Snap. A wheel adapter rejects small movements and decaying momentum while accepting fresh or continuing intentional input. Same-direction input during a movement is discarded, never queued or replayed at arrival. A new gesture after the section settles can advance again in the same direction. A single fast burst and its momentum cannot automatically start another section. Deliberate reversal can interrupt the current section movement immediately, using its requested destination to avoid skipping a section. Keyboard, content links and the main menu provide direct navigation. There is no slide counter or previous/next section bar. On mobile (up to 700px), a single floating dropdown trigger replaces the header strip, with language/theme controls inside the menu; content uses the full viewport height. On short/zoomed viewports, only sections whose content needs more room grow beyond one viewport. Their content can be read before continuing to the next section; all other sections retain the same navigation. A long translation never disables navigation for the entire page. Reduced motion uses immediate navigation. Without JavaScript, the professional content stays in document flow and project detail links remain available. The hidden game world is not exposed by this fallback.

The complete builder/creator switch remains essential. The professional world has no game/studio promotion or planet caption; its planet quietly retains the entry interaction. An explicit return action is available only inside the creator world. Employment is presented as work experience separately from personal projects. Professional links use text without decorative arrows. The creator is now named **Crimson Violet**. Its content, mothership and flaming skull orbiters are preserved. The Motion crossing retains the destination emblems, with a layered circular cover, readable signature hold and radial opening. Canvas rendering starts independently of React, initializes only the visited orbital scenes, pauses off screen and freezes during crossings; existing static fallbacks remain available. No new artwork is included in phase 1. Phase 2 adds professional imagery and the lounge/tea-table contact setting; phase 3 develops **Crimson Violet**.

Automatic language selection at root: explicit query, saved manual choice, first supported browser preference, then English. Explicit locale routes never auto-redirect. Language links preserve section and world. No IP lookup, GPS or geolocation provider is used. Fonts are self-hosted. Storage preferences are optional; controls continue when storage access is denied.

See `MIGRATION-BRIEF.md`, `MIGRATION-PHASES.md` and `QA-PHASE-1.md` for scope, facts and validation. The npm commands above use Astro. Preview/build success does not imply commit, push or deployment.

## Asset and startup optimization

The existing self-hosted fonts are served as WOFF2: 40,024 bytes combined versus 177,304 bytes of original TTF. Original sources and OFL licenses remain in `assets/fonts/`. `scripts/optimize-fonts.py` regenerates the assets with optional fonttools/Brotli tooling; npm builds need only the generated WOFF2 files. Retained character widths and the current EN/ID glyph coverage were verified.

The initial view uses static Astro markup and a lightweight navigation controller with Motion's mini DOM engine for the menu. React loads only as work approaches the viewport (400px observer margin). A pre-hydration project-link fallback remains usable. The first layout is established before visibility observation so the island does not accidentally load from temporary fallback geometry. Planet/background scripts load in parallel. The world transition and creator interactions load on demand or warm on portal hover/focus. No legacy `scenes.css` or TTF files are copied into `dist/`. See `OPTIMIZATION-REPORT.md` for measurements and verification limits.

The gallery uses `m`, asynchronous `LazyMotion`, motion values and a frame clock for flowing/dragged cards without React renders per frame. Motion's mini DOM engine expands the source surface and carries its title into the reader. Native `<dialog>` supplies modal focus containment and background inertness. Pointer interaction, focus, reader state, off-screen visibility, document visibility and live reduced-motion settings control movement. Holding a finger stops automatic travel; horizontal dragging follows that finger without treating the card's implicit capture transfer as a cancelled gesture. Vertical gestures retain native section scrolling. There is no separate movement toggle. Card links retain real standalone URLs for no-JS, new-tab and direct access. These pages contain the complete case study without hydration and have canonical/alternate metadata and sitemap entries. Existing screenshots are generated as responsive WebP variants during build.

The professional contact section includes a native HTML form and a licensed photograph of two chairs in afternoon light. Astro builds responsive local WebP images; attribution and license provenance live in `assets/contact-afternoon.LICENSE.md`. Two contact islands hydrate near the viewport: React Bits rotating text with its plain CSS, and a Motion status button. The fields, validation and live status remain native HTML. Set the public Actions variable `PUBLIC_CONTACT_ENDPOINT` to connect the form to the separately hosted service described in [server/contact/README.md](server/contact/README.md). It supports the owner's Mailgun or Brevo account, with credentials kept only on that server. With no endpoint configured, the form reports its unavailable state and preserves the email fallback. A success state requires an affirmative API response; errors retain the draft. Native validation, pending state, and a live status region are shared by EN/ID. Mobile may use ordinary section scrolling to keep the photograph and form readable.

Section travel is driven by Motion over the scroll position (1,020 ms), while first-visit content enters during travel (960 ms with a short stagger). The existing wheel intent/momentum controller remains responsible for one gesture per section; touch retains native Scroll Snap. Each section gets this welcome only on its first visit in the current page load. Returning within the page is immediate; refreshing starts a new visit. Contact actions/profiles retain a calm fade. The full builder/Crimson Violet world switch and its destination emblems are preserved.

Locale links use Astro hover prefetch and progressive native cross-document View Transitions, without a client router. Theme, world, hash and project choice persist. If a project island or creator scene is not initialized when a snapshot would be captured, the transition is skipped instead of freezing an incorrect initial view. Browsers without this API use normal links. See `LIBRARY-UPGRADE.md` for the six changes and their validation.

## Main delivery and Pages cutover

The owner requested commit and push to main and explicitly chose to remove the obsolete site rather than retain a second implementation. Root/en/id HTML snapshots, the old page controller/build scripts and unused discipline scenes are removed. Astro routes in `src/pages/` emit the site exclusively into ignored `dist/`. Active artwork, styles and creator interactions live under `src/`; shared templates contain only retained markup.

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Pushes to `main` install locked dependencies with `npm ci`, run the build/typecheck, unit tests and static-output checks, then upload `dist/` using `actions/upload-pages-artifact`. A dependent job publishes the artifact using `actions/deploy-pages`, the `github-pages` environment and the built-in `GITHUB_TOKEN`. Only that deployment job has Pages write and OIDC permissions; no personal access token is needed.

The runner's `dist/` directory is temporary and Pages cannot automatically read it. The output is intentionally absent from the repository. The **Deploy from a branch** publishing mode only supports `/` or `/docs`, not `/dist`; it also starts the old Jekyll workflow, which does not build this Astro project. Switching the publishing source to **GitHub Actions** replaces that branch-based publishing path. The build-only workflow delivered in `d45d2ed` successfully produced the downloadable `portfolio-dist` artifact but did not publish it.


## Shared interface motion

Motion also controls the active navigation underline, staggered mobile menu and burger, interruptible theme palette/icon changes, button press feedback, card artwork/light layers, and creator accordion/tool feedback/heading entries. `src/lib/interface-motion.ts` enhances static Astro controls without extra React islands. Canvas/WebGL artwork and native dialog/scroll semantics remain specialized. See `research/motion-integration-2026-11-05.md` for the ownership boundaries and source references.

## Crimson Violet

The creative world is an independent cinematic/poster composition, implemented in one deferred React island under src/components/crimson/. Official React Bits BlurText and ScrollVelocity provide the wordmark and scroll-reactive ribbon. Motion owns poster/dialog/process/contact choreography. Original SVG visual studies are labelled as concept art, not game screenshots; the contact scene is original artwork, not a film clip. World-switch emblems and the professional experience remain intact. Contact uses the same accounts and an honest mailto-draft fallback until an endpoint is configured. See [the redesign record](research/crimson-violet-2026-11-05.md) for source attribution, behavior and verification limits.

### Sendme contact transport

Both contact forms share `src/lib/contact-transport.ts`. Set `PUBLIC_CONTACT_ENDPOINT` and `PUBLIC_CONTACT_TURNSTILE_SITE_KEY` in ignored `.env.local`, then rebuild. Sendme URLs use a fresh Turnstile challenge (`action=sendme`, `cData=formId`) per attempt and retain `_submissionId` for unchanged retries. Register the exact portfolio origin in Sendme and its hostname in the Turnstile widget. Local testing uses `http://localhost:3000`; keep localhost endpoints out of production builds. The public site key is not a secret; private form/provider keys must never be shipped to the browser. Turnstile loads only when a valid form is submitted. See https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/.

Production uses the public endpoint and site key in .env.production; GitHub Actions builds from that file. Both values are public configuration. Use .env.local for local overrides (never secrets in PUBLIC_ variables).
