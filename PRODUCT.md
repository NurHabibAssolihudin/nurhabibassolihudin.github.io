# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Prospective international and Indonesian clients, alongside visitors exploring NurHabib Assolihudin's software and games.

## Product Purpose
A personal portfolio that helps visitors understand Nur's work and start a conversation about a project.

## Capabilities and Constraints
Astro + React + TypeScript + Motion, producing static HTML for GitHub Pages. Preserve builder and creator exploration, light/dark theme, existing project facts and contact destinations. Complete Indonesian and English copy, automatic browser-language selection and an explicit remembered language choice. The user explicitly chose browser language without a third-party country lookup. The current snapshot was pushed and merged into main on 29 October 2026 at 7577aa0; live deployment was not verified. Phase 1 is implemented and verified locally on `migration/professional-phase-1`; the owner has authorized its commit and push to main; publishing cutover remains separate. MIGRATION-BRIEF.md is the current source for the requested experience changes.

## Brand Commitments
The user chose: game creator, imaginative, atmospheric, expressive. Personal name NurHabib Assolihudin; creator identity alimagine. The core-driven, full-page switch between builder and creator worlds is essential. It must remain a change of the entire experience, not become a project filter or tab. The landscape-and-tabs redesign was rejected. On 20 October the user requested a futuristic style without the usual console/AI visual habits, followed by a matching orb or cube object. The calm ceramic/titanium experiment was rejected as insufficiently futuristic. The user then authorized assertive sculptural futurism: strong poster-like typography, graphite/bone, electric blue versus vermilion, a fragmented hollow orb with an impossible interior, and smaller project imagery. The user then requested a planet with an orbiter, and subsequently rejected its terrain texture. The current version uses a clean blue professional planet with several satellites, while alimagine has a mothership surrounded by small flaming skulls, as explicitly requested on 27 October. The complete world switch uses a dotted cover and a circular opening inspired by the general Potadot navigation sequence. The owner requested an original object, rather than copying Potadot’s artwork.

## Evidence on Hand
Existing portfolio content for Ocaty, ORCA, Tony, Oxelot, GenUI, Backtrade CLI, alimagine, Going Home, Project Erebus and interactive stories. Three product screenshots in assets/. No verified game screenshots, testimonials, client metrics or portrait supplied. Generated atmosphere must be identified as portfolio artwork rather than a game screenshot. The requested professional inspiration figures and game characters have not yet been named or supplied as image assets; do not infer the owner's favorites.

## Open Decisions

The owner has set three implementation phases, documented in MIGRATION-PHASES.md: (1) repair and divide professional sections and implement section-scroll navigation and functional project links, using existing assets without waiting for new imagery; include the necessary framework foundation here, (2) add professional imagery and the cool lounge-seat/tea-table contact scene, (3) redesign the creative world completely as Chrimson Violet. Validate within each phase. The owner authorized phase 1, now implemented locally. Phases 2 and 3 have not started; no additional publication was requested.

Current priority, clarified by the owner on 29 October: focus research, information architecture, content and implementation planning on the professional page. Its purpose is to help prospective clients and evaluators understand fit, inspect work and make contact. Keep its distinctive visual ambition. Leave the game world as it is for now; the intended future world name is **Chrimson Violet** (owner's spelling). Preserve the earlier expressive, highly creative and emotionally engaging direction for that later phase. Hiring/portfolio presentation recommendations for the professional page must not standardize the creative world's experience. This is a planned world name, not an implemented rename of the existing alimagine studio identity or contact URLs.

The owner has now specified six professional functions in order: Head/Landing (greeting, first impression, wow and a glimpse of identity), Summary, Selected Work overview, per-project Details plus personal contribution, Experience and Working Approach, and Contact. These are functional groups, not a fixed screen count; split content into additional full-viewport sections as needed. The selected-work overview uses selectable cards/list items, optionally arranged horizontally to fit. Selecting a project changes the section background to a real page preview when available and shows a short description; a separate detail link jumps directly to the matching project section. Preserve selection when returning and support direct links, keyboard and touch. Contact is a cool, relaxed place with two lounge seats or a tea-table composition, with communication channels directly available. Phase 1 implements these functions across nine responsive sections. The contact artwork belongs to phase 2.

The 29 October migration brief replaces scroll-progress reveals and stacked/pinned scenes with complete section transitions: one focused viewport per main section. The owner clarified that the earlier one-third threshold was an assumption, not a binding requirement. Use familiar, tested gesture behavior appropriate to the device: prototype native CSS Scroll Snap first, or a well-controlled Motion drag if custom choreography requires it. Distinguish accidental movement from intentional swipes using the chosen interaction model; distance alone must not reject a deliberate fast flick. Holding without movement cannot trigger navigation. Momentum, cancellation and direction changes must not cause uncontrolled jumps. The sequential design aims for one section per gesture, validated on actual devices; native scroll and custom drag must not compete for the same input. Explicit next/down or keyboard navigation may select the target directly. Essential information must settle fully visible. Content must be split or provided as accessible details when it cannot fit; zoom and short viewports must not crop information.

Contact differs by world. Professional contact should feel relaxed, spacious and natural, with direct communication channels. Game contact should be an inventive, responsive scene that makes visitors feel something; the owner's example is being theatrically held at gunpoint, with room for other equally expressive concepts. This is an experiential direction, not a fixed final scene or supplied asset. Dialogue/actions should lead clearly to actual contact channels, with direct access, keyboard/touch and reduced-motion paths.

The owner also requested inspiration imagery integrated into the background, not a dedicated section. Professional uses a few owner-selected figures known well by the owner; alimagine uses a wider collection of distinctive game characters and favorites. The images must remain recognizable and support the composition without obstructing copy. Identity, asset selection and source inventory remain open. The artistic standard is distinctiveness earned through creativity, ambition and intelligent presentation, with custom coherent choreography rather than unchanged component presets. See MIGRATION-BRIEF.md for the full acceptance criteria.

On 27 October the owner authorized implementing the proposed first Potadot-inspired step: three stacked discipline scenes after the Builder introduction, each with a distinct explanatory object animation. The prototype uses original SVG artwork for platform modules, AI memory and system message flow.

The subsequent copy/spacing/component review removes repeated claims about shipping and production, shortens both languages to factual project descriptions, and removes the production strip, manifesto and staged Tony/Oxelot interfaces. The follow-up adds project technical details, an interactive tool-to-project selector, expandable Creator process steps and consistent section spacing. Those changes are in the merged 7577aa0 snapshot. The full-page worlds, bilingual behavior and compact project imagery remain constraints for migration. The earlier stacked discipline implementation is a baseline, superseded as a migration target by the discrete-screen brief above. Maps and further section ideas remain unimplemented.
No new rates, client promises, availability, location or project outcomes established.

On 21 October the owner requested transition motion inspired by nahiyan.codes, expanding circularly outward from the main orb. That earlier prototype used a radial digital wave; it is superseded by the 27 October planet and dotted-cover transition while preserving the complete worlds and compact project scale.

The owner then authorized the proposed Velmax-inspired background: one original point field shaped by the orb, structured blue currents for builder, flowing vermilion swirls for creator, and a disturbance that reorganizes with the world crossing. Copy and compact project images remain the focus. Reduced motion and a static fallback preserve access. The new local visual result awaits owner review.

## Owner-confirmed professional facts

Ocaty, ORCA and Oxelot are personal projects; Nur handles branding, planning, coding, deployment and marketing. Employment: R&D Developer at PT Semesta Teknologi Informatika for more than one year. Dates, business results, company responsibilities, client numbers and testimonials are not supplied.

## Current optimization implementation

Static professional sections are owned by Astro. React hydrates only the selected-work picker near visibility. Existing portal/background rendering initializes without waiting for React, with creator preparation on demand. WOFF2 assets retain the existing typefaces; no new visual assets or identity changes are introduced. Geometry measurement is separate from routing. `OPTIMIZATION-REPORT.md` records measured startup assets and verification; no production deployment or physical-phone FPS result is implied.
