import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook that manages URL search params with a specific prefix.
 * Provides filtered params (without prefix) and a setter that adds the prefix.
 *
 * @param prefix - The prefix to use for this component's params (e.g., 'viewvar', 'view_namespace_name')
 */
export function usePrefixedSearchParams(
  prefix: string
): [
  URLSearchParams,
  (updater: (prev: URLSearchParams) => URLSearchParams) => void
] {
  const [searchParams, setSearchParams] = useSearchParams();

  const prefixedParams = useMemo(() => {
    const filtered = new URLSearchParams();
    const prefixWithSeparator = `${prefix}__`;

    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key.startsWith(prefixWithSeparator)) {
        const cleanKey = key.substring(prefixWithSeparator.length);
        filtered.set(cleanKey, value);
      }
    });

    return filtered;
  }, [searchParams, prefix]);

  // Setter that adds prefix to keys when updating URL
  const setPrefixedParams = useCallback(
    (updater: (prev: URLSearchParams) => URLSearchParams) => {
      setSearchParams((currentParams) => {
        const newParams = new URLSearchParams(currentParams);
        const prefixWithSeparator = `${prefix}__`;

        // Remove all existing params with our prefix
        Array.from(currentParams.entries()).forEach(([key]) => {
          if (key.startsWith(prefixWithSeparator)) {
            newParams.delete(key);
          }
        });

        // Get the updated params from the updater
        const updatedParams = updater(prefixedParams);

        // Add new params with prefix
        Array.from(updatedParams.entries()).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            newParams.set(`${prefixWithSeparator}${key}`, value);
          }
        });

        return newParams;
      });
    },
    [setSearchParams, prefixedParams, prefix]
  );

  return [prefixedParams, setPrefixedParams];
}
