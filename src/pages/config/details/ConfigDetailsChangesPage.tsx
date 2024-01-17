import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetConfigChangesByConfigIdQuery } from "@flanksource-ui/api/query-hooks";
import { ConfigChangeHistory } from "@flanksource-ui/components/Configs/Changes/ConfigChangeHistory";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { ConfigChangeFilters } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesFilters";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const [params] = useSearchParams();
  const change_type = params.get("change_type") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const starts_at = params.get("starts") ?? undefined;
  const ends_at = params.get("ends") ?? undefined;
  const {
    data: historyData,
    isLoading,
    isRefetching,
    error,
    refetch
  } = useGetConfigChangesByConfigIdQuery(
    id!,
    pageIndex,
    pageSize,
    true,
    starts_at,
    ends_at,
    severity,
    change_type
  );
  const totalEntries = (historyData as any)?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading || isRefetching
    };
  }, [pageIndex, pageSize, pageCount, isLoading, isRefetching]);

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
          <ConfigChangeFilters hideConfigTypeFilter />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <ConfigChangeHistory
              data={historyData?.data ?? []}
              isLoading={isLoading}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
