import { buildEvenlySpacedRange } from "../timeRange";

describe("buildEvenlySpacedRange", () => {
  it("returns evenly spaced ticks across the provided range", () => {
    const res = buildEvenlySpacedRange({ min: 0, max: 100 }, 5);

    expect(res.ticks).toEqual([0, 25, 50, 75, 100]);
    expect(res.interval).toBe(25);
    expect(res.start).toBe(0);
    expect(res.end).toBe(100);
  });

  it("handles non-round ranges by distributing spacing evenly", () => {
    const min = 1_700_000_000_000;
    const max = min + 3_600_000; // +1 hour
    const res = buildEvenlySpacedRange({ min, max }, 4);

    expect(res.ticks.length).toBe(4);
    const intervals = [
      res.ticks[1] - res.ticks[0],
      res.ticks[2] - res.ticks[1],
      res.ticks[3] - res.ticks[2]
    ];

    // All intervals should be equal within a tiny epsilon
    expect(
      intervals.every((int) => Math.abs(int - intervals[0]) < 1)
    ).toBeTruthy();
    expect(res.start).toBe(min);
    expect(res.end).toBe(max);
  });

  it("returns duplicated ticks when span is zero", () => {
    const res = buildEvenlySpacedRange({ min: 42, max: 42 }, 3);
    expect(res.ticks).toEqual([42, 42, 42]);
    expect(res.interval).toBe(0);
  });
});
