import { useSearchParams } from "react-router-dom";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import ErrorPage from "../Errors/ErrorPage";
import JobsHistoryTable from "../JobsHistory/JobsHistoryTable";

type SchemaResourceJobsTabProps = {
  tableName: keyof typeof resourceTypeMap;
  resourceId: string;
};

export const resourceTypeMap = {
  teams: "team",
  incident_rules: "incident_rule",
  config_scrapers: "config_scraper",
  topologies: "topology",
  canaries: "canary"
} as const;

export function SchemaResourceJobsTab({
  resourceId,
  tableName
}: SchemaResourceJobsTabProps) {
  const [searchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");

  const { isLoading, data, error } = useJobsHistoryForSettingQuery(
    {
      keepPreviousData: true
    },
    resourceId,
    tableName
  );

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;

  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {!data && error && !isLoading ? (
        <ErrorPage error={error} />
      ) : (
        <JobsHistoryTable
          jobs={jobs ?? []}
          isLoading={isLoading}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          hiddenColumns={["resource_id", "resource_type", "resource_name"]}
        />
      )}
    </div>
  );
}
