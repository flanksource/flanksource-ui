const DEFAULT_RETURN_TO = "/";

/**
 * Only allow app-internal relative paths.
 * Reject protocol-relative URLs (//example.com) and absolute URLs.
 */
export function sanitizeReturnTo(
  returnTo: string | null | undefined,
  fallback: string = DEFAULT_RETURN_TO
): string {
  if (!returnTo) {
    return fallback;
  }

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return fallback;
  }

  return returnTo;
}
