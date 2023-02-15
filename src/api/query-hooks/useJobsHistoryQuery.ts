import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { JobHistory } from "../../components/JobsHistory/JobsHistoryTable";
import { getJobsHistory } from "../services/jobsHistory";

type Response =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: JobHistory[] | null;
      totalEntries?: number | undefined;
      error: null;
    };

export function useJobsHistoryQuery(
  pageIndex: number,
  pageSize: number,
  options?: UseQueryOptions<Response, Error>
) {
  return useQuery<Response, Error>(
    ["jobs_history", pageIndex, pageSize],
    () => getJobsHistory(pageIndex, pageSize),
    options
  );
}

export function useJobsHistoryForSettingQuery(
  {
    pageIndex,
    pageSize,
    resourceType,
    resourceId,
    name,
    status,
    sortBy,
    sortOrder
  }: {
    pageIndex: number;
    pageSize: number;
    resourceType: string;
    resourceId: string;
    name: string;
    status: string;
    sortBy: string;
    sortOrder: string;
  },
  options?: UseQueryOptions<Response, Error>
) {
  return useQuery<Response, Error>(
    [
      "jobs_history",
      pageIndex,
      pageSize,
      resourceType,
      resourceId,
      name,
      status,
      sortBy,
      sortOrder
    ],
    () =>
      getJobsHistory(
        pageIndex,
        pageSize,
        resourceType,
        resourceId,
        name,
        status,
        sortBy,
        sortOrder
      ),
    options
  );
}
