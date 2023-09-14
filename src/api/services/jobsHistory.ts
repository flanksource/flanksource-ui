import { JobHistory } from "../../components/JobsHistory/JobsHistoryTable";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getJobsHistory = async (
  pageIndex: number,
  pageSize: number,
  resourceType?: string,
  resourceId?: string,
  name?: string,
  status?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const resourceTypeParam = resourceType
    ? `&resource_type=eq.${resourceType}`
    : "";

  const resourceIdParam = resourceId ? `&resource_id=eq.${resourceId}` : "";

  const nameParam = name ? `&name=eq.${name}` : "";

  const statusParam = status ? `&status=eq.${status}` : "";

  const sortByParam = sortBy ? `&order=${sortBy}` : "&order=created_at";

  const sortOrderParam = sortOrder ? `.${sortOrder}` : ".desc";

  return resolve(
    IncidentCommander.get<JobHistory[] | null>(
      `/job_history?&select=*${pagingParams}${resourceTypeParam}${resourceIdParam}${nameParam}${statusParam}${sortByParam}${sortOrderParam}`,
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
  const res = await resolve(
    IncidentCommander.get<JobHistoryNames[] | null>(
      `/job_history_names?order=name.asc`
    )
  );
  return res.data ?? [];
};
