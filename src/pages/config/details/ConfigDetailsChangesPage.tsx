import { getConfigsRelatedChanges } from "@flanksource-ui/api/services/configs";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { areDeletedConfigChangesHidden } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigChangesToggledDeletedItems";
import { ConfigRelatedChangesFilters } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelatedChangesFilters";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { PaginationOptions } from "@flanksource-ui/components/DataTable";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [hideDeletedConfigChanges] = useAtom(areDeletedConfigChangesHidden);
  const { timeRangeValue } = useTimeRangeParams(configChangesDefaultDateFilter);
  const [params, setParams] = useSearchParams();
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const relationshipType = params.get("relationshipType") ?? "none";
  const from = timeRangeValue?.from ?? undefined;
  const to = timeRangeValue?.to ?? undefined;
  const sortBy = params.get("sortBy") ?? "created_at";
  const sortDirection = params.get("sortDirection") ?? "desc";
  const configType = params.get("configType") ?? "all";
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "config",
      "changes",
      id,
      hideDeletedConfigChanges,
      relationshipType,
      severity,
      change_type,
      from,
      to,
      configType,
      sortBy,
      sortDirection,
      page,
      pageSize
    ],
    queryFn: () =>
      getConfigsRelatedChanges({
        id: id!,
        type_filter: relationshipType as any,
        include_deleted_configs: hideDeletedConfigChanges !== "yes",
        changeType: change_type,
        severity,
        from,
        to,
        configType,
        sortBy,
        sortOrder: sortDirection === "desc" ? "desc" : "asc",
        page: page,
        pageSize: pageSize
      }),
    enabled: !!id,
    keepPreviousData: true
  });

  const changes = data?.changes ?? [];

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

  const linkConfig =
    relationshipType !== "none" && relationshipType !== undefined;

  const sortState: SortingState = [
    {
      id: sortBy,
      desc: sortDirection === "desc"
    }
  ];

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : (error as any)?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Changes"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Changes"
    >
      <div className={`flex flex-col flex-1 h-full overflow-y-auto`}>
        <div className="flex flex-col flex-1 items-start gap-2 overflow-y-auto">
          <ConfigRelatedChangesFilters />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <ConfigChangeHistory
              linkConfig={linkConfig}
              data={changes}
              isLoading={isLoading}
              sortBy={sortState}
              setSortBy={(sort) => {
                const sortBy = Array.isArray(sort) ? sort : sort(sortState);
                if (sortBy.length === 0) {
                  params.delete("sortBy");
                  params.delete("sortDirection");
                } else {
                  params.set("sortBy", sortBy[0]?.id);
                  params.set("sortDirection", sortBy[0].desc ? "desc" : "asc");
                }
                setParams(params);
              }}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
