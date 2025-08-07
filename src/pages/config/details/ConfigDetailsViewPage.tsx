import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import {
  getViewById,
  getViewDataById
} from "@flanksource-ui/api/services/views";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import View from "@flanksource-ui/pages/audit-report/components/View/View";

export function ConfigDetailsViewPage() {
  const { id: configId, viewId } = useParams<{
    id: string;
    viewId: string;
  }>();

  // Get the view metadata to get the title/name for display
  const { data: viewMetadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["viewMetadata", viewId],
    queryFn: () => {
      if (!viewId) {
        throw new Error("View ID is required");
      }
      return getViewById(viewId);
    },
    enabled: !!viewId
  });

  const {
    data: viewData,
    isLoading: isLoadingData,
    error
  } = useQuery({
    queryKey: ["viewDataById", viewId, configId],
    queryFn: () => {
      if (!viewId) {
        throw new Error("View ID is required");
      }
      return getViewDataById(viewId);
    },
    enabled: !!viewId && !!configId
  });

  const viewInfo = viewMetadata?.data?.[0];
  if (!viewInfo) {
    return <div>View not found</div>;
  }

  const isLoading = isLoadingMetadata || isLoadingData;
  const displayName = viewInfo.title || viewInfo.name;

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Config View - ${displayName}`}
      isLoading={isLoading}
      activeTabName={displayName ?? ""}
    >
      <div className="flex h-full flex-1 flex-col overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-xl text-red-500">Error</div>
              <p className="text-gray-600">
                {error instanceof Error
                  ? error.message
                  : "Failed to load view data"}
              </p>
            </div>
          </div>
        ) : viewData ? (
          <View title="" view={viewData} icon="workflow" />
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
