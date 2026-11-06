# Crimson Violet redesign — 2026-11-05

## Direction

The user explicitly requested a total creative-world redesign using React Bits and Motion, with references beyond games and a confrontational contact scene aimed at the visitor. The professional world and world-crossing destination emblems remain separate. The chosen dealt direction is `name-as-monument`: the Crimson Violet name becomes the hero's architecture. Existing fonts, mothership and orbiting flame skulls are retained. The creator world uses crimson, violet-black and paper; the identity takes precedence over the skill's generic palette exclusions.

The contact slot deliberately replaces a generic address footer with the requested original animated confrontation. The project's available evidence is text about three games, not footage/screenshots; poster images are original SVG visual studies and explicitly labelled as such. They do not claim to depict gameplay.

## References actually inspected

- https://lusion.co/ — primary site plus browser inspection: large physical objects and purposeful depth as a focal point.
- https://studiofreight.com/ — primary site plus browser inspection: editorial rhythm, project imagery and restrained surrounding navigation.
- https://www.davidbowie.com/ — primary site plus browser inspection: identity expressed through a varied collage of visual material, outside the game-portfolio category. No photographs, lyrics or other media were copied.
- https://resn.co.nz/ — researched; the interactive site remained at its loader in the available browser. Its loaded experience was not used as verified visual evidence.

## Components and ownership

Official React Bits `BlurText` and `ScrollVelocity` TS/default (plain CSS) source from https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/TextAnimations . The original MIT + Commons Clause license is retained in `src/components/react-bits/LICENSE.md`. `ScrollVelocity` is adapted with a `paused` prop and hidden-document guard; an unused callback argument was renamed. No new package was installed.

A single deferred creator island contains Motion-managed poster arrivals/hover, native dialog notes, roving process tabs, typography and contact choreography. It hydrates on world entry and warms on portal intent. Astro owns the world wrapper and canvas portal, so React state cannot remove the active-world class. `creator-interactions.js` now only observes native section ownership; obsolete toolbox/accordion animation code was removed.

## Contact scene

Original vector scene: a hooded figure and foreshortened handgun, with metallic shading, spring pointer tracking, slow idle movement and a deliberate shot/recoil on valid submission. One brief warm muzzle pulse and a fading fracture overlay follow the user-triggered action. No film clip, third-party character, gore, autoplay audio or repeated strobe. Reduced motion removes movement and impact overlay.

The email account and profile links match the professional world. Without `PUBLIC_CONTACT_ENDPOINT`, the button prepares a draft and then offers the real mailto link; it never claims delivery. With an endpoint, transport starts immediately and receipt copy requires a successful response with `ok: true`. Errors preserve the draft. Initial SSR submit is disabled until hydration; no-JS visitors retain email links. The new sendme API still requires its documented separate Turnstile/idempotency integration before a backend cutover.

## Checks

Astro typecheck/build and existing unit tests; updated creator SSR snapshot and build contract. The snapshot normalizer ignores compiler-only Astro island metadata, while retaining rendered text/structure/links. Original professional section contracts remain checked. Browser checks covered native world crossing, draft preparation/impact, project modal focus/Escape, process selection and layout widths 320/390/768/1440. No email was sent. Physical phone, real provider delivery and deployment are not claimed.

The IAB's emulated desktop screenshot surface tiled despite correct DOM viewport metrics, so desktop overflow/type checks used actual DOM geometry. Visual inspection used its native viewport and a smaller emulated phone viewport. Temporary viewport overrides are reset at the end.
