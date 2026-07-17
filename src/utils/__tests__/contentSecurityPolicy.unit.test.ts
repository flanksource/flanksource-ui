import { updateContentSecurityPolicy } from "../contentSecurityPolicy";

const CSP_SELECTOR = 'meta[data-flanksource-csp="true"]';

describe("updateContentSecurityPolicy", () => {
  beforeEach(() => {
    document.head.querySelector(CSP_SELECTOR)?.remove();
  });

  it("enables CSP by default", () => {
    updateContentSecurityPolicy([]);

    const meta = document.head.querySelector<HTMLMetaElement>(CSP_SELECTOR);
    expect(meta).not.toBeNull();
    expect(meta).toHaveAttribute("http-equiv", "Content-Security-Policy");
    expect(meta?.content).toContain("default-src 'self'");
  });

  it("disables CSP only when the Mission Control property is false", () => {
    updateContentSecurityPolicy([
      { name: "ui.content_security_policy", value: "false" }
    ]);

    expect(document.head.querySelector(CSP_SELECTOR)).toBeNull();
  });

  it("keeps CSP enabled when the Mission Control property is true", () => {
    updateContentSecurityPolicy([
      { name: "ui.content_security_policy", value: "true" }
    ]);

    expect(document.head.querySelector(CSP_SELECTOR)).not.toBeNull();
  });

  it("removes the managed CSP meta tag when the property changes to false", () => {
    updateContentSecurityPolicy([]);
    updateContentSecurityPolicy([
      { name: "ui.content_security_policy", value: false }
    ]);

    expect(document.head.querySelector(CSP_SELECTOR)).toBeNull();
  });
});
