import dayjs from "dayjs";
import { durationOptions } from "@flanksource-ui/components/JobsHistory/Filters/JobHistoryDurationDropdown";
import { jobHistoryDefaultDateFilter } from "@flanksource-ui/components/JobsHistory/Filters/JobsHistoryFilters";
import { JobHistory } from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { resourceTypeMap } from "@flanksource-ui/components/SchemaResourcePage/SchemaResourceEditJobsTab";
import { parseDateMath } from "@flanksource-ui/ui/Dates/TimeRangePicker/parseDateMath";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import {
  mappedOptionsTimeRanges,
  MappedOptionsDisplay
} from "@flanksource-ui/ui/Dates/TimeRangePicker/rangeOptions";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getJobsHistory,
  getJobsHistorySummary,
  getJobsHistoryWithArtifacts,
  GetJobsHistoryParams,
  GetJobsHistorySummaryParams,
  JobHistorySummary
} from "../services/jobsHistory";

type Response =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: JobHistory[] | null;
      totalEntries?: number | undefined;
      error: null;
    };

type SummaryResponse =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: JobHistorySummary[] | null;
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
  tableName?: keyof typeof resourceTypeMap,
  nameOverride?: string
) {
  useTimeRangeParams(jobHistoryDefaultDateFilter);

  const [searchParams] = useSearchParams();
  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");
  const name = nameOverride
    ? nameOverride.includes(":")
      ? nameOverride
      : `${nameOverride}:1`
    : (searchParams.get("name") ?? "");
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const status = searchParams.get("status") ?? "";
  const duration = searchParams.get("runDuration") ?? undefined;
  const durationMillis = duration
    ? durationOptions[duration].valueInMillis
    : undefined;
  const rangeType = searchParams.get("rangeType");
  const range = searchParams.get("range");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const timeRange = searchParams.get("timeRange");

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
    duration: durationMillis,
    resourceId
  } satisfies Omit<GetJobsHistoryParams, "startsAt" | "endsAt">;

  return useQuery<Response, Error>(
    ["jobs_history", params, rangeType, range, from, to, timeRange],
    () => {
      let startsAt: string | undefined;
      let endsAt: string | undefined;

      if (rangeType === "absolute") {
        startsAt = from ? dayjs(from).toISOString() : undefined;
        endsAt = to ? dayjs(to).toISOString() : undefined;
      } else if (rangeType === "relative") {
        startsAt = range ? parseDateMath(range, false) : undefined;
        endsAt = undefined;
      } else if (rangeType === "mapped") {
        const mapped = mappedOptionsTimeRanges.get(
          (timeRange ?? "") as MappedOptionsDisplay
        )?.();
        startsAt = mapped?.from ? parseDateMath(mapped.from, false) : undefined;
        endsAt = mapped?.to ? parseDateMath(mapped.to, false) : undefined;
      }

      return getJobsHistory({
        ...params,
        startsAt,
        endsAt
      });
    },
    options
  );
}

export function useScraperJobsHistoryForSettingQuery(
  options?: UseQueryOptions<Response, Error>,
  resourceId?: string
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

  const params = {
    pageIndex,
    pageSize,
    resourceType: "config_scraper",
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
    ["jobs_history", "scraper", params],
    () => getJobsHistoryWithArtifacts(params),
    options
  );
}

export function useJobsHistorySummaryForSettingQuery(
  options?: UseQueryOptions<SummaryResponse, Error>
) {
  const [searchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50");
  const name = searchParams.get("name") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const params = {
    pageIndex,
    pageSize,
    name,
    sortBy,
    sortOrder
  } satisfies GetJobsHistorySummaryParams;

  return useQuery<SummaryResponse, Error>(
    ["job_history_summary", params],
    () => getJobsHistorySummary(params),
    options
  );
}
