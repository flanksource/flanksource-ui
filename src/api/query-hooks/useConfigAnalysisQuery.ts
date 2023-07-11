import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ConfigTypeInsights } from "../../components/ConfigInsights";
import { AxiosResponseWithTotalEntries } from "../../types";
import {
  getAllConfigInsights,
  getConfigAnalysisByComponent,
  PaginationInfo
} from "../services/configs";

export function useConfigInsightsQuery(
  queryParams: {
    status?: string;
    severity?: string;
    type?: string;
    analyzer?: string;
    component?: string;
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
    async () => {
      if (queryParams.component) {
        const res = await getConfigAnalysisByComponent(queryParams.component);
        const insights = res.filter((item) => {
          if (queryParams.status && item.status !== queryParams.status) {
            return false;
          }
          if (queryParams.severity && item.severity !== queryParams.severity) {
            return false;
          }
          if (queryParams.type && item.analysis_type !== queryParams.type) {
            return false;
          }
          if (queryParams.analyzer && item.analyzer !== queryParams.analyzer) {
            return false;
          }
          return true;
        });
        return {
          data: insights,
          error: null
        };
      }
      return getAllConfigInsights(queryParams, sortBy, pageInfo);
    },
    options
  );
}
