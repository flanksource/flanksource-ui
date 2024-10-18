import { formatJobName } from "../common";

describe("formatJobName", () => {
  test.each`
    word                           | expected
    ${"CleanupCRDDeletedCanaries"} | ${"Cleanup CRD Deleted Canaries"}
    ${"CleanupCRDDeletedCanary"}   | ${"Cleanup CRD Deleted Canary"}
    ${"CleanupCrd DeletedCanary"}  | ${"Cleanup Crd Deleted Canary"}
    ${"DeleteCanary"}              | ${"Delete Canary"}
  `("returns $expected when $word is formatted", ({ word, expected }) => {
    expect(formatJobName(word)).toBe(expected);
  });
});
