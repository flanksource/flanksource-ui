import { durationOptions } from "@flanksource-ui/components/JobsHistory/Filters/JobHistoryDurationDropdown";
import { jobHistoryDefaultDateFilter } from "@flanksource-ui/components/JobsHistory/Filters/JobsHistoryFilters";
import { JobHistory } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { resourceTypeMap } from "@flanksource-ui/components/SchemaResourcePage/SchemaResourceEditJobsTab";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobsHistory, GetJobsHistoryParams } from "../services/jobsHistory";

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
    () => getJobsHistory({ pageIndex, pageSize }),
    options
  );
}

export function useJobsHistoryForSettingQuery(
  options?: UseQueryOptions<Response, Error>,
  resourceId?: string,
  tableName?: keyof typeof resourceTypeMap
) {
  const { timeRangeAbsoluteValue } = useTimeRangeParams(
    jobHistoryDefaultDateFilter
  );

  const [searchParams] = useSearchParams();
  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");
  const name = searchParams.get("name") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const status = searchParams.get("status") ?? "";
  const duration = searchParams.get("runDuration") ?? undefined;
  const durationMillis = duration
    ? durationOptions[duration].valueInMillis
    : undefined;
  const startsAt = timeRangeAbsoluteValue?.from ?? undefined;
  const endsAt = timeRangeAbsoluteValue?.to ?? undefined;
  const resourceType = useMemo(() => {
    if (!tableName) {
      return undefined;
    }
    return resourceTypeMap[tableName];
  }, [tableName]);

  const params = {
    pageIndex,
    pageSize,
    resourceType,
    name,
    status,
    sortBy,
    sortOrder,
    startsAt,
    endsAt,
    duration: durationMillis,
    resourceId
  } satisfies GetJobsHistoryParams;

  return useQuery<Response, Error>(
    ["jobs_history", params],
    () => getJobsHistory(params),
    options
  );
}
