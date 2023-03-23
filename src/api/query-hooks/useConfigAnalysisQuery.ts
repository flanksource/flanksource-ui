import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ConfigTypeInsights } from "../../components/ConfigInsights";
import { AxiosResponseWithTotalEntries } from "../../types";
import { getAllConfigInsights, PaginationInfo } from "../services/configs";

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
