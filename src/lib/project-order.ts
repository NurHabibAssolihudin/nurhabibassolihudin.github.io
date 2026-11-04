/** Gallery indices and reader IDs must describe the same project order. */
export function assertProjectOrder(actual: readonly string[], expected: readonly string[]): void {
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    throw new Error(
      `Project IDs/order must match src/data/navigation.ts. Expected ${expected.join(', ')}; received ${actual.join(', ')}.`
    );
  }
}
