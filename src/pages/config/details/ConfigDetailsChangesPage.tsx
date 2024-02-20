import { getConfigsRelatedChanges } from "@flanksource-ui/api/services/configs";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { areDeletedConfigChangesHidden } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigChangesToggledDeletedItems";
import { ConfigRelatedChangesFilters } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigRelatedChangesFilters";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useParams, useSearchParams } from "react-router-dom";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [hideDeletedConfigChanges] = useAtom(areDeletedConfigChangesHidden);
  const { timeRangeAbsoluteValue } = useTimeRangeParams(
    configChangesDefaultDateFilter
  );
  const [params, setParams] = useSearchParams();
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const relationshipType = params.get("relationshipType") ?? "none";
  const starts_at = timeRangeAbsoluteValue?.from ?? undefined;
  const ends_at = timeRangeAbsoluteValue?.to ?? undefined;
  const sortBy = params.get("sortBy") ?? "created_at";
  const sortDirection = params.get("sortDirection") ?? "desc";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "config",
      "changes",
      id,
      hideDeletedConfigChanges,
      relationshipType,
      severity,
      change_type,
      starts_at,
      ends_at,
      sortBy,
      sortDirection
    ],
    queryFn: () =>
      getConfigsRelatedChanges(
        id!,
        relationshipType,
        hideDeletedConfigChanges !== "yes",
        change_type,
        severity,
        starts_at,
        ends_at,
        sortBy,
        sortDirection as "asc" | "desc"
      ),
    enabled: !!id
  });

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
              data={data ?? []}
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
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
