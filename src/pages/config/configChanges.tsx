import { useMemo, useState } from "react";
import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { ConfigLayout } from "../../components/Layout";

export function ConfigChangesPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const { data, isLoading, error, isRefetching } = useGetAllConfigsChangesQuery(
    pageIndex,
    pageSize,
    true
  );
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
      : error?.message ?? "Something went wrong";

  return (
    <ConfigLayout
      basePath={`configs`}
      isConfigDetails
      title={"Configs"}
      isLoading={isLoading}
    >
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
    </ConfigLayout>
  );
}
