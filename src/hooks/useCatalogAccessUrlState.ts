import { ConfigAccessGroupBy } from "@flanksource-ui/api/types/configs";
import { toTriStateIncludeParamValue } from "@flanksource-ui/lib/tristate";
import { useCallback, useMemo } from "react";
import { usePrefixedSearchParams } from "./usePrefixedSearchParams";

export type CatalogAccessMode = "flat" | "group-user" | "group-config";

type CatalogAccessFilterKey =
  | "config_id"
  | "external_user_id"
  | "role"
  | "user_type";

type CatalogAccessFilters = Partial<Record<CatalogAccessFilterKey, string>>;

const FILTER_KEYS: CatalogAccessFilterKey[] = [
  "config_id",
  "external_user_id",
  "role",
  "user_type"
];

export const CATALOG_ACCESS_FLAT_TABLE_PREFIX = "accessFlat";
export const CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX = "accessGroupUser";
export const CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX = "accessGroupConfig";

const CATALOG_ACCESS_PAGE_INDEX_KEYS = [
  `${CATALOG_ACCESS_FLAT_TABLE_PREFIX}__pageIndex`,
  `${CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX}__pageIndex`,
  `${CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX}__pageIndex`
];

function hasDrillDownFilter(params: URLSearchParams) {
  return FILTER_KEYS.some((key) => params.has(key));
}

function mapModeToGroupByParam(mode: CatalogAccessMode) {
  switch (mode) {
    case "group-user":
      return "user";
    case "group-config":
      return "config";
    default:
      return "none";
  }
}

function mapModeToGroupBy(mode: CatalogAccessMode): ConfigAccessGroupBy | null {
  switch (mode) {
    case "group-user":
      return "user";
    case "group-config":
      return "config";
    default:
      return null;
  }
}

export function resolveCatalogAccessMode(
  params: URLSearchParams
): CatalogAccessMode {
  if (hasDrillDownFilter(params)) {
    return "flat";
  }

  const mode = params.get("mode");
  if (mode === "flat" || mode === "group-user" || mode === "group-config") {
    return mode;
  }

  const groupBy = params.get("groupBy");
  if (groupBy === "none") {
    return "flat";
  }

  if (groupBy === "user") {
    return "group-user";
  }

  if (groupBy === "config") {
    return "group-config";
  }

  return "group-config";
}

export function useCatalogAccessUrlState() {
  const [params, setParams] = usePrefixedSearchParams(undefined, false);

  const configType = params.get("configType") ?? undefined;

  const filters = useMemo(
    () =>
      FILTER_KEYS.reduce((acc, key) => {
        const value = params.get(key) ?? undefined;
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {} as CatalogAccessFilters),
    [params]
  );

  const mode = useMemo(() => resolveCatalogAccessMode(params), [params]);

  const groupBy = useMemo(() => mapModeToGroupBy(mode), [mode]);

  const resetPageIndexes = useCallback((nextParams: URLSearchParams) => {
    CATALOG_ACCESS_PAGE_INDEX_KEYS.forEach((key) => {
      nextParams.delete(key);
    });
  }, []);

  const setMode = useCallback(
    (nextMode: CatalogAccessMode) => {
      setParams((current) => {
        const nextParams = new URLSearchParams(current);

        nextParams.set("mode", nextMode);
        nextParams.set("groupBy", mapModeToGroupByParam(nextMode));

        if (nextMode !== "flat") {
          FILTER_KEYS.forEach((key) => {
            nextParams.delete(key);
          });
        }

        resetPageIndexes(nextParams);

        return nextParams;
      });
    },
    [resetPageIndexes, setParams]
  );

  const setDrillDown = useCallback(
    (key: CatalogAccessFilterKey, value: string) => {
      setParams((current) => {
        const nextParams = new URLSearchParams(current);

        nextParams.set("mode", "flat");
        nextParams.set("groupBy", "none");

        FILTER_KEYS.forEach((filterKey) => {
          if (filterKey !== key) {
            nextParams.delete(filterKey);
          }
        });

        nextParams.set(key, toTriStateIncludeParamValue(value));
        resetPageIndexes(nextParams);

        return nextParams;
      });
    },
    [resetPageIndexes, setParams]
  );

  return {
    configType,
    mode,
    groupBy,
    isGrouped: mode !== "flat",
    hasDrillDownFilter: hasDrillDownFilter(params),
    filters,
    actions: {
      setMode,
      drillDownByConfigId: (configId: string) =>
        setDrillDown("config_id", configId),
      drillDownByUser: (userId: string) =>
        setDrillDown("external_user_id", userId)
    }
  };
}
