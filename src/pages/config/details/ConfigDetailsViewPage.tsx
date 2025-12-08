import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import { useViewData } from "@flanksource-ui/pages/views/hooks/useViewData";
import ViewWithSections from "@flanksource-ui/pages/views/components/ViewWithSections";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

export function ConfigDetailsViewPage() {
  const { id: configId, viewId } = useParams<{
    id: string;
    viewId: string;
  }>();

  const {
    viewResult,
    isLoading,
    error,
    aggregatedVariables,
    currentVariables,
    handleForceRefresh
  } = useViewData({
    viewId: viewId!,
    configId
  });

  const displayName = viewResult?.title || viewResult?.name || "";

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Config View - ${displayName}`}
      isLoading={isLoading}
      activeTabName={displayName}
      refetch={handleForceRefresh}
    >
      <div className="">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ErrorViewer error={error} className="max-w-3xl" />
          </div>
        ) : viewResult ? (
          <ViewWithSections
            viewResult={viewResult}
            aggregatedVariables={aggregatedVariables}
            currentVariables={currentVariables}
            hideVariables
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-xl text-gray-500">No view data</div>
              <p className="text-gray-600">No data available for this view.</p>
            </div>
          </div>
        )}
      </div>
    </ConfigDetailsTabs>
  );
}
