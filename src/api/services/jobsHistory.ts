import { tristateOutputToQueryFilterParam } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { JobHistory } from "../../components/JobsHistory/JobsHistoryTable";
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export type GetJobsHistoryParams = {
  pageIndex: number;
  pageSize: number;
  resourceType?: string;
  resourceId?: string;
  name?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  startsAt?: string;
  endsAt?: string;
  duration?: number;
};

export const getJobsHistory = async ({
  pageIndex,
  pageSize,
  resourceType,
  resourceId,
  name,
  status,
  sortBy,
  sortOrder,
  startsAt,
  endsAt,
  duration
}: GetJobsHistoryParams) => {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const resourceTypeParam = resourceType
    ? tristateOutputToQueryFilterParam(resourceType, "resource_type")
    : "";

  const resourceIdParam = resourceId ? `&resource_id=eq.${resourceId}` : "";

  const nameParam = name ? tristateOutputToQueryFilterParam(name, "name") : "";

  const statusParam = status
    ? tristateOutputToQueryFilterParam(status, "status")
    : "";

  const sortByParam = sortBy ? `&order=${sortBy}` : "&order=created_at";

  const sortOrderParam = sortOrder ? `.${sortOrder}` : ".desc";

  const durationParam = duration ? `&duration_millis=gte.${duration}` : "";

  const rangeParam =
    startsAt && endsAt
      ? `&and=(created_at.gt.${startsAt},created_at.lt.${endsAt})`
      : "";

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<JobHistory[] | null>(
      `/job_histories?&select=*${pagingParams}${resourceTypeParam}${resourceIdParam}${nameParam}${statusParam}${sortByParam}${sortOrderParam}${rangeParam}${durationParam}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export type JobHistoryNames = {
  name: string;
};

export const getJobsHistoryNames = async () => {
  const res = await resolvePostGrestRequestWithPagination(
    IncidentCommander.get<JobHistoryNames[] | null>(
      `/job_history_names?order=name.asc`
    )
  );
  return res.data ?? [];
};
