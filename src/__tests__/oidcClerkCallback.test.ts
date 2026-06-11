import { createHash } from "crypto";
import { getOIDCTransactionCookieHeader } from "../../pages/api/oidc/clerk/callback";

function oidcCookieSuffix(authRequestID: string) {
  return createHash("sha256")
    .update(authRequestID)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 22);
}

describe("getOIDCTransactionCookieHeader", () => {
  it("returns only the matching OIDC transaction cookie", () => {
    const suffix = oidcCookieSuffix("req-123");
    const otherSuffix = oidcCookieSuffix("other-req");

    expect(
      getOIDCTransactionCookieHeader(
        `__session=clerk; __Host-mc_oidc_tx_${otherSuffix}=other; __Host-mc_oidc_tx_${suffix}=signed; unrelated=value`,
        "req-123"
      )
    ).toBe(`__Host-mc_oidc_tx_${suffix}=signed`);
  });

  it("supports local non-Host transaction cookies", () => {
    const suffix = oidcCookieSuffix("req-123");

    expect(
      getOIDCTransactionCookieHeader(
        `mc_oidc_tx_${suffix}=local; __session=clerk`,
        "req-123"
      )
    ).toBe(`mc_oidc_tx_${suffix}=local`);
  });

  it("returns undefined when no matching transaction cookie exists", () => {
    expect(
      getOIDCTransactionCookieHeader(
        "__session=clerk; unrelated=value",
        "req-123"
      )
    ).toBeUndefined();
  });
});
