/** Runtime chapter indices and picker indices must describe the same content order. */
export function assertProjectOrder(actual: readonly string[], expected: readonly string[]): void {
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    throw new Error(
      `Project IDs/order must match src/data/navigation.ts. Expected ${expected.join(', ')}; received ${actual.join(', ')}.`
    );
  }
}
