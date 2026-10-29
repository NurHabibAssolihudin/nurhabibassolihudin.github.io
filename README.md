# NurHabib portfolio

Bilingual portfolio built with Astro, React and TypeScript. Motion remains installed for future choreography; the current section navigation needs no animation-library runtime. Astro generates readable static HTML at `/`, `/en/` and `/id/`; GitHub Pages can serve the contents of `dist/` without a running application server.

```sh
npm ci
npm run dev          # source preview: http://127.0.0.1:4173
npm run build        # typecheck + static dist/
npm run preview      # inspect dist/ at the same address; stop dev first
npm test             # language preference and gesture regression tests
npm run verify:build # validate emitted content, links/assets and preserved creator
```

Node 24 is used for local verification and CI. Dependencies are pinned by `package-lock.json`. `.github/workflows/build.yml` builds and checks every push to `main` and pull request targeting `main`. The workflow can also be run manually. Successful runs save `dist/` as the downloadable `portfolio-dist` artifact for 14 days. Generated output is ignored by Git; this workflow does not publish the site.

## Editing

- `src/components/Professional.astro`, `Panel.astro`: static professional sections.
- `src/components/WorkPicker.tsx`: the only hydrated React island; loads near the selected-work section.
- `src/lib/professional-navigation.ts`: cached section geometry, anchors, keyboard, history and gesture wiring.
- `src/lib/wheel-navigation.ts`: tested gesture intent handling, with no queued movements.
- `src/data/professional.ts`: typed English/Indonesian copy and project facts. `src/data/navigation.ts` keeps lightweight section IDs out of the content bundle.
- `src/styles/professional.css`: professional layout and responsive behavior.
- `src/layouts/Portfolio.astro`, `src/pages/`: shared static layout, locale routes and metadata.
- `src/lib/runtime.ts`: shared language, theme, menu and complete world switching.
- `templates/{creator,header,footer,planet}.html`, `locales/id.json`: retained world markup and its used translations, assembled by `src/lib/world-markup.ts`.
- `src/artwork/`: field, orbital objects and world crossing. `src/lib/creator-interactions.js` owns creator interactions. `scripts/prepare-public.mjs` copies these scripts and the shared styles from `src/styles/` into generated `public/` using an explicit allowlist.

The professional world has nine sections: landing, overview, selected work, ORCA, Ocaty, Oxelot, experience, working approach and contact. Selection changes the real background preview and description; the detail action opens the matching section. Returning preserves selection. Passive scrolling through project detail sections never changes the chosen preview. A fresh direct project link seeds an empty picker; an existing manual choice survives reload/history. Old `#platforms`, `#stack` and `#about` links resolve to their new destinations.

Touch uses native CSS Scroll Snap. A wheel adapter rejects small movements and decaying momentum while accepting fresh or continuing intentional input. Same-direction input during a movement is discarded, never queued or replayed at arrival. A new gesture after the section settles can advance again in the same direction. A single fast burst and its momentum cannot automatically start another section. Deliberate reversal can interrupt the current section movement immediately, using its requested destination to avoid skipping a section. Keyboard, content links and the main menu provide direct navigation. There is no slide counter or previous/next section bar. On mobile (up to 700px), a single floating dropdown trigger replaces the header strip, with language/theme controls inside the menu; content uses the full viewport height. Short/zoomed viewports use ordinary reading flow with proximity snapping so content is not clipped. Reduced motion uses immediate navigation. Without JavaScript the entire content of both worlds stays in document flow and project detail links remain available.

The complete builder/creator switch remains essential. The creator's content, name **alimagine**, mothership, flaming skull orbiters and dotted-cover/circular-opening transition are preserved. Canvas rendering starts independently of React, initializes only the visited orbital scenes, pauses off screen and freezes during crossings; existing static fallbacks remain available. No new artwork is included in phase 1. Phase 2 adds professional imagery and the lounge/tea-table contact setting; phase 3 develops **Chrimson Violet**.

Automatic language selection at root: explicit query, saved manual choice, first supported browser preference, then English. Explicit locale routes never auto-redirect. Language links preserve section and world. No IP lookup, GPS or geolocation provider is used. Fonts are self-hosted. Storage preferences are optional; controls continue when storage access is denied.

See `MIGRATION-BRIEF.md`, `MIGRATION-PHASES.md` and `QA-PHASE-1.md` for scope, facts and validation. The npm commands above use Astro. Preview/build success does not imply commit, push or deployment.

## Asset and startup optimization

The existing self-hosted fonts are served as WOFF2: 40,024 bytes combined versus 177,304 bytes of original TTF. Original sources and OFL licenses remain in `assets/fonts/`. `scripts/optimize-fonts.py` regenerates the assets with optional fonttools/Brotli tooling; npm builds need only the generated WOFF2 files. Retained character widths and the current EN/ID glyph coverage were verified.

The initial view uses static Astro markup and a lightweight navigation controller. React loads only as work approaches the viewport (400px observer margin). A pre-hydration project-link fallback remains usable. The first layout is established before visibility observation so the island does not accidentally load from temporary fallback geometry. Planet/background/transition scripts load in parallel, and creator interactions load on demand or warm on portal hover/focus. No legacy `scenes.css` or TTF files are copied into `dist/`. See `OPTIMIZATION-REPORT.md` for before/after measurements and verification limits.

## Main delivery and Pages cutover

The owner requested commit and push to main and explicitly chose to remove the obsolete site rather than retain a second implementation. Root/en/id HTML snapshots, the old page controller/build scripts and unused discipline scenes are removed. Astro routes in `src/pages/` emit the site exclusively into ignored `dist/`. Active artwork, styles and creator interactions live under `src/`; shared templates contain only retained markup.

Pushes to `main` install locked dependencies with `npm ci`, run the build/typecheck, unit tests and static-output checks, then save `dist/` as `portfolio-dist` in the workflow run's Artifacts area. The runner's `dist/` directory is temporary and Pages cannot automatically read it. Publishing requires a separate Pages deployment step and the **GitHub Actions** publishing source, or compiled files committed to a branch's root or `/docs` publishing folder. A `/dist` folder is not a selectable branch publishing source. The owner will configure publishing separately; this workflow has only read access to repository contents and no Pages deployment job.
