import { useCallback, useMemo } from "react";
import {
  NavigateOptions,
  URLSearchParamsInit,
  useSearchParams
} from "react-router-dom";

const GLOBAL_PARAM_KEYS = ["sortBy", "sortOrder"] as const;

type SetPrefixedSearchParams = (
  updater: (prev: URLSearchParams) => URLSearchParams,
  options?: NavigateOptions
) => void;

function toURLSearchParams(init?: URLSearchParamsInit) {
  if (!init) {
    return new URLSearchParams();
  }

  if (typeof init === "string" || init instanceof URLSearchParams) {
    return new URLSearchParams(init);
  }

  return new URLSearchParams(
    Object.entries(init).flatMap(([key, value]) =>
      Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
    )
  );
}

function buildDefaultSearchParams(
  prefix: string | undefined,
  useGlobalParams: boolean,
  defaults?: URLSearchParamsInit
) {
  if (!defaults) {
    return undefined;
  }

  const defaultsParams = toURLSearchParams(defaults);

  if (!prefix) {
    return defaultsParams;
  }

  const prefixedDefaults = new URLSearchParams();
  const prefixWithSeparator = `${prefix}__`;

  Array.from(defaultsParams.entries()).forEach(([key, value]) => {
    if (useGlobalParams && GLOBAL_PARAM_KEYS.includes(key as any)) {
      prefixedDefaults.append(key, value);
      return;
    }

    prefixedDefaults.append(`${prefixWithSeparator}${key}`, value);
  });

  return prefixedDefaults;
}

function filterPrefixedParams(
  params: URLSearchParams,
  prefix: string | undefined,
  useGlobalParams: boolean
) {
  if (!prefix) {
    return new URLSearchParams(params);
  }

  const filtered = new URLSearchParams();
  const prefixWithSeparator = `${prefix}__`;

  Array.from(params.entries()).forEach(([key, value]) => {
    if (useGlobalParams && GLOBAL_PARAM_KEYS.includes(key as any)) {
      filtered.set(key, value);
      return;
    }

    if (key.startsWith(prefixWithSeparator)) {
      filtered.set(key.substring(prefixWithSeparator.length), value);
    }
  });

  return filtered;
}

function toComparableParamsString(params: URLSearchParams) {
  return Array.from(params.entries())
    .sort(([aKey, aValue], [bKey, bValue]) => {
      if (aKey === bKey) {
        return aValue.localeCompare(bValue);
      }
      return aKey.localeCompare(bKey);
    })
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

function areSearchParamsEqual(a: URLSearchParams, b: URLSearchParams) {
  return toComparableParamsString(a) === toComparableParamsString(b);
}

/**
 * usePrefixedSearchParams
 *
 * Allows optionally namespacing URL search params with a prefix. When a prefix
 * is supplied, only params with that prefix are exposed to the caller and any
 * updates are written back under the same prefix.
 *
 * @param prefix - The prefix to use for this component's params (e.g., 'viewvar', 'view_namespace_name'). When undefined, passes through to raw useSearchParams behavior.
 * @param useGlobalParams - Whether to include global parameters (e.g., sortBy, sortOrder) in the filtered params. Defaults to true.
 * @param defaults - Optional default values (unprefixed). These are exposed as fallback values when missing from the URL.
 */
export function usePrefixedSearchParams(
  prefix?: string,
  useGlobalParams: boolean = true,
  defaults?: URLSearchParamsInit
): [URLSearchParams, SetPrefixedSearchParams] {
  const defaultSearchParams = useMemo(
    () => buildDefaultSearchParams(prefix, useGlobalParams, defaults),
    [defaults, prefix, useGlobalParams]
  );

  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams);

  const prefixedParams = useMemo(() => {
    return filterPrefixedParams(searchParams, prefix, useGlobalParams);
  }, [prefix, searchParams, useGlobalParams]);

  const setPrefixedSearchParams = useCallback(
    (
      updater: (prev: URLSearchParams) => URLSearchParams,
      options?: NavigateOptions
    ) => {
      setSearchParams((currentParams) => {
        const baseParams =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : new URLSearchParams(currentParams);

        if (!prefix) {
          const updated = updater(new URLSearchParams(baseParams));

          if (areSearchParamsEqual(updated, baseParams)) {
            return currentParams;
          }

          return updated;
        }

        const prefixWithSeparator = `${prefix}__`;
        const nextParams = new URLSearchParams(baseParams);

        Array.from(baseParams.entries()).forEach(([key]) => {
          if (key.startsWith(prefixWithSeparator)) {
            nextParams.delete(key);
          }
        });

        if (useGlobalParams) {
          GLOBAL_PARAM_KEYS.forEach((key) => {
            nextParams.delete(key);
          });
        }

        // Compute filtered params from the latest URL state
        const currentFiltered = filterPrefixedParams(
          baseParams,
          prefix,
          useGlobalParams
        );
        const updatedFiltered = updater(currentFiltered);

        Array.from(updatedFiltered.entries()).forEach(([key, value]) => {
          if (!value || value.trim() === "") {
            return;
          }
          if (useGlobalParams && GLOBAL_PARAM_KEYS.includes(key as any)) {
            nextParams.set(key, value);
            return;
          }

          const prefixedKey = `${prefixWithSeparator}${key}`;
          nextParams.set(prefixedKey, value);
        });

        if (areSearchParamsEqual(nextParams, baseParams)) {
          return baseParams;
        }

        return nextParams;
      }, options);
    },
    [prefix, setSearchParams, useGlobalParams]
  );

  return [prefixedParams, setPrefixedSearchParams];
}
