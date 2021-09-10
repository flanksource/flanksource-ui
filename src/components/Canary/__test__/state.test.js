import { encodeObjectToUrlSearchParams } from "../url";
import { initialiseFormState } from "../state";

describe("initialiseFormState", () => {
  test("initialiseFormState(defaultValues, encodedValues) => { formState, fullState }", () => {
    const defaultValues = {
      layout: "table",
      groupBy: "name",
      hidePassing: true,
      labels: {
        "canary:DBAdmin:true": 0,
        "canary:high:true": 0
      }
    };
    const incomingValues = {
      hidePassing: false,
      labels: {
        "canary:high:true": -1
      },
      foo: "bar"
    };
    const encodedValues = encodeObjectToUrlSearchParams(incomingValues);
    const { formState, fullState } = initialiseFormState(
      defaultValues,
      encodedValues
    );
    expect(fullState).toMatchObject({
      foo: "bar",
      groupBy: "name",
      hidePassing: false,
      labels: { "canary:DBAdmin:true": 0, "canary:high:true": -1 },
      layout: "table"
    });
    expect(formState).toMatchObject({
      groupBy: "name",
      hidePassing: false,
      labels: { "canary:DBAdmin:true": 0, "canary:high:true": -1 },
      layout: "table"
    });
  });
});
