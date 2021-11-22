import { testData } from "../../../data/testData";
import { filterChecksByLabels } from "../labels";
import { filterChecks } from "../filter";

describe("filterChecksByLabels", () => {
  const checks = filterChecks(testData.checks, false, []);

  test("No inclusions; no exclusions", () => {
    const labelFilters = {
      include: [],
      exclude: []
    };

    const value = filterChecksByLabels(checks, labelFilters);
    expect(Object.keys(value).length).toBe(39);
  });

  test("Inclusion; no exclusions", () => {
    const labelFilters = {
      include: ["canary:DBAdmin:true"],
      exclude: []
    };

    const value = filterChecksByLabels(checks, labelFilters);
    expect(Object.keys(value).length).toBe(7);
  });
  test("No inclusions; exclusion", () => {
    const labelFilters = {
      include: [],
      exclude: ["canary:DBAdmin:true"]
    };

    const value = filterChecksByLabels(checks, labelFilters);
    expect(Object.keys(value).length).toBe(32);
  });
});
