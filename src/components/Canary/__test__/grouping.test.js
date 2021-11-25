import { BiLabel } from "react-icons/bi";
import { testData } from "../../../data/testData";
import {
  getLabelSelections,
  defaultGroupSelections
} from "../../Dropdown/lib/lists";

const output = {
  ...defaultGroupSelections,
  anothertest: {
    description: "anothertest",
    icon: <BiLabel />,
    id: "anothertest",
    key: "anothertest",
    labelValue: "anothertest",
    name: "anothertest",
    value: "anothertest"
  },
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

describe("getLabelSelections", () => {
  test("getLabelSelections(checks, defaultGroupSelections) => output", () => {
    expect(getLabelSelections(testData.checks, defaultGroupSelections)).toEqual(
      output
    );
  });
});
