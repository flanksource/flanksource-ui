import { hasStringMatch } from "../../../utils/common";

describe("hasStringMatch", () => {
  const strings = ["banana", "ana", "grAna", "popeye", "fantano", "gAnA"];
  const pattern = "ana";

  test("Simple matching without lowercase", () => {
    const matches = strings.reduce((acc, currString) => {
      if (hasStringMatch(pattern, currString)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    expect(matches).toBe(2);
  });

  test("Simple matching with lowercase", () => {
    const matches = strings.reduce((acc, currString) => {
      if (hasStringMatch(pattern, currString.toLowerCase())) {
        return acc + 1;
      }
      return acc;
    }, 0);
    expect(matches).toBe(4);
  });
});
