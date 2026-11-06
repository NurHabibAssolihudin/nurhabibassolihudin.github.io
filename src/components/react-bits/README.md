# React Bits sources

Upstream: https://github.com/DavidHDev/react-bits (retrieved 2026-11-05).

- RotatingText: TS/default source and plain CSS.
- BlurText: TS/default source, used for the Crimson Violet wordmark.
- ScrollVelocity: TS/default source and plain CSS, used for the kinetic text strip.

The adjacent LICENSE.md contains the upstream MIT + Commons Clause terms. Components are incorporated into this website, not distributed as a standalone component product.

Local ScrollVelocity changes: optional `paused` prop, forwarded to each text row; stop frame updates when paused/document hidden; rename unused frame timestamp argument. BlurText source is unmodified. Wrapper components supply live reduced-motion, scene visibility and project-specific styling.
