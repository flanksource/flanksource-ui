import { ViewVariable } from "../../audit-report/types";

/**
 * Aggregates variables from multiple views, deduplicating by key.
 * When same key appears multiple times, merges options arrays (union) and keeps
 * the first definition for other fields to avoid silently overriding labels or defaults.
 */
export function aggregateVariables(
  variableArrays: (ViewVariable[] | undefined)[]
): ViewVariable[] {
  const variableMap = new Map<string, ViewVariable>();

  for (const variables of variableArrays) {
    if (!variables) continue;

    for (const variable of variables) {
      const existing = variableMap.get(variable.key);
      if (existing) {
        // Merge options (union of both arrays)
        const mergedOptions = [
          ...new Set([...existing.options, ...variable.options])
        ];
        variableMap.set(variable.key, {
          ...existing,
          options: mergedOptions
        });
      } else {
        variableMap.set(variable.key, { ...variable });
      }
    }
  }

  return Array.from(variableMap.values());
}
