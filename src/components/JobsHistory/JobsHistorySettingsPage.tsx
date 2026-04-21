import { useSearchParams } from "react-router-dom";
import { useJobsHistorySummaryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import JobHistorySummary from "./JobHistorySummary";

export default function JobsHistorySettingsPage() {
  const [searchParams] = useSearchParams();

  const pageSize = parseInt(searchParams.get("pageSize") ?? "50");

  const { data, isLoading, refetch, isRefetching } =
    useJobsHistorySummaryForSettingQuery({
      keepPreviousData: true
    });

  const summary = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

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
          <JobHistorySummary
            data={summary ?? []}
            isLoading={isLoading}
            isRefetching={isRefetching}
            pageCount={pageCount}
            totalEntries={totalEntries}
          />
        </div>
      </SearchLayout>
    </>
  );
}
