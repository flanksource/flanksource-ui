import { useMemo, useState } from "react";
import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigsPageTabs } from "../../components/ConfigsPage/ConfigsPageTabs";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";

export function ConfigChangesPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const { data, isLoading, error, isRefetching, refetch } =
    useGetAllConfigsChangesQuery(pageIndex, pageSize, true);
  const totalEntries = (data as any)?.totalEntries;
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

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as Record<string, string>)?.message ?? "Something went wrong";

  return (
    <SearchLayout
      title={
        <div className="flex space-x-2">
          <span className="text-lg">Config Changes</span>
        </div>
      }
      onRefresh={refetch}
      loading={isLoading}
      contentClass="p-0 h-full"
    >
      <div className={`flex flex-row min-h-full h-auto`}>
        <div
          className={`flex flex-col flex-1 p-6 pb-0 min-h-full h-auto overflow-auto`}
        >
          <ConfigsPageTabs basePath={"configs"} />
          {error ? (
            <InfoMessage message={errorMessage} />
          ) : (
            <ConfigChangeHistory
              data={data?.data ?? []}
              isLoading={isLoading}
              linkConfig
              pagination={pagination}
            />
          )}
        </div>
        <ConfigSidebar />
      </div>
    </SearchLayout>
  );
}
