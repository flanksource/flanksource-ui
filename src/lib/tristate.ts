/**
 * Shared tristate protocol helpers.
 *
 * Internal format examples:
 * - "value:1"
 * - "value:-1"
 * - "key____value:1,key____other:-1"
 */

export type TriStateParsedValue = {
  key: string;
  state: number;
};

/**
 * Parses a tristate key:state string where the key may contain colons.
 * The state value (1, -1, or 0) is always after the LAST colon.
 */
export function parseTristateKeyState(
  item: string
): TriStateParsedValue | null {
  if (!item || typeof item !== "string") {
    return null;
  }

  const lastColonIndex = item.lastIndexOf(":");
  if (lastColonIndex === -1) {
    return null;
  }

  const key = item.slice(0, lastColonIndex);
  const stateStr = item.slice(lastColonIndex + 1);
  const state = parseInt(stateStr, 10);

  if (isNaN(state) || !key) {
    return null;
  }

  return { key, state };
}

export function encodeTristateKey(key: string) {
  return key.replaceAll(",", "||||").replaceAll(":", "____");
}

export function decodeTristateKey(key: string) {
  return key.replaceAll("____", ":").replaceAll("||||", ",");
}

/**
 * Converts an include-only value into tristate internal format.
 */
export function toTriStateIncludeParamValue(value: string) {
  return `${encodeTristateKey(value)}:1`;
}

/**
 * Converts tristate internal output (key:1,key2:-1) into query param value
 * format used by API filters (key,!key2).
 */
export function tristateOutputToQueryParamValue(
  param: string | undefined,
  encodeValue = false
) {
  return param
    ?.split(",")
    .map((type) => {
      const parsed = parseTristateKeyState(type);
      if (!parsed) {
        return null;
      }

      const symbolFilter = parsed.state === -1 ? "!" : "";
      const filterValue = decodeTristateKey(parsed.key);

      if (encodeValue) {
        return encodeURIComponent(`${symbolFilter}${filterValue}`);
      }

      return `${symbolFilter}${filterValue}`;
    })
    .filter(Boolean)
    .join(",");
}
