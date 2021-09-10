import { BiLabel } from "react-icons/bi";
import { testData } from "../../../data/testData";
import { getGroupSelections, defaultGroupSelections } from "../grouping";

const output = {
  ...defaultGroupSelections,
  "canary:test:istest": {
    description: "test:istest",
    icon: <BiLabel />,
    id: "canary:test:istest",
    key: "test",
    labelValue: "istest",
    name: "canarytestistest",
    value: "canary:test:istest"
  }
};

describe("getGroupSelections", () => {
  test("getGroupSelections(checks, defaultGroupSelections) => output", () => {
    expect(getGroupSelections(testData.checks, defaultGroupSelections)).toEqual(
      output
    );
  });
});
