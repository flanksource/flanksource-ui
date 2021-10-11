import { BiLabel } from "react-icons/bi";
import { testData } from "../../../data/testData";
import { getGroupSelections, defaultGroupSelections } from "../grouping";

const output = {
  ...defaultGroupSelections,
  test: {
    description: "test",
    icon: <BiLabel />,
    id: "test",
    key: "test",
    labelValue: "test",
    name: "test",
    value: "test"
  }
};

describe("getGroupSelections", () => {
  test("getGroupSelections(checks, defaultGroupSelections) => output", () => {
    expect(getGroupSelections(testData.checks, defaultGroupSelections)).toEqual(
      output
    );
  });
});
