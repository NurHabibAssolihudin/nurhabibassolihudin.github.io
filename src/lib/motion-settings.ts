/** Seconds, grouped by purpose: travel, readable pause, then usable destination. */
export const motionTiming = {
  world: {gather: .46, signatureHold: .44, reveal: .54, quietEnter: .12, quietHold: .22, quietExit: .16},
  project: {selection: .34, preview: .64, background: .60},
  // Portfolio content reveals need a readable sweep; they are not button feedback.
  chapter: {reveal: .64, sequence: .70, contact: .55, workStagger: .08},
} as const;

/** Read the existing CSS motion tokens so canvas-adjacent and UI motion agree. */
export function motionEase(token = '--ease'): [number, number, number, number] {
  if (typeof document === 'undefined') return [.23, 1, .32, 1];
  const curve = getComputedStyle(document.documentElement).getPropertyValue(token).match(/cubic-bezier\(([^)]+)\)/);
  const values = curve?.[1].split(',').map(Number);
  return values?.length === 4 && values.every(Number.isFinite)
    ? values as [number, number, number, number]
    : [.23, 1, .32, 1];
}
