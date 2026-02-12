/**
 * Translation utilities for converting standard filter formats to UI internal format.
 *
 * The backend sends filters in standard formats:
 * - Tags/Labels: "key=value,!key=value" (Kubernetes style)
 * - Tristate: "value,-value" (comma-separated with minus prefix for exclude)
 *
 * The UI uses internal formats:
 * - Tags: "key____value:1,key____value:-1"
 * - Tristate: "value:1,value:-1"
 */

/**
 * Translates tristate filter from standard format to UI internal format.
 *
 * Standard: "value1,-value2,value3"
 * UI Internal: "value1:1,value2:-1,value3:1"
 *
 * @param input - Comma-separated values, prefix with - for exclude
 * @param separatorReplace - Optional [oldSep, newSep] to replace separators (e.g., ["::", "__"])
 * @returns UI internal format string
 */
export function translateTristate(
  input: string | undefined,
  separatorReplace?: [string, string]
): string | undefined {
  if (!input) {
    return undefined;
  }

  const values = input.split(",");
  const result: string[] = [];

  for (const v of values) {
    const trimmed = v.trim();
    if (!trimmed) continue;

    // Check if it's an exclusion (starts with -)
    if (trimmed.startsWith("-")) {
      let value = trimmed.slice(1); // Remove the leading -
      if (separatorReplace) {
        value = value.replaceAll(separatorReplace[0], separatorReplace[1]);
      }
      result.push(`${value}:-1`);
    } else {
      let value = trimmed;
      if (separatorReplace) {
        value = value.replaceAll(separatorReplace[0], separatorReplace[1]);
      }
      result.push(`${value}:1`);
    }
  }

  return result.join(",");
}

/**
 * Translates tags/labels from Kubernetes-style selector to UI internal format.
 *
 * Standard: "key=value,!key=value2" (Kubernetes label selector)
 * UI Internal: "key____value:1,key____value2:-1"
 *
 * @param input - Kubernetes-style tag/label selector
 * @returns UI internal format string
 */
export function translateTags(input: string | undefined): string | undefined {
  if (!input) {
    return undefined;
  }

  const values = input.split(",");
  const result: string[] = [];

  for (const v of values) {
    const trimmed = v.trim();
    if (!trimmed) continue;

    // Check if it's an exclusion (starts with !)
    const exclude = trimmed.startsWith("!");
    const withoutPrefix = exclude ? trimmed.slice(1) : trimmed;

    // Split by = to get key and value
    const parts = withoutPrefix.split("=");
    if (parts.length !== 2) {
      // Invalid format, skip
      continue;
    }

    const key = parts[0].trim();
    const value = parts[1].trim();

    // UI internal format uses ____ as separator
    const tagKey = `${key}____${value}`;
    if (exclude) {
      result.push(`${tagKey}:-1`);
    } else {
      result.push(`${tagKey}:1`);
    }
  }

  return result.length > 0 ? result.join(",") : undefined;
}

/**
 * Translates ChangesUIFilters from standard format to UI internal format.
 */
export function translateChangesFilters(filters: {
  configTypes?: string;
  changeType?: string;
  severity?: string;
  from?: string;
  to?: string;
  tags?: string;
  source?: string;
  summary?: string;
  createdBy?: string;
}): {
  configTypes?: string;
  changeType?: string;
  severity?: string;
  from?: string;
  to?: string;
  tags?: string;
  source?: string;
  summary?: string;
  createdBy?: string;
} {
  return {
    configTypes: translateTristate(filters.configTypes, ["::", "__"]),
    changeType: translateTristate(filters.changeType),
    severity: filters.severity,
    from: filters.from,
    to: filters.to,
    tags: translateTags(filters.tags),
    source: translateTristate(filters.source),
    summary: translateTristate(filters.summary),
    createdBy: translateTristate(filters.createdBy)
  };
}

/**
 * Translates ConfigsUIFilters from standard format to UI internal format.
 */
export function translateConfigsFilters(filters: {
  search?: string;
  configType?: string;
  labels?: string;
  status?: string;
  health?: string;
}): {
  search?: string;
  configType?: string;
  labels?: string;
  status?: string;
  health?: string;
} {
  return {
    search: filters.search,
    configType: filters.configType,
    labels: translateTags(filters.labels),
    status: translateTristate(filters.status),
    health: translateTristate(filters.health)
  };
}
