# Two worlds: orbital fleets

Current local prototype: assertive typography, a clean blue planet with four satellites for the professional world, and a faceted mothership with four flaming skull orbiters for alimagine. The owner rejected the realistic terrain texture and specified these contrasting objects on 27 October. The dotted cover / circular world opening and compact project previews remain. The visual result awaits review.

## Idea and hierarchy

Nur's practice builds both real systems and imaginary worlds. Two contrasting orbital scenes form their common doorway. The complete experience changes when it is activated: identity, navigation, headline, projects, craft, contact and signal colour. This is never a project filter or tab.

The approved brief fixes the direction. The taste-skill draw offered type-only-statement, pinned-poster and name-as-monument; their absence of a hero object, large scrolling pictures, or name-only headline would conflict with this brief. The implementation retains the commissioned sculptural poster composition. No gallery composition overrides the owner.

Hero: two large authored lines in self-hosted Bricolage 800, a dark stage, and an oversized orbital scene. Manrope supports readable project and service copy. Bone white, graphite and an electric blue signal define builder; vermilion replaces the signal in creator. Light/dark selection still controls the content beneath the dark stage. Square actions and aligned text replace the previous soft pills and quiet mineral palette.

Copy describes the work directly: web applications and systems in Builder, games and stories in Creator. Repeated shipping/production claims, the production strip and the manifesto have been removed. Project summaries explain a function; optional technical notes hold implementation details. Ocaty/ORCA use existing screenshots. Tony/Oxelot have simple name treatments instead of staged product interfaces. Contact preserves the real destinations. No metrics, clients or game screenshots are invented.

## Orbital objects

The follow-up adjustment reduces only the blue globe diameter from 348 to 260 scene units (about 25%). Satellite geometry, initial phases and orbit tracks keep their dimensions and positions. Both satellite and skull revolution rates are multiplied by three; flame flicker and mothership drift keep their original timing. Reduced motion still freezes the entire scene. The SVG fallback scales the globe alone by 0.75.

`world-objects.js` replaces the terrain atlas. The professional scene is a clean cobalt sphere with material illumination only: no continents, contour lines, noise or cartographic texture. Four original satellites travel on two differently inclined orbits, passing in front of and behind the planet. The globe's lighting is painted once; the satellite meshes are projected and depth-sorted.

Alimagine has a custom, faceted mothership with swept wings, outboard armour, a raised spine and command island, hangar recesses and warm engine apertures. Four small skulls orbit it, with hollow eyes, a nasal opening and a toothed jaw. Layered red/orange/gold flame shapes rise from each skull, while ember particles follow its orbital wake. This interprets the owner's flaming-skull reference with original drawings rather than a borrowed character asset. No artwork is presented as a game screenshot.

Both scenes share clean graphical materials with the page and its discipline objects. Canvas 2D remains independent of WebGL. Drawing is capped at 24fps and 640px desktop / 400px phone, pauses off screen and in hidden documents, and freezes during the world crossing. A fine pointer slightly adjusts the view. Reduced motion keeps the complete scene and flame shapes static. Unavailable Canvas 2D exposes the corresponding original SVG fallback. No model, texture, library or network service is downloaded. The rejected terrain source is preserved in ignored `.taste-skill/pre-fleet/`.

## World crossing

`planet-transit.js` replaces the old radial glitch renderer. It takes the general Potadot page-navigation sequence as a reference, with our own world-specific emblem, colors and implementation. A disc with a broken dot edge closes over the source world for 650ms; a dotted rendition of the destination object appears at the covered midpoint. Only after the disc becomes opaque does the complete world swap. After a brief covered beat, a circular opening expands from the destination planet over 1050ms. The total is 1810ms. The hero recedes slightly during exit and settles during entry. No loading percentage or artificial network wait is shown.

The particulate front and emblem are painted once at DPR capped at 1.5. Transform/opacity and a circle clip on `#experience` then animate the prepared images and the destination. There is no per-frame full-screen canvas painting, no cloned page and no native View Transition requirement. The source/destination planet and atmospheric field pause while crossing, then resume. Repeated clicks are ignored. Resize, document hiding or a reduced-motion preference change completes and cleans up the transition. Keyboard activation transfers focus to the destination heading; menu activation closes the menu. Reduced motion or an unavailable 2D canvas swaps immediately. The previous sources and unsuccessful shader experiment are preserved in ignored `.taste-skill/pre-portal/`.

The final fleet suite passes 90 assertions across EN/ID at 320/390/768/1440px, including rendered cobalt color, visible flame/metal pixels, nonempty artwork, freeze/resume, both crossing directions, covered swap timing, opening growth, cleanup, caption bounds, keyboard/menu/language navigation, rapid clicks, resize, reduced motion and canvas/WebGL fallbacks. The three language unit tests also pass. The earlier pre-fleet transition benchmark is historical; current physical-phone performance remains unverified.

## Atmospheric field

The 21 October background request uses Velmax's point-field atmosphere as a reference. The implementation is original: one shared fixed canvas, with points bent around the visible main object. Builder has ordered blue current bands; creator has a vermilion spiral flow. A short fine-pointer disturbance disperses and fades rather than replacing the cursor. Headline, copy and core caption have protected areas; project rows reduce field intensity by 82%.

`field.js` draws GPU point sprites at 24fps with DPR capped at 1.5. Geometry measurements run on viewport, scroll, world or theme changes, not each animation frame. During a crossing the field charges, freezes under the opaque dot field, renders the destination explicitly, then settles into its new structure. Reduced motion uses a static field. Without WebGL a static 2D renderer remains; context loss removes the decoration while navigation continues. Hidden documents stop drawing. No network asset or tracking service is added.

The earlier field-specific checks covered palette changes, held frames, responsive widths, reduced motion, static rendering, context loss and no JavaScript. The old radial suite and its performance sample describe the superseded transition; current planet/cover/opening checks live in ignored `.taste-skill/planet-qa.mjs`. Physical-device performance remains unverified.

## Discipline scenes

On 27 October the owner authorized one Potadot-inspired prototype in the Builder discipline section. Three opaque panels stack with the reader's scroll: electric blue platform architecture, a pale AI stage, and a graphite systems stage. These are explanatory scenes, not repeated icon cards. The original SVG objects depict independently separating platform modules, a memory drum with surrounding memory pieces, and a message travelling between service blocks. They are original code drawings, not screenshots of the projects or borrowed Potadot assets.

The composition follows the existing display/text faces and blue/bone/graphite palette. Existing discipline facts and technology lists remain, and project links reach the real Ocaty, Tony and Oxelot articles. The scene title and new captions/links are translated into Indonesian. No random direction draw is needed for this single section within the authorized art direction.

`scenes.css` owns the figures and transform/opacity motion; `scenes.js` measures three panel positions only on scroll/resize/state changes. Only the active visible panel's object runs. Other worlds, hidden documents and world-crossing snapshots pause the objects. Short viewports fall back to normal flow when full card contents would not fit. Reduced motion and no JavaScript retain all content and static artwork in normal flow. Keyboard focus restores a covered card's original scroll position before using its project link.

The inspector's `covered-text` and `pinned-over-picture` heuristics flag the intentionally outgoing cards under the next opaque panel. These two exceptions are restricted to the user-requested stack: each card's own text and figure occupy separate columns/rows, and focusing an older link reveals that card. Existing compact-image and metadata exceptions still apply. The original world crossing remains the primary page interaction.

Visual review: hierarchy 8/10, specificity 8/10, composition 8/10, craft 8/10. The objects form a consistent isometric family and explain the three disciplines; they remain stylized diagrams, with less material richness than the hero's WebGL orb. No footage, external imagery, invented statistics or new network dependency is introduced. The local prototype awaits owner review.

Validation passed 49 browser assertions across EN/ID at 320/390/768/1440px, including one active object at a time, viewport fit, two-line headings, project navigation, covered-card keyboard focus, both world crossings, short screens, reduced motion and no JavaScript. The three language unit tests also pass. Mobile checks use browser emulation; physical-device performance is not claimed.

## Project scale

Desktop project media occupies roughly a quarter of its row, capped at 290px. A thumbnail of 80–104px accompanies the title/metadata on a phone, with the description across the width below. Existing screenshots open at full size in a native modal dialog, with Escape, focus return and background scroll locking. Without JavaScript the original images remain visible.

The inspector's minimum-picture-area rule is intentionally exempted: increasing the screenshots would contradict the owner's explicit request. Its eyebrow heuristic also misidentifies the previous project's tools/link as a label for the next project; the metadata remains part of its own article. Bone is an explicit palette choice. The site has no supplied portfolio footage; unrelated video is not introduced.

## Spacing and component feedback

`polish.css` loads last and sets a shared 8/16/24/32/48px spacing scale. Sections use a responsive 64–96px gap and their content uses 32–48px. This replaces the prior mix of stacked section padding, large scene margins and inconsistent heading sizes. Hero layout crops unused canvas margins while keeping the planet artwork and orbital dimensions unchanged. Both top anchors leave the header visible.

The tool selector links eight tools to the actual matching projects; it does not hide other work. Desktop/tablet use an orbital diagram, while phones use a compact button grid. Each selection updates the connection, project links and pressed state. The complete tool table remains available in native details, open without JavaScript. Creator process steps and four Builder technical notes also use native details, enhanced with interruptible 220ms height transitions. Reduced motion uses native instant toggles. World crossing, document hiding and a preference change settle in-flight details.

Section headings enter through a short masked reveal; images have a restrained scale reveal. Actions respond to hover, press and keyboard focus. The underlined portal captions now activate the same full-world crossing as their objects. Scroll navigation indicates the active section. These effects stay subordinate to the orbital objects, discipline scenes and world transition.

The editorial/component suite passed 102 browser assertions in EN/ID at 320/390/768/1440px: compact images, translated details, accordion reversal, eight correct tool mappings, keyboard activation, project links, consistent section padding, complete world round trips, reduced motion and no JavaScript. Additional final checks cover light/dark themes and portal-caption activation. The three language unit tests pass. The inspector reports zero failures; intentional bone/no-footage and the fluid type scale account for its remaining warnings. Browser emulation does not establish physical-phone performance. Visual review: hierarchy 8/10, specificity 8/10, composition 8/10, craft 8/10. The quieter summaries and shared spacing make the work easier to scan; the toolbox is a functional extension of the existing orbital language. This remains a local prototype for owner review.

## Languages and sources

EN/ID pages remain generated from `templates/page.html` and `locales/id.json`. Explicit choice outranks remembered choice, then browser language. No country lookup. Language switching preserves the world and section.

The primary visual layer is `prototype.css`, with scenes in `scenes.css`, object/transition styles in `planet.css`, and the spacing/component pass in `polish.css`. The previous experiment is preserved in ignored `.taste-skill/pre-sculptural/`; the original two-world baseline remains in `.taste-skill/pre-orb-prototype/`. The pre-editorial sources are in `.taste-skill/pre-editorial/`. Existing Ocaty/ORCA assets and project facts are retained. No commit, push or publication is implied.
