import { useMemo, useState } from "react";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import JobsHistoryTable from "../JobsHistory/JobsHistoryTable";
import ErrorPage from "../Errors/ErrorPage";
import { useSearchParams } from "react-router-dom";

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
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const resourceType = useMemo(() => resourceTypeMap[tableName], [tableName]);

  const { isLoading, data, error } = useJobsHistoryForSettingQuery(
    { pageIndex, pageSize, resourceId, resourceType, sortBy, sortOrder },
    {
      keepPreviousData: true
    }
  );

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;

  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {!data && error && !isLoading ? (
        <ErrorPage error={error} />
      ) : (
        <JobsHistoryTable
          jobs={jobs ?? []}
          isLoading={isLoading}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageState={setPageState}
          hiddenColumns={["resource_id", "resource_type"]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChanged={(sortBy) => {
            const sort = typeof sortBy === "function" ? sortBy([]) : sortBy;
            if (sort.length === 0) {
              searchParams.delete("sortBy");
              searchParams.delete("sortOrder");
            } else {
              searchParams.set("sortBy", sort[0]?.id);
              searchParams.set("sortOrder", sort[0].desc ? "desc" : "asc");
            }
            setSearchParams(searchParams);
          }}
        />
      )}
    </div>
  );
}
