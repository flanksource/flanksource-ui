import { useSearchParams } from "react-router-dom";
import {
  useJobsHistoryForSettingQuery,
  useJobsHistorySummaryForSettingQuery
} from "../../api/query-hooks/useJobsHistoryQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";
import JobHistoryFilters from "./Filters/JobsHistoryFilters";
import JobHistorySummary from "./JobHistorySummary";
import JobsHistoryTable from "./JobsHistoryTable";

type JobsHistoryTab = "summary" | "logs";

export default function JobsHistorySettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: JobsHistoryTab =
    searchParams.get("tab") === "logs" ? "logs" : "summary";
  const pageSize = parseInt(
    searchParams.get("pageSize") ?? (activeTab === "logs" ? "150" : "50")
  );

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching
  } = useJobsHistorySummaryForSettingQuery({
    keepPreviousData: true,
    enabled: activeTab === "summary"
  });

  const {
    data: logsData,
    isLoading: isLogsLoading,
    refetch: refetchLogs,
    isRefetching: isLogsRefetching
  } = useJobsHistoryForSettingQuery({
    keepPreviousData: true,
    enabled: activeTab === "logs"
  });

  const summary = summaryData?.data;
  const summaryTotalEntries = summaryData?.totalEntries;
  const summaryPageCount = summaryTotalEntries
    ? Math.ceil(summaryTotalEntries / pageSize)
    : -1;

  const jobs = logsData?.data;
  const logsTotalEntries = logsData?.totalEntries;
  const logsPageCount = logsTotalEntries
    ? Math.ceil(logsTotalEntries / pageSize)
    : -1;

  const isLoading = activeTab === "summary" ? isSummaryLoading : isLogsLoading;
  const isRefetching =
    activeTab === "summary" ? isSummaryRefetching : isLogsRefetching;
  const refetch = activeTab === "summary" ? refetchSummary : refetchLogs;

  const setActiveTab = (tab: JobsHistoryTab) => {
    setSearchParams((params) => {
      params.set("tab", tab);
      params.delete("pageIndex");
      return params;
    });
  };

  return (
    <>
      <Head prefix="Job History" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"history"} link="/settings/jobs">
                Job History
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <Tabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            contentClassName="flex min-h-0 flex-1 flex-col bg-white"
          >
            <Tab
              label="Summary"
              value="summary"
              className="mt-4 flex min-h-0 flex-1 flex-col"
            >
              <JobHistorySummary
                data={summary ?? []}
                isLoading={isSummaryLoading}
                isRefetching={isSummaryRefetching}
                pageCount={summaryPageCount}
                totalEntries={summaryTotalEntries}
              />
            </Tab>
            <Tab
              label="Logs"
              value="logs"
              className="flex min-h-0 flex-1 flex-col"
            >
              <JobHistoryFilters defaultStatusFilter={null} />

              <JobsHistoryTable
                jobs={jobs ?? []}
                isLoading={isLogsLoading}
                isRefetching={isLogsRefetching}
                pageCount={logsPageCount}
                totalJobHistoryItems={logsTotalEntries}
              />
            </Tab>
          </Tabs>
        </div>
      </SearchLayout>
    </>
  );
}
