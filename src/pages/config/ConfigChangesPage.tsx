import { useGetAllConfigsChangesQuery } from "@flanksource-ui/api/query-hooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { PaginationOptions } from "@flanksource-ui/components/DataTable";
import { Head } from "@flanksource-ui/components/Head/Head";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/components/SlidingSideBar";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { SortingState } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const { timeRangeAbsoluteValue } = useTimeRangeParams(
    configChangesDefaultDateFilter
  );
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const itemsPerPage = 50;

  const [params, setParams] = useSearchParams();
  const configType = params.get("configType") ?? undefined;
  const changeType = params.get("changeType") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const startsAt = timeRangeAbsoluteValue?.from ?? undefined;
  const endsAt = timeRangeAbsoluteValue?.to ?? undefined;
  const pageSize = +(params.get("pageSize") ?? itemsPerPage);
  const page = +(params.get("pageIndex") ?? 0);

  const sortBy = params.get("sortBy") ?? "created_at";
  const sortDirection = params.get("sortDirection") === "asc" ? "asc" : "desc";

  const sortState: SortingState = [
    {
      id: sortBy,
      desc: sortDirection === "desc"
    }
  ];

  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(
      {
        configType: configType,
        severity,
        startsAt: startsAt,
        endsAt: endsAt,
        changeType: changeType,
        sortBy: sortBy,
        sortDirection: sortDirection
      },
      page,
      pageSize,
      true
    );
  const totalEntries = (data as any)?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    const pagination: PaginationOptions = {
      setPagination: (updater) => {
        const newParams =
          typeof updater === "function"
            ? updater({
                pageIndex: page,
                pageSize
              })
            : updater;
        params.set("pageIndex", newParams.pageIndex.toString());
        params.set("pageSize", newParams.pageSize.toString());
        setParams(params);
      },
      pageIndex: page,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading || isRefetching
    };
    return pagination;
  }, [page, pageSize, pageCount, isLoading, isRefetching, params, setParams]);

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Record<string, string>)?.message ?? "Something went wrong";

  return (
    <>
      <Head prefix="Catalog Changes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key="config-catalog-changes-root">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild
                link="/catalog/changes"
                key="config-catalog-changes"
              >
                Changes
              </BreadcrumbChild>,
              ...(configType
                ? [
                    <BreadcrumbChild
                      link={`/catalog?configType=${configType}`}
                      key={configType}
                    >
                      <ConfigsTypeIcon
                        config={{ type: configType }}
                        showSecondaryIcon
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : [])
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
        }}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Changes">
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <>
              <ConfigChangeFilters paramsToReset={["pageIndex", "pageSize"]} />
              <ConfigChangeHistory
                data={data?.data ?? []}
                isLoading={isLoading}
                linkConfig
                pagination={pagination}
                sortBy={sortState}
                setSortBy={(sort) => {
                  const sortBy = Array.isArray(sort) ? sort : sort(sortState);
                  if (sortBy.length === 0) {
                    params.delete("sortBy");
                    params.delete("sortDirection");
                  } else {
                    params.set("sortBy", sortBy[0]?.id);
                    params.set(
                      "sortDirection",
                      sortBy[0].desc ? "desc" : "asc"
                    );
                  }
                  setParams(params);
                }}
              />
            </>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
