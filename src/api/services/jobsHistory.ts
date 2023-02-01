import { JobHistory } from "../../components/JobsHistory/JobsHistoryTable";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getJobsHistory = async (
  pageIndex: number,
  pageSize: number,
  resourceType?: string,
  resourceId?: string
) => {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const resourceTypeParam = resourceType
    ? `&resource_type=eq.${resourceType}`
    : "";

  const resourceIdParam = resourceId ? `&resource_id=eq.${resourceId}` : "";

  return resolve(
    IncidentCommander.get<JobHistory[] | null>(
      `/job_history?order=created_at.desc&select=*${pagingParams}${resourceTypeParam}${resourceIdParam}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};
