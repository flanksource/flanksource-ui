import { buildSeriesKey } from "../seriesKey";

describe("buildSeriesKey", () => {
  it("uses the value alone when one column names the series", () => {
    expect(
      buildSeriesKey(
        { timestamp: "2026-08-11", service: "Compute Engine", value: 12 },
        "timestamp",
        "value"
      )
    ).toBe("Compute Engine");
  });

  it("keeps column names when several columns identify the series", () => {
    expect(
      buildSeriesKey(
        {
          timestamp: "2026-08-11",
          service: "Compute Engine",
          region: "europe-west1",
          value: 12
        },
        "timestamp",
        "value"
      )
    ).toBe("service=Compute Engine, region=europe-west1");
  });

  it("keeps the labelled form when the only label has no value", () => {
    expect(
      buildSeriesKey(
        { timestamp: "2026-08-11", service: null, value: 12 },
        "timestamp",
        "value"
      )
    ).toBe("service=null");
  });

  it("falls back to a single series when no column identifies one", () => {
    expect(
      buildSeriesKey(
        { timestamp: "2026-08-11", value: 12 },
        "timestamp",
        "value"
      )
    ).toBe("default");
  });
});
