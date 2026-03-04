/** Ensure a value is a finite number (cents). */
export function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number`);
}

/** Ensure a value is a non-negative integer (cents). */
export function assertNonNegative(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) throw new Error(`${name} must be >= 0`);
}

/** Ensure a value is a positive integer (cents). */
export function assertPositive(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) throw new Error(`${name} must be > 0`);
}

/** Round to nearest integer (cents) from a calc that may be decimal. */
export function roundToInt(value: number): number {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

/** Convert cents to dollars. */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/** Convert dollars to cents (rounding to nearest integer). */
export function dollarsToCents(value: number): number {
  return Math.round(value * 100);
}