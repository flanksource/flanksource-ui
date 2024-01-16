import { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfigInsightsQuery } from "../../../api/query-hooks/useConfigAnalysisQuery";
import { ConfigAnalysis } from "../../../api/types/configs";
import ConfigInsightsDetailsModal from "./ConfigAnalysisLink/ConfigInsightsDetailsModal";
import { DataTable } from "../../DataTable";
import { InfoMessage } from "../../InfoMessage";
import { ConfigInsightsColumns } from "./ConfigInsightsColumns";

type Props = {
  setIsLoading: (isLoading: boolean) => void;
  triggerRefresh: number;
  configId?: string;
};

export default function ConfigInsightsList({
  setIsLoading,
  triggerRefresh,
  configId
}: Props) {
  const [params, setParams] = useSearchParams();
  const [clickedInsightItem, setClickedInsightItem] =
    useState<ConfigAnalysis>();
  const [isInsightDetailsModalOpen, setIsInsightDetailsModalOpen] =
    useState(false);

  const status = params.get("status") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const type = params.get("type") ?? undefined;
  const analyzer = params.get("analyzer") ?? undefined;
  const component = params.get("component") ?? undefined;

  const sortState: SortingState = useMemo(() => {
    return [
      ...(params.get("sortBy")
        ? [
            {
              id: params.get("sortBy")!,
              desc: params.get("sortOrder") === "desc"
            }
          ]
        : [])
    ];
  }, [params]);

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 200
  });

  const { data, isLoading, refetch, isRefetching, error } =
    useConfigInsightsQuery(
      {
        status,
        severity: severity?.toLowerCase(),
        type,
        analyzer,
        component,
        configId
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

  const columns = useMemo(() => ConfigInsightsColumns, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {error ? (
        <InfoMessage message={error.message} />
      ) : (
        <DataTable
          columns={columns}
          data={configInsights}
          isLoading={isLoading}
          stickyHead
          pagination={pagination}
          tableSortByState={sortState}
          handleRowClick={(row) => {
            setClickedInsightItem(row.original);
            setIsInsightDetailsModalOpen(true);
          }}
          enableServerSideSorting
          onTableSortByChanged={(state) => {
            const getSortBy = Array.isArray(state) ? state : state(sortState);
            if (getSortBy.length > 0) {
              params.set("sortBy", getSortBy[0].id);
              params.set("sortOrder", getSortBy[0].desc ? "desc" : "asc");
            } else {
              params.delete("sortBy");
              params.delete("sortOrder");
            }
            setParams(params);
          }}
        />
      )}

      <ConfigInsightsDetailsModal
        id={clickedInsightItem?.id}
        isOpen={isInsightDetailsModalOpen}
        onClose={() => setIsInsightDetailsModalOpen(false)}
      />
    </>
  );
}
