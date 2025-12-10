export type TimeRange = { min: number; max: number };

export type EvenlySpacedRange = {
  start: number;
  end: number;
  interval: number;
  ticks: number[];
};

/**
 * Returns an evenly spaced range (ticks + interval) that starts at the range min
 * and ends at the range max. Designed for testability and stable spacing.
 */
export function buildEvenlySpacedRange(
  range: TimeRange,
  desiredTickCount: number
): EvenlySpacedRange {
  const safeTicks = Math.max(2, Math.floor(desiredTickCount) || 2);
  const span = Math.max(0, range.max - range.min);

  if (
    !Number.isFinite(range.min) ||
    !Number.isFinite(range.max) ||
    span === 0
  ) {
    const value = Number.isFinite(range.min) ? range.min : 0;
    return {
      start: value,
      end: value,
      interval: 0,
      ticks: Array.from({ length: safeTicks }, () => value)
    };
  }

  const interval = span / (safeTicks - 1);
  const ticks = Array.from(
    { length: safeTicks },
    (_, i) => range.min + i * interval
  );

  return {
    start: range.min,
    end: range.max,
    interval,
    ticks
  };
}
