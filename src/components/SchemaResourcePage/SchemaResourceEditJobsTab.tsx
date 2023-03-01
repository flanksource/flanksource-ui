import { useMemo, useState } from "react";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import JobsHistoryTable from "../JobsHistory/JobsHistoryTable";

type SchemaResourceJobsTabProps = {
  tableName: keyof typeof resourceTypeMap;
  resourceId: string;
};

export const resourceTypeMap = {
  teams: "team",
  incident_rules: "incident_rule",
  config_scrapers: "config_scraper",
  templates: "template",
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

  const resourceType = useMemo(() => resourceTypeMap[tableName], [tableName]);

  const { isLoading, data } = useJobsHistoryForSettingQuery(
    { pageIndex, pageSize, resourceId, resourceType },
    {
      keepPreviousData: true
    }
  );

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;

  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <JobsHistoryTable
        jobs={jobs ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageState={setPageState}
      />
    </div>
  );
}
