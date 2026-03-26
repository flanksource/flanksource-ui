import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponseWithTotalEntries } from "../../types";
import { getAllConfigInsights } from "../services/configs";
import { PaginationInfo } from "../types/common";
import { ConfigAnalysis } from "../types/configs";

export function useConfigInsightsQuery(
  queryParams: {
    status?: string;
    severity?: string;
    type?: string;
    analyzer?: string;
    source?: string;
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
    () => getAllConfigInsights(queryParams, sortBy, pageInfo),
    options
  );
}
