const DEFAULT_RETURN_TO = "/";

/**
 * Only allow app-internal redirects.
 * Reject backslash tricks, protocol-relative URLs and cross-origin targets.
 */
export function sanitizeReturnTo(
  returnTo: string | null | undefined,
  fallback: string = DEFAULT_RETURN_TO
): string {
  if (!returnTo) {
    return fallback;
  }

  const normalizedReturnTo = returnTo.trim().replace(/\\+/g, "/");
  if (
    returnTo.includes("\\") ||
    normalizedReturnTo.startsWith("//") ||
    !normalizedReturnTo.startsWith("/")
  ) {
    return fallback;
  }

  try {
    const currentOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://app.local";

    const parsed = new URL(normalizedReturnTo, currentOrigin);
    if (parsed.origin !== currentOrigin) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
