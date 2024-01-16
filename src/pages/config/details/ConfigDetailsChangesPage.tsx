import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigChangesByConfigIdQuery } from "../../../api/query-hooks";
import { ConfigChangeHistory } from "../../../components/Configs/Changes/ConfigChangeHistory";
import { ConfigDetailsTabs } from "../../../components/Configs/ConfigDetailsTabs";
import { InfoMessage } from "../../../components/InfoMessage";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const {
    data: historyData,
    isLoading,
    isRefetching,
    error,
    refetch
  } = useGetConfigChangesByConfigIdQuery(id!, pageIndex, pageSize);
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
      <div className={`flex flex-col flex-1 p-6 pb-0 h-full`}>
        <div className="flex flex-col items-start overflow-y-auto">
          <ConfigChangeHistory
            data={historyData?.data ?? []}
            isLoading={isLoading}
            pagination={pagination}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
