import { encodeObjectToUrlSearchParams, decodeUrlSearchParams } from "../url";

describe("Object => URL => Object encoding", () => {
  test("encodeObjectToUrlSearchParams(object) => decodeUrlSearchParams(result) => object", () => {
    const urlObject = {
      layout: "foo",
      groupBy: "bar",
      health: true,
      labels: { a: 1, b: 0, c: -1, d: "1", e: "0", f: "-1" },
      foo: "bar",
      arr: ["bar", 1, true]
    };

    const encodedString = encodeObjectToUrlSearchParams(urlObject);
    const decodedObject = decodeUrlSearchParams(`${encodedString}&foo=bar`);
    expect(urlObject).toMatchObject(decodedObject);
  });
  test("encodeObjectToUrlSearchParams({}) => decodeUrlSearchParams(result) => {}", () => {
    const urlObject = {};
    const encodedString = encodeObjectToUrlSearchParams(urlObject);
    const decodedObject = decodeUrlSearchParams(encodedString);
    expect(urlObject).toMatchObject(decodedObject);
  });
  test("decodeUrlSearchParams('?foo=bar') => { foo: 'bar' }", () => {
    const urlObject = { foo: "bar" };
    const decodedObject = decodeUrlSearchParams("?foo=bar");
    expect(urlObject).toMatchObject(decodedObject);
  });
});
