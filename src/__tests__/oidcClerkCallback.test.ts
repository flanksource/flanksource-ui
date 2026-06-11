import {
  buildCallbackFormHTML,
  getBackendCallbackURL
} from "../../pages/api/oidc/clerk/callback";

describe("getBackendCallbackURL", () => {
  it("builds the fixed callback path on the org backend origin", () => {
    expect(
      getBackendCallbackURL("https://mc.org-abc.flanksource.com")?.toString()
    ).toBe("https://mc.org-abc.flanksource.com/oidc/clerk/callback");
  });

  it("ignores any path on the org backend URL", () => {
    expect(
      getBackendCallbackURL(
        "https://mc.org-abc.flanksource.com/some/path"
      )?.toString()
    ).toBe("https://mc.org-abc.flanksource.com/oidc/clerk/callback");
  });

  it("allows http only for localhost", () => {
    expect(getBackendCallbackURL("http://localhost:8080")?.toString()).toBe(
      "http://localhost:8080/oidc/clerk/callback"
    );
    expect(getBackendCallbackURL("http://backend.example.com")).toBeUndefined();
  });

  it("returns undefined for missing or invalid URLs", () => {
    expect(getBackendCallbackURL(undefined)).toBeUndefined();
    expect(getBackendCallbackURL("not a url")).toBeUndefined();
  });
});

describe("buildCallbackFormHTML", () => {
  it("posts the Clerk token to the backend callback from the browser", () => {
    const html = buildCallbackFormHTML(
      "https://mc.org-abc.flanksource.com/oidc/clerk/callback?auth_request_id=req-123",
      "clerk-backend-jwt"
    );

    expect(html).toContain('method="post"');
    expect(html).toContain(
      'action="https://mc.org-abc.flanksource.com/oidc/clerk/callback?auth_request_id=req-123"'
    );
    expect(html).toContain(
      'name="clerk_session_token" value="clerk-backend-jwt"'
    );
  });

  it("escapes HTML in the action URL and token", () => {
    const html = buildCallbackFormHTML(
      'https://mc.example.com/oidc/clerk/callback?a="><script>',
      '"><script>alert(1)</script>'
    );

    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&quot;&gt;&lt;script&gt;");
  });
});
