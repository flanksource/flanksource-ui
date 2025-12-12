import { buildEvenlySpacedRange } from "../timeRange";

describe("buildEvenlySpacedRange", () => {
  it("keeps endpoints and snaps to hourly marks within the range", () => {
    const min = Date.UTC(2024, 0, 1, 0, 44, 0, 0); // 00:44
    const max = Date.UTC(2024, 0, 1, 12, 44, 0, 0); // 12:44

    const res = buildEvenlySpacedRange({ min, max }, 7);

    expect(res.start).toBe(min);
    expect(res.end).toBe(max);
    expect(res.ticks[0]).toBe(min);
    expect(res.ticks[res.ticks.length - 1]).toBe(max);
    const labels = res.ticks.map((t) =>
      new Date(t).toISOString().slice(11, 16)
    );
    expect(labels).toEqual([
      "00:44",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "12:44"
    ]);
  });

  it("prefers round half-hour increments over uneven spacing", () => {
    const min = Date.UTC(2024, 0, 1, 3, 14, 0, 0); // 03:14
    const max = Date.UTC(2024, 0, 1, 15, 14, 0, 0); // 15:14

    const res = buildEvenlySpacedRange({ min, max }, 20);

    expect(res.ticks[0]).toBe(min);
    expect(res.ticks[res.ticks.length - 1]).toBe(max);
    const labels = res.ticks.map((t) =>
      new Date(t).toISOString().slice(11, 16)
    );
    expect(labels).toEqual([
      "03:14",
      "03:30",
      "04:00",
      "04:30",
      "05:00",
      "05:30",
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:14"
    ]);
  });

  it("returns duplicated ticks when span is zero", () => {
    const res = buildEvenlySpacedRange({ min: 42, max: 42 }, 3);
    expect(res.ticks).toEqual([42, 42, 42]);
    expect(res.interval).toBe(0);
  });
});
