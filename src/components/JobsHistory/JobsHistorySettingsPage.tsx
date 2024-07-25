import { useSearchParams } from "react-router-dom";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import JobHistoryFilters from "./Filters/JobsHistoryFilters";
import JobsHistoryTable from "./JobsHistoryTable";

export default function JobsHistorySettingsPage() {
  const [searchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "150");

  const { data, isLoading, refetch, isRefetching } =
    useJobsHistoryForSettingQuery({
      keepPreviousData: true
    });

  const jobs = data?.data;
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
          <JobHistoryFilters />

          <JobsHistoryTable
            jobs={jobs ?? []}
            isLoading={isLoading || isRefetching}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </div>
      </SearchLayout>
    </>
  );
}
