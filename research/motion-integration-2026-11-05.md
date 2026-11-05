# Motion integration — 2026-11-05

Motion now owns professional section travel; the existing tested wheel-intent controller owns gesture boundaries. Touch keeps native Scroll Snap so tall sections remain readable. First-visit arrivals overlap travel; returning sections do not replay the welcome.

The official vertical Carousel is a Motion+ component requiring motion-plus and paid access, rather than the installed free motion package: https://motion.dev/docs/react-carousel . No matching full-page momentum/reading controller was verified in the checked React Bits catalogue. No dependency was added.

Contact topics use the actual React Bits RotatingText TS/default CSS source, copied from https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/TextAnimations/RotatingText . The adjacent LICENSE.md preserves the upstream MIT + Commons Clause terms. This is website use, not redistribution as a component product.

The submit state adapts the free AnimatePresence modes example: https://motion.dev/examples/react-animate-presence-modes . The rejected custom liquid/plane implementation was removed. Success still requires affirmative API acceptance; local success demonstrations intercept the request and send no email.

Section travel: 1,020ms, content reveal: 960ms, short 90ms stagger. These are project-specific choices for a large spatial transition, not universal timing rules. Reduced motion and keyboard navigation avoid decorative travel. Existing world destination emblems remain unchanged.

## Interface-wide Motion coverage

The shared Astro interface uses Motion's DOM animation/hover APIs rather than adding React islands for static controls. The primary nav has one travelling active underline, menu rows enter with a short stagger, the burger transforms with its open state, theme palettes interpolate from the current rendered colors and release inline styles at completion. Rapid theme changes retarget from the visible palette. Reduced motion and keyboard-triggered theme changes settle directly.

The existing gallery already uses Motion values and a frame clock for its loop/inertia, Motion springs for card lift and Motion's DOM engine for the reader expansion. Artwork layers, the light sweep and worker pulse now use Motion too. Its tested pointer bookkeeping is retained; a library carousel would change its infinite-flow and native vertical-touch behavior. Contact uses React Bits RotatingText (plain CSS source with upstream license) and Motion AnimatePresence for sending states. Creator details/tool feedback and heading arrivals now use bundled Motion instead of copied native animation code.

Custom canvas/WebGL planet and field rendering, native dialog semantics, locale cross-document View Transitions, and the tested wheel-intent gate remain specialized. They complement Motion rather than duplicate its UI animation ownership. No additional package is required. Motion hover filters synthetic touch hover: https://motion.dev/docs/hover ; DOM animation APIs: https://motion.dev/docs/animate .

Entry motion now targets Astro content wrappers instead of links or React-owned gallery elements. Ordinary buttons and links do not receive positional hover animation; their first appearance is driven by chapter visibility. Press feedback and the deliberately interactive project-card hover remain independent.
