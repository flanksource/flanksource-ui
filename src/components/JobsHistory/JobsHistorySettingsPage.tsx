import { useState } from "react";
import { useJobsHistoryQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import JobsHistoryTable from "./JobsHistoryTable";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";

export default function JobsHistorySettingsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { data, isLoading, refetch, isRefetching } = useJobsHistoryQuery(
    pageIndex,
    pageSize,
    {
      keepPreviousData: true
    }
  );

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;

  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <Head prefix="Settings - Job History" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/jobs">Job History</BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <JobsHistoryTable
            jobs={jobs ?? []}
            isLoading={isLoading}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageState={setPageState}
          />
        </div>
      </SearchLayout>
    </>
  );
}
