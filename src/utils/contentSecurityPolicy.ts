const CSP_PROPERTY = "ui.content_security_policy";
const CSP_META_SELECTOR = 'meta[data-flanksource-csp="true"]';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  // Next.js emits inline bootstrap data. UI snippets and Ory WebAuthn use
  // dynamic functions, while Shiki compiles its syntax highlighter from WASM.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  // Monaco's CDN stylesheet loads its codicon font from the same origin.
  "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https: wss:",
  "worker-src 'self' blob:",
  "frame-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:"
].join("; ");

type MissionControlProperty = {
  name: string;
  value: unknown;
};

export function updateContentSecurityPolicy(
  properties: MissionControlProperty[]
) {
  if (typeof document === "undefined") {
    return;
  }

  const existingMeta =
    document.head.querySelector<HTMLMetaElement>(CSP_META_SELECTOR);
  const cspProperty = properties.find(
    (property) => property.name === CSP_PROPERTY
  );
  const isEnabled =
    !cspProperty || String(cspProperty.value).trim().toLowerCase() !== "false";

  if (!isEnabled) {
    existingMeta?.remove();
    return;
  }

  const meta = existingMeta ?? document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = CONTENT_SECURITY_POLICY;
  meta.dataset.flanksourceCsp = "true";

  if (!existingMeta) {
    document.head.prepend(meta);
  }
}
