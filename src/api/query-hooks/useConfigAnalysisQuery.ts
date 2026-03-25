import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponseWithTotalEntries } from "../../types";
import {
  decodeTristateKey,
  parseTristateKeyState
} from "@flanksource-ui/lib/tristate";
import {
  getAllConfigInsights,
  getConfigAnalysisByComponent,
  getConfigsByIDs
} from "../services/configs";
import { PaginationInfo } from "../types/common";
import { ConfigAnalysis } from "../types/configs";

function isTristateFilter(value: string) {
  return /(^|,).+:(-1|1)(,|$)/.test(value);
}

function matchesFilter(
  value: string | null | undefined,
  filterValue?: string
): boolean {
  if (!filterValue) {
    return true;
  }

  if (!value) {
    return false;
  }

  if (!isTristateFilter(filterValue)) {
    return value === filterValue;
  }

  const filters = filterValue
    .split(",")
    .map((item) => parseTristateKeyState(item))
    .filter((item): item is { key: string; state: number } => item != null)
    .map((item) => ({
      ...item,
      key: decodeTristateKey(item.key)
    }));

  const includeFilters = filters.filter((item) => item.state === 1);
  const excludeFilters = filters.filter((item) => item.state === -1);

  if (excludeFilters.some((item) => item.key === value)) {
    return false;
  }

  if (includeFilters.length > 0) {
    return includeFilters.some((item) => item.key === value);
  }

  return true;
}

export function useConfigInsightsQuery(
  queryParams: {
    status?: string;
    severity?: string;
    type?: string;
    analyzer?: string;
    source?: string;
    component?: string;
    configId?: string;
    configType?: string;
  },
  sortBy: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  pageInfo: PaginationInfo,
  options?: UseQueryOptions<
    AxiosResponseWithTotalEntries<ConfigAnalysis[]>,
    Error
  >
) {
  return useQuery<AxiosResponseWithTotalEntries<ConfigAnalysis[]>, Error>(
    ["configs", "insights", pageInfo, queryParams, sortBy],
    async () => {
      if (queryParams.component) {
        const res = await getConfigAnalysisByComponent(queryParams.component);
        const insights = res.filter((item) => {
          if (!matchesFilter(item.status, queryParams.status)) {
            return false;
          }
          if (!matchesFilter(item.severity, queryParams.severity)) {
            return false;
          }
          if (!matchesFilter(item.analysis_type, queryParams.type)) {
            return false;
          }
          if (!matchesFilter(item.analyzer, queryParams.analyzer)) {
            return false;
          }
          if (!matchesFilter(item.source ?? undefined, queryParams.source)) {
            return false;
          }
          if (queryParams.configId && item.config_id !== queryParams.configId) {
            return false;
          }
          return true;
        });
        const configIds = insights.map((item) => item.config_id);
        const configs = await getConfigsByIDs(configIds);
        const filteredInsights = insights
          .map((item) => {
            const config = configs.find(
              (config) => config.id === item.config_id
            );
            return {
              ...item,
              config
            };
          })
          .filter((item) => {
            if (!queryParams.configType) {
              return true;
            }
            return matchesFilter(item.config?.type, queryParams.configType);
          });

        return {
          data: filteredInsights,
          error: null,
          totalEntries: filteredInsights.length
        };
      }
      return getAllConfigInsights(queryParams, sortBy, pageInfo);
    },
    options
  );
}
