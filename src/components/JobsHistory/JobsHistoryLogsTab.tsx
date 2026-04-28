import { useSearchParams } from "react-router-dom";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import JobHistoryFilters from "./Filters/JobsHistoryFilters";
import JobsHistoryTable from "./JobsHistoryTable";

type JobsHistoryLogsTabProps = {
  active: boolean;
};

export default function JobsHistoryLogsTab({
  active
}: JobsHistoryLogsTabProps) {
  const [searchParams] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");

  const { data, isLoading, isRefetching } = useJobsHistoryForSettingQuery({
    keepPreviousData: true,
    enabled: active
  });

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <JobHistoryFilters defaultStatusFilter="SUCCESS:-1,STALE:-1,SKIPPED:-1" />

      <JobsHistoryTable
        jobs={jobs ?? []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        pageCount={pageCount}
        totalJobHistoryItems={totalEntries}
      />
    </>
  );
}
