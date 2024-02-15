import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useJobsHistoryForSettingQuery } from "../../api/query-hooks/useJobsHistoryQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import JobHistoryFilters, {
  durationOptions
} from "./Filters/JobsHistoryFilters";
import JobsHistoryTable from "./JobsHistoryTable";

export default function JobsHistorySettingsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { timeRangeAbsoluteValue } = useTimeRangeParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const resourceType = searchParams.get("resource_type") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const status = searchParams.get("status") ?? "";
  const duration = searchParams.get("runDuration") ?? undefined;
  const durationMillis = duration
    ? durationOptions[duration].valueInMillis
    : undefined;
  const startsAt = timeRangeAbsoluteValue?.from ?? undefined;
  const endsAt = timeRangeAbsoluteValue?.to ?? undefined;

  const { data, isLoading, refetch, isRefetching } =
    useJobsHistoryForSettingQuery(
      {
        pageIndex,
        pageSize,
        resourceType,
        name,
        status,
        sortBy,
        sortOrder,
        startsAt,
        endsAt,
        duration: durationMillis
      },
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
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <JobHistoryFilters />

          <JobsHistoryTable
            jobs={jobs ?? []}
            isLoading={isLoading || isRefetching}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageState={setPageState}
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
        </div>
      </SearchLayout>
    </>
  );
}
