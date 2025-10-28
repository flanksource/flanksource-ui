import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { getViewDataById } from "@flanksource-ui/api/services/views";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import View from "@flanksource-ui/pages/audit-report/components/View/View";

// Displays the view as a tab in the config details page
export function ConfigDetailsViewPage() {
  const { id: configId, viewId } = useParams<{
    id: string;
    viewId: string;
  }>();

  const {
    data: viewResult,
    isLoading,
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

  if (!viewResult) {
    return <div>View not found</div>;
  }

  const displayName = viewResult.title || viewResult.name;

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
        ) : viewResult ? (
          <View
            title=""
            namespace={viewResult.namespace}
            name={viewResult.name}
            panels={viewResult.panels}
            columns={viewResult.columns}
            requestFingerprint={viewResult.requestFingerprint}
            columnOptions={viewResult.columnOptions}
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
