import { formatAICost, formatExactAICost } from "../cost";

describe("formatAICost", () => {
  it("shows small positive costs with four decimal places", () => {
    expect(formatAICost(0.0036518)).toBe("$0.0037");
  });

  it("does not round tiny positive costs down to zero", () => {
    expect(formatAICost(0.00001)).toBe("<$0.0001");
  });

  it("keeps standard currency formatting for cent-sized costs", () => {
    expect(formatAICost(0.01)).toBe("$0.01");
  });

  it("formats exact costs for tooltips", () => {
    expect(formatExactAICost(0.0036518)).toBe("$0.0036518");
  });
});
