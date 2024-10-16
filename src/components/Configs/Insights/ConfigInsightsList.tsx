import useFetchConfigInsights from "@flanksource-ui/api/query-hooks/useFetchConfigInsights";
import { ConfigAnalysis } from "@flanksource-ui/api/types/configs";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { InfoMessage } from "../../InfoMessage";
import ConfigInsightsDetailsModal from "./ConfigAnalysisLink/ConfigInsightsDetailsModal";
import { ConfigInsightsColumns as configInsightsColumns } from "./ConfigInsightsColumns";

type Props = {
  setIsLoading: (isLoading: boolean) => void;
  triggerRefresh: number;
  configId?: string;
  columnsToHide?: string[];
};

export default function ConfigInsightsList({
  setIsLoading,
  triggerRefresh,
  configId,
  columnsToHide = []
}: Props) {
  const [params] = useSearchParams();
  const [clickedInsightItem, setClickedInsightItem] =
    useState<ConfigAnalysis>();
  const [isInsightDetailsModalOpen, setIsInsightDetailsModalOpen] =
    useState(false);

  const pageSize = +(params.get("pageSize") ?? 50);

  const { data, isLoading, refetch, isRefetching, error } =
    useFetchConfigInsights(setIsLoading, configId);

  useEffect(() => {
    setIsLoading(true);
    refetch();
    // we only want to trigger this effect when the triggerRefresh changes and
    // not other dependencies, as this may cause race conditions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  const configInsights = data?.data ?? [];

  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {error ? (
        <InfoMessage message={error.message} />
      ) : (
        <MRTDataTable
          data={configInsights}
          isLoading={isLoading || isRefetching}
          hiddenColumns={columnsToHide}
          onRowClick={(row) => {
            setClickedInsightItem(row);
            setIsInsightDetailsModalOpen(true);
          }}
          enableServerSideSorting
          totalRowCount={totalEntries}
          manualPageCount={pageCount}
          columns={configInsightsColumns}
          disableHiding
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
