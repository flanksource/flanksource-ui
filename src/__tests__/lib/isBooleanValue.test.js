import { isBooleanValue } from "../../lib/isBooleanValue";

describe("isBooleanValue", () => {
  it("isBooleanValue(val) => true || isBooleanValue(!val) => false", () => {
    [
      null,
      undefined,
      "string",
      [1, "2", true],
      [1],
      [0],
      () => {},
      Symbol("Sym"),
      BigInt(90),
      new ArrayBuffer(8),
      Object
    ].forEach((val) => {
      expect(isBooleanValue(val)).toEqual(false);
    });

    [true, false, "true", "false", "True", "False", 0, 1, "0", "1"].forEach(
      (val) => {
        expect(isBooleanValue(val)).toEqual(true);
      }
    );
  });
});
