import { useQuery } from "@tanstack/react-query";
import { PaginationInfo } from "../types/common";
import { getCheckStatuses } from "../services/topology";

export function useCheckStattiQuery(
  queryParams: {
    start: string;
    checkId: string;
    includeMessages?: boolean;
    status?: string;
    duration?: string;
  },
  pageInfo: PaginationInfo
) {
  return useQuery(
    [
      "canary",
      "status-checks",
      queryParams.checkId,
      queryParams.start,
      queryParams.status,
      queryParams.duration,
      pageInfo.pageIndex,
      pageInfo.pageSize
    ],
    () =>
      getCheckStatuses(
        queryParams.checkId,
        queryParams.start,
        pageInfo,
        queryParams.status,
        queryParams.duration
      ),
    {
      staleTime: 1000 * 10
    }
  );
}
