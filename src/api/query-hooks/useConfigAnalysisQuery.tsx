import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ConfigTypeInsights } from "../../components/ConfigInsights";
import { getAllConfigInsights, PaginationInfo } from "../services/configs";

export type AxiosResponseWithTotalEntries<data = unknown> =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: data | null;
      totalEntries?: number | undefined;
      error: null;
    };

export function useConfigInsightsQuery(
  queryParams: {
    status?: string;
    severity?: string;
    type?: string;
  },
  sortBy: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  pageInfo: PaginationInfo,
  options?: UseQueryOptions<
    AxiosResponseWithTotalEntries<ConfigTypeInsights[]>,
    Error
  >
) {
  return useQuery<AxiosResponseWithTotalEntries<ConfigTypeInsights[]>, Error>(
    ["configs", "insights", pageInfo, queryParams, sortBy],
    () => getAllConfigInsights(queryParams, sortBy, pageInfo),
    options
  );
}
