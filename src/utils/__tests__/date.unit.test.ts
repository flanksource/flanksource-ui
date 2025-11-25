import { formatDuration } from "./../date";

describe("formatDuration", () => {
  test.each`
    value         | expected
    ${0}          | ${"0ms"}
    ${500}        | ${"500ms"}
    ${999}        | ${"999ms"}
    ${1000}       | ${"1s"}
    ${1500}       | ${"1s"}
    ${59999}      | ${"59s"}
    ${60000}      | ${"1m"}
    ${61000}      | ${"1m1s"}
    ${3600000}    | ${"1h"}
    ${86400000}   | ${"1d"}
    ${90061000}   | ${"1d1h"}
    ${183600000}  | ${"2.1d"}
    ${8234838000} | ${"3mo4d"}
    ${1731600000} | ${"20d"}
  `("returns $expected for value $value", ({ value, expected }) => {
    expect(formatDuration(value)).toBe(expected);
  });
});
