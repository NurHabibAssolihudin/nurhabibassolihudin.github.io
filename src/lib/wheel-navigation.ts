// One movement at a time. Arrival only acknowledges completion; it must never
// start another movement from wheel events received during the transition.
export function createWheelNavigation(sectionCount: number) {
  let lastAt: number | null = null, lastMagnitude = 0, intent = 0;
  let direction = 0, consumed = false, peak = 0, floor = Infinity;
  let target: number | null = null;

  function request(from: number, step: number) {
    const next = Math.max(0, Math.min(sectionCount - 1, from + step));
    if (next === from) return null;
    target = next;
    return next;
  }

  return {
    reset() {
      lastAt = null; lastMagnitude = 0; intent = 0; direction = 0;
      consumed = false; peak = 0; floor = Infinity; target = null;
    },
    input(delta: number, now: number, current: number) {
      const step = Math.sign(delta), magnitude = Math.abs(delta);
      if (!step) return null;
      const gap = lastAt === null ? Infinity : now - lastAt;
      const renewedPush = consumed && step === direction && floor <= peak * .4
        && magnitude >= Math.max(12, floor * 1.8) && magnitude > lastMagnitude * 1.4;
      // Large wheel ticks can remain 80–130ms apart within one fast gesture.
      // Their size alone does not signal a new command after arrival. Re-arm
      // only after a pause or a new push following a decayed trackpad tail.
      const fresh = gap > 140 || renewedPush;
      lastAt = now; lastMagnitude = magnitude;

      if (target !== null && step === direction) {
        floor = Math.min(floor, magnitude);
        intent = 0;
        return null;
      }
      if (fresh) { consumed = false; intent = 0; }
      if (consumed && step === direction) {
        floor = Math.min(floor, magnitude);
        intent = 0;
        return null;
      }
      if (Math.sign(intent) !== step) intent = 0;
      intent += delta;
      if (Math.abs(intent) < 60) return null;
      intent = 0;

      consumed = true; direction = step; peak = magnitude; floor = magnitude;
      return request(target ?? current, step);
    },
    arrive(index: number) {
      if (index === target) target = null;
    },
  };
}
