export const TRUNCATION_MARKER = "⚠️ Tool output truncated";

export function isToolOutputTruncated(output: unknown): boolean {
  if (typeof output === "string") {
    return output.startsWith(TRUNCATION_MARKER);
  }

  return false;
}

/**
 * Unwrap MCP protocol envelope: { content: [{ type: "text", text: "..." }], isError: bool }
 * Returns the inner text, or null if output doesn't match the envelope shape.
 */
export function unwrapMCPEnvelope(output: unknown): string | null {
  if (!output || typeof output !== "object" || Array.isArray(output)) {
    return null;
  }

  const obj = output as Record<string, unknown>;
  if (!Array.isArray(obj.content)) {
    return null;
  }

  const texts = (obj.content as Array<Record<string, unknown>>)
    .filter((c) => c?.type === "text" && typeof c?.text === "string")
    .map((c) => c.text as string);

  return texts.length > 0 ? texts.join("\n") : null;
}

export function tryParseJSON(text: string): unknown | null {
  const trimmed = text.trim();

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  return null;
}
