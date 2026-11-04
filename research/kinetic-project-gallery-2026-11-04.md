# Flowing project cards and case-study reader

Direction requested by NurHabib on 4 November 2026: continuously flowing project cards that light up and grow on interaction, then expand into a spacious case study. This replaces both the picker/background-preview composition and project details as consecutive scroll chapters.

## The interaction

- Three project identities repeat seamlessly in a horizontal field. Hover lifts and enlarges the actual card, moves its immediate neighbors aside, and changes its artwork: ORCA's workspace sheets, Ocaty's domain modules, and Oxelot's storage/worker diagram.
- Card reflections use a fixed translucent light texture animated with transform/opacity. The cards and lighting are explicit owner choices, rather than a general card-grid or glow prescription.
- Direct pointer dragging changes the field's motion value; release adds bounded decaying velocity. Horizontal wheel input browses cards, while vertical wheel input keeps the existing section navigation. Touch reserves vertical panning for the browser.
- Automatic movement pauses for hover, keyboard focus, a reader, manual pause, reduced motion, an off-screen section, or a hidden document. Explicit user input remains available.
- A card opens a native modal reader. Its surface grows from the source rectangle and its title travels into the matching case-study title. Supporting text appears during the latter part of the expansion. Closing returns to the actual source card; keyboard entry and reduced motion omit spatial travel.
- The reader has ordinary vertical reading space, complete case sections, a persistent close control, browser history, and keyboard access. No project information is squeezed into a single chapter.

The owner-approved full professional/Crimson Violet world crossing and destination emblems are preserved.

## Composition and content

The professional scroll now contains six sections: landing, overview, projects, experience, working approach, and contact. ORCA, Ocaty, and Oxelot remain the selected projects. Their case-study content includes the earlier verified decisions and the owner-confirmed Ocaty evolution from modular frontend experiments toward the first-release modular monolith approach.

`ProjectArtwork.tsx` is shared between the moving cards and case-study covers. It is server rendered when used by Astro; only the gallery is a hydrated island. This preserves the same project identity during expansion without adding a client runtime to standalone articles.

Each card retains a real URL under `/{language}/projects/{slug}/`. Six EN/ID static pages provide full content without JavaScript or hydration, with canonical URLs, reciprocal language links, and sitemap entries. Old `#project-*` URLs still open the correct reader above the gallery. Existing aliases and project-selection persistence remain supported.

## Motion ownership

- React updates discrete interaction state. Motion values update the track without React renders per frame, following [Motion's motion-value model](https://motion.dev/docs/react-motion-value) and [frame callback API](https://motion.dev/docs/react-use-animation-frame). LazyMotion loads `domAnimation`; the previous `domMax` shared-layout/drag feature bundle is no longer needed because direct dragging updates the motion value itself.
- Card scale and neighbor spacing use full transform strings and springs. Lighting moves through transform/opacity; static texture values are not recalculated each frame.
- Reader motion uses Motion's mini DOM engine. Native [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) owns modal focus behavior and background inertness.
- A revision counter invalidates cancelled animation completions. Escape, Back/Forward, resize, live reduced-motion changes, world/locale navigation, and page hiding have explicit stable outcomes.
- Focus returns after fragment history restoration. Direct links do not depend on a hidden source card. Source visibility and temporary title carriers are cleaned up on completion and interruption.
- Hydration preserves the position already painted in static HTML; a resize preserves the fraction within the repeating cycle. Card mount animation is disabled, and reduced motion uses an explicit identity transform rather than interpolating `none` through a zero scale.

Initial timing choices: hover spring 340ms with 0.12 bounce; expansion 640ms; return 460ms; content opacity 240ms with overlapping delays. These are authored expressive timings for this interaction, not universal UX thresholds. The continuous field uses linear progression and user-controlled inertial decay. Existing motion/easing tokens remain the shared source.

## Maintenance

Main files: `WorkPicker.tsx`, `ProjectArtwork.tsx`, `ProjectReader.astro`, `ProjectStory.astro`, `project-reader.ts`, and `project-gallery.css`. The old scroll-linked `project-transfer.ts` and picker/case-panel CSS were removed. The project content schema and static case-study data remain shared. Build verification now checks six scrolling chapters, a native reader, six complete standalone case-study pages, one gallery island, and unchanged creator markup.

The source is formatted using available local tooling; no new package or lockfile dependency was introduced. Publishing continues through the existing GitHub Actions build of `dist/`.

## Verification boundaries

The final build/typecheck reports zero errors, warnings, or hints. All 22 existing unit tests and 133 static build checks pass. Local browser suites pass 127 gallery/reader assertions and 26 mouse/touch/focus/navigation assertions across EN/ID at 1440, 768, 390, and 320 CSS pixels. They cover automatic movement and pause, actual card scaling/reflections, source-card restoration, background scroll isolation, complete case content, forward/back interruption, Escape during expansion, resize during closure, legacy project hashes, live reduced motion, keyboard browsing, native modal background exclusion, and six no-JavaScript case-study routes.

Closed, hovered, opening, and reading frames were inspected. The scoped rendered inspector reports no failures with explicit allowances for the requested card/light treatment, existing palette/media scope, and closed-dialog detection limits. Its global font-count warning includes the separate covers, diagram lettering, and existing section type roles; the visible gallery uses a smaller set of functional text roles. Its small domain-label contrast warning prompted a darker blue module surface, also keeping the module distinct from the expanded cover. Source lint and formatting checks pass. Browser artifacts are in ignored `.taste-skill/gallery*` directories.

Build/typecheck, static output, local browser interaction, and rendered screenshots are separate evidence. Browser touch emulation is not a physical-phone test. A passed functional suite does not establish production FPS, battery use, SEO rankings, deployment, or whether the owner prefers the final feel. The running preview is intended for that final feel check.
