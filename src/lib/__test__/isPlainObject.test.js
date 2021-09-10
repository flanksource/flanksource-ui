import { isPlainObject } from "../isPlainObject";

describe("isPlainObject", () => {
  test("isPlainObject(plainObj) => true || isPlainObject(!plainObj) => false", () => {
    [
      null,
      undefined,
      true,
      "string",
      1,
      [1, "2", true],
      () => {},
      Symbol("Sym"),
      BigInt(90),
      new ArrayBuffer(8),
      Object
    ].forEach((val) => {
      expect(isPlainObject(val)).toEqual(false);
    });

    [Object.prototype, Object.create(null), {}, { foo: "bar" }].forEach(
      (val) => {
        expect(isPlainObject(val)).toEqual(true);
      }
    );
  });
});
