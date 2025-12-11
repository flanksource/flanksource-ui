export type TimeRange = { min: number; max: number };

export type EvenlySpacedRange = {
  start: number;
  end: number;
  interval: number;
  ticks: number[];
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const snapInterval = (raw: number) => {
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  const pick = (base: number, steps: number[]) => {
    const ratio = raw / base;
    let best = steps[0];
    let diff = Math.abs(ratio - best);
    steps.forEach((s) => {
      const d = Math.abs(ratio - s);
      if (d < diff) {
        best = s;
        diff = d;
      }
    });
    return base * best;
  };

  if (raw >= DAY) return pick(DAY, [1, 2, 3, 7, 14, 30, 90, 180, 365]);
  if (raw >= HOUR) return pick(HOUR, [1, 2, 3, 4, 6, 12, 24]);
  if (raw >= MINUTE) return pick(MINUTE, [1, 2, 5, 10, 15, 30]);
  return pick(SECOND, [1, 2, 5, 10, 15, 30]);
};

const buildTicks = (min: number, max: number, interval: number) => {
  if (interval <= 0) return [min, max];
  const first = Math.ceil(min / interval) * interval;
  const ticks = [min];
  for (let t = first; t < max; t += interval) ticks.push(t);
  ticks.push(max);
  return Array.from(new Set(ticks)).sort((a, b) => a - b);
};

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

  const rawInterval = span / (safeTicks - 1);
  let interval = snapInterval(rawInterval) || rawInterval;
  let ticks = buildTicks(range.min, range.max, interval);

  const smaller = snapInterval(interval / 2) || interval / 2;
  const moreTicks = buildTicks(range.min, range.max, smaller);
  if (
    moreTicks.length >= safeTicks &&
    moreTicks.length <= safeTicks * 2 &&
    moreTicks.length >= ticks.length
  ) {
    interval = smaller;
    ticks = moreTicks;
  }

  return {
    start: range.min,
    end: range.max,
    interval,
    ticks
  };
}
