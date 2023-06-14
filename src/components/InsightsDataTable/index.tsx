import { useMemo, useState } from "react";
import { SortingState } from "@tanstack/react-table";
import { DataTable } from "../DataTable";
import { ConfigTypeInsights } from "../ConfigInsights";
import { ConfigInsightsColumns } from "../ConfigAnalysis/ConfigInsightsColumns";
import ConfigInsightsDetailsModal from "../ConfigAnalysisLink/ConfigInsightsDetailsModal";
import { ConfigItem } from "../../api/services/configs";

type Props = {
  data: ConfigTypeInsights[];
  isLoading?: boolean;
  pagination?: any;
  params: URLSearchParams;
  setParams: (data: URLSearchParams) => void;
};

export default function InsightsDataTable({
  data,
  isLoading,
  pagination,
  params,
  setParams
}: Props) {
  const [clickedInsightItem, setClickedInsightItem] = useState<
    ConfigTypeInsights & { config?: ConfigItem }
  >();
  const [isInsightDetailsModalOpen, setIsInsightDetailsModalOpen] =
    useState(false);

  const columns = useMemo(() => ConfigInsightsColumns, []);
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

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
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
        preferencesKey={""}
        savePreferences={false}
      />

      <ConfigInsightsDetailsModal
        configInsight={clickedInsightItem}
        isOpen={isInsightDetailsModalOpen}
        onClose={() => setIsInsightDetailsModalOpen(false)}
      />
    </>
  );
}
