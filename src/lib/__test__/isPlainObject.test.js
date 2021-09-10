import { isPlainObject } from "../isPlainObject";

function Foo() {
  this.a = 1;
}
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
      Object,
      new Foo()
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
