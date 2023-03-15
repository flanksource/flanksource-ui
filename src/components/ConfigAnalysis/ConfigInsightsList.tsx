import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigInsightsQuery } from "../../api/query-hooks/useConfigAnalysisQuery";
import { InfoMessage } from "../InfoMessage";
import InsightsDataTable from "../InsightsDataTable";

type Props = {
  setIsLoading: (isLoading: boolean) => void;
  triggerRefresh: number;
};

export default function ConfigInsightsList({
  setIsLoading,
  triggerRefresh
}: Props) {
  const [params, setParams] = useSearchParams();

  const status = params.get("status") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const type = params.get("type") ?? undefined;

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 200
  });

  const { data, isLoading, refetch, isRefetching, error } =
    useConfigInsightsQuery(
      {
        status,
        severity,
        type
      },
      {
        sortBy: params.get("sortBy") ?? undefined,
        sortOrder: params.get("sortOrder") as "asc" | "desc" | undefined
      },
      {
        pageIndex,
        pageSize
      },
      {
        keepPreviousData: true,
        onSuccess: () => setIsLoading(false)
      }
    );

  useMemo(() => {
    setIsLoading(true);
    refetch();
    // we only want to trigger this effect when the triggerRefresh changes and
    // not other dependencies, as this may cause race conditions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  const configInsights = data?.data || [];

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

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {error ? (
        <InfoMessage message={error.message} />
      ) : (
        <InsightsDataTable
          data={configInsights}
          isLoading={isLoading}
          pagination={pagination}
          params={params}
          setParams={setParams}
        />
      )}
    </>
  );
}
