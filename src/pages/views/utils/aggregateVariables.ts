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
        const existingOptionItems = existing.optionItems ?? [];
        const nextOptionItems = variable.optionItems ?? [];
        const optionItemsByValue = new Map(
          existingOptionItems.map((item) => [item.value, item])
        );
        for (const item of nextOptionItems) {
          if (!optionItemsByValue.has(item.value)) {
            optionItemsByValue.set(item.value, item);
          }
        }

        const mergedOptionItems = Array.from(optionItemsByValue.values());
        const mergedOptions = [
          ...new Set([
            ...existing.options,
            ...variable.options,
            ...mergedOptionItems.map((item) => item.value)
          ])
        ];
        variableMap.set(variable.key, {
          ...existing,
          options: mergedOptions,
          optionItems:
            mergedOptionItems.length > 0 ? mergedOptionItems : undefined
        });
      } else {
        variableMap.set(variable.key, { ...variable });
      }
    }
  }

  return Array.from(variableMap.values());
}
