import { useMemo, useState } from "react";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import {
  useJobsHistoryForSettingQuery,
  useJobsHistoryQuery
} from "../../api/query-hooks/useJobsHistoryQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import JobsHistoryTable from "./JobsHistoryTable";

export default function JobsHistorySettingsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const resourceId = searchParams.get("resource_id") ?? "";
  const resourceType = searchParams.get("resource_type") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const status = searchParams.get("status") ?? "";

  const { data, isLoading, refetch, isRefetching } =
    useJobsHistoryForSettingQuery(
      {
        pageIndex,
        pageSize,
        resourceId,
        resourceType,
        name,
        status,
        sortBy,
        sortOrder
      },
      {
        keepPreviousData: true
      }
    );

  const { data: fullJobs } = useJobsHistoryQuery(0, 1000000);

  const jobs = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const formatJobName = (word: string | null) => {
    var wordRe = /($[a-z])|[A-Z][^A-Z]+/g;
    return word?.match(wordRe)?.join(" ");
  };

  const allJobs = fullJobs?.data;
  const resourceTypes = useMemo(() => {
    if (!fullJobs) return [];
    let result = allJobs?.map((a) => a.resource_type).filter((elm) => elm);
    let unique = result
      ?.filter((e, i) => result?.indexOf(e) === i)
      .map((value, index) => ({
        id: `${value}_${index}`,
        label: `${value}`,
        value: `${value}`
      }));
    return [{ label: "All", value: "" }, ...(unique ? unique : [])];
  }, [allJobs]);

  const resourceIds = useMemo(() => {
    if (!fullJobs) return [];
    let result = allJobs?.map((a) => a.resource_id).filter((elm) => elm);
    let unique = result
      ?.filter((e, i) => result?.indexOf(e) === i)
      .map((value, index) => ({
        id: `${value}_${index}`,
        label: `${value}`,
        value: `${value}`
      }));
    return [{ label: "All", value: "" }, ...(unique ? unique : [])];
  }, [allJobs]);

  const jobNames = useMemo(() => {
    if (!fullJobs) return [];
    let result = allJobs?.map((a) => a.name).filter((elm) => elm);
    let unique = result
      ?.filter((e, i) => result?.indexOf(e) === i)
      .map((value, index) => ({
        id: `${value}_${index}`,
        label: `${formatJobName(value)}`,
        value: `${value}`
      }));
    return [{ label: "All", value: "" }, ...(unique ? unique : [])];
  }, [allJobs]);

  const statusOptions = {
    all: {
      id: "0",
      label: "All",
      value: ""
    },
    finished: {
      id: "1",
      label: "Finished",
      value: "FINISHED"
    },
    running: {
      id: "2",
      label: "Running",
      value: "RUNNING"
    }
  };

  const defaultSortLabels = {
    none: {
      id: "0",
      name: "None",
      description: "None",
      value: ""
    },
    name: {
      id: "1",
      name: "Name",
      description: "Name",
      value: "name"
    },
    time_start: {
      id: "2",
      name: "Time Start",
      description: "Time Start",
      value: "time_start"
    },
    time_end: {
      id: "3",
      name: "Time End",
      description: "Time End",
      value: "time_end"
    },
    created_at: {
      id: "4",
      name: "Created At",
      description: "Created At",
      value: "created_at"
    }
  };

  function onSelectSortOption(currentSortBy?: string, newSortByType?: string) {
    currentSortBy = currentSortBy ?? "created_at";
    newSortByType = newSortByType ?? "desc";

    if (currentSortBy === "created_at" && newSortByType === "desc") {
      searchParams.delete("sortBy");
      searchParams.delete("sortOrder");
    } else {
      searchParams.set("sortBy", currentSortBy);
      searchParams.set("sortOrder", newSortByType);
    }
    setSearchParams(searchParams, {
      replace: true
    });
  }

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
          <div className="flex flex-wrap">
            <div className="flex p-3">
              <ReactSelectDropdown
                name="name"
                label=""
                value={name}
                items={jobNames}
                className="inline-block p-3 w-auto max-w-[500px]"
                dropDownClassNames="w-auto max-w-[400px] left-0"
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    name: val
                  });
                }}
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Job Type:
                  </div>
                }
              />
            </div>
            <div className="flex p-3">
              <ReactSelectDropdown
                name="resource_type"
                label=""
                value={resourceType}
                items={resourceTypes}
                className="inline-block p-3 w-auto max-w-[500px]"
                dropDownClassNames="w-auto max-w-[400px] left-0"
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    resource_type: val
                  });
                }}
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Resource Type:
                  </div>
                }
              />
            </div>
            <div className="flex p-3">
              <ReactSelectDropdown
                name="resource_id"
                label=""
                value={resourceId}
                items={resourceIds}
                className="inline-block p-3 w-auto max-w-[500px]"
                dropDownClassNames="w-auto max-w-[400px] left-0"
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    resource_id: val
                  });
                }}
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Resource ID:
                  </div>
                }
              />
            </div>
            <div className="flex p-3">
              <ReactSelectDropdown
                name="status"
                label=""
                value={status}
                items={statusOptions}
                className="inline-block p-3 w-auto max-w-[500px]"
                dropDownClassNames="w-auto max-w-[400px] left-0"
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    status: val
                  });
                }}
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Status:
                  </div>
                }
              />
            </div>
            <div className="flex p-3">
              <ReactSelectDropdown
                name="sort"
                label=""
                value={sortBy}
                items={defaultSortLabels}
                className="inline-block p-3 w-auto max-w-[500px]"
                dropDownClassNames="w-auto max-w-[400px] left-0"
                onChange={(val: any) => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    sortBy: val
                  });
                }}
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    <div className="flex mt-1 cursor-pointer md:mt-0 md:items-center bg-white rounded-md shadow-sm">
                      {sortOrder === "asc" && (
                        <>
                          <BsSortUp
                            className="w-5 h-5 text-gray-700 hover:text-gray-900"
                            onClick={() => onSelectSortOption(sortBy, "desc")}
                          />
                          <span>Sort By:</span>
                        </>
                      )}
                      {sortOrder === "desc" && (
                        <>
                          <BsSortDown
                            className="w-5 h-5 text-gray-700 hover:text-gray-900"
                            onClick={() => onSelectSortOption(sortBy, "asc")}
                          />
                          <span>Sort By:</span>
                        </>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          </div>
          <JobsHistoryTable
            jobs={jobs ?? []}
            isLoading={isLoading}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageState={setPageState}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>
      </SearchLayout>
    </>
  );
}
