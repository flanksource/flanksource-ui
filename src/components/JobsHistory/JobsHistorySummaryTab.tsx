import { useSearchParams } from "react-router-dom";
import { useJobsHistorySummaryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import JobHistorySummary from "./JobHistorySummary";

type JobsHistorySummaryTabProps = {
  active: boolean;
};

export default function JobsHistorySummaryTab({
  active
}: JobsHistorySummaryTabProps) {
  const [searchParams] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50");

  const { data, isLoading, isRefetching } =
    useJobsHistorySummaryForSettingQuery({
      keepPreviousData: true,
      enabled: active
    });

  const summary = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <JobHistorySummary
      data={summary ?? []}
      isLoading={isLoading}
      isRefetching={isRefetching}
      pageCount={pageCount}
      totalEntries={totalEntries}
    />
  );
}
