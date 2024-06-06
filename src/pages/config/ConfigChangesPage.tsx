import { useGetConfigsChangesQuery } from "@flanksource-ui/api/query-hooks";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { Head } from "@flanksource-ui/components/Head/Head";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { SortingState, Updater } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigChangesPage() {
  const { timeRangeValue } = useTimeRangeParams(configChangesDefaultDateFilter);
  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const [params, setParams] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });
  const configTypes = params.get("configTypes") ?? undefined;
  const configType = params.get("configType") ?? undefined;
  const changeType = params.get("changeType") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const from = timeRangeValue?.from ?? undefined;
  const to = timeRangeValue?.to ?? undefined;
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";
  const sortBy = params.get("sortBy") ?? undefined;
  const sortDirection = params.get("sortDirection") === "asc" ? "asc" : "desc";
  const configId = params.get("id") ?? undefined;
  const changeSummary = params.get("summary") ?? undefined;
  const source = params.get("source") ?? undefined;
  const createdBy = params.get("created_by") ?? undefined;
  const externalCreatedBy = params.get("external_created_by") ?? undefined;

  const arbitraryFilter = useMemo(() => {
    const filter = new Map<string, string>();
    if (configId) {
      filter.set("id", configId);
    }
    if (changeSummary) {
      filter.set("summary", changeSummary);
    }
    if (source) {
      filter.set("source", source);
    }
    if (createdBy) {
      filter.set("created_by", createdBy);
    }
    if (externalCreatedBy) {
      filter.set("created_by", externalCreatedBy);
    }
    return Object.fromEntries(filter);
  }, [changeSummary, configId, createdBy, externalCreatedBy, source]);

  const sortState: SortingState = useMemo(
    () => [
      ...(sortBy
        ? [
            {
              id: sortBy,
              desc: sortDirection === "desc"
            }
          ]
        : [])
    ],
    [sortBy, sortDirection]
  );

  const { data, isLoading, error, isRefetching, refetch } =
    useGetConfigsChangesQuery(
      {
        include_deleted_configs: false,
        changeType,
        severity,
        from,
        to,
        configTypes,
        configType,
        sortBy,
        sortOrder: sortDirection === "desc" ? "desc" : "asc",
        page: page,
        pageSize: pageSize,
        arbitraryFilter
      },
      {
        keepPreviousData: true
      }
    );

  const changes = (data?.changes ?? []).map((changes) => ({
    ...changes,
    config: {
      id: changes.config_id!,
      type: changes.type!,
      name: changes.name!
    }
  }));

  const totalChanges = data?.total ?? 0;
  const totalChangesPages = Math.ceil(totalChanges / parseInt(pageSize));

  const pagination = useMemo(() => {
    const pagination: PaginationOptions = {
      setPagination: (updater) => {
        const newParams =
          typeof updater === "function"
            ? updater({
                pageIndex: parseInt(page) - 1,
                pageSize: parseInt(pageSize)
              })
            : updater;
        params.set("page", (newParams.pageIndex + 1).toString());
        params.set("pageSize", newParams.pageSize.toString());
        setParams(params);
      },
      pageIndex: parseInt(page) - 1,
      pageSize: parseInt(pageSize),
      pageCount: totalChangesPages,
      remote: true,
      enable: true,
      loading: isLoading
    };
    return pagination;
  }, [page, pageSize, totalChangesPages, isLoading, params, setParams]);

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Record<string, string>)?.message ?? "Something went wrong";

  const updateSortBy = useCallback(
    (sort: Updater<SortingState>) => {
      const sortBy = Array.isArray(sort) ? sort : sort(sortState);
      if (sortBy.length === 0) {
        params.delete("sortBy");
        params.delete("sortDirection");
      } else {
        params.set("sortBy", sortBy[0]?.id);
        params.set("sortDirection", sortBy[0].desc ? "desc" : "asc");
      }
      setParams(params);
    },
    [params, setParams, sortState]
  );

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
              </BreadcrumbChild>
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
        }}
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Changes">
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <>
              <ConfigChangeFilters
                paramsToReset={["page"]}
                arbitraryFilters={arbitraryFilter}
              />
              <ConfigChangeHistory
                data={changes}
                isLoading={isLoading}
                linkConfig
                pagination={pagination}
                sortBy={sortState}
                onTableSortByChanged={updateSortBy}
              />
            </>
          )}
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
