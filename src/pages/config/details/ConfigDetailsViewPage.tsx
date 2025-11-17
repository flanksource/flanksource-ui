import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import {
  getViewDataById,
  getViewDisplayPluginVariables
} from "@flanksource-ui/api/services/views";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import View from "@flanksource-ui/pages/audit-report/components/View/View";
import { useRef } from "react";
import { toastError } from "@flanksource-ui/components/Toast/toast";

// Displays the view as a tab in the config details page
export function ConfigDetailsViewPage() {
  const queryClient = useQueryClient();
  const forceRefreshRef = useRef(false);

  const { id: configId, viewId } = useParams<{
    id: string;
    viewId: string;
  }>();

  // Fetch display plugin variables from the API
  const { data: variables } = useQuery({
    queryKey: ["viewDisplayPluginVariables", viewId, configId],
    queryFn: () => getViewDisplayPluginVariables(viewId!, configId!),
    enabled: !!viewId && !!configId
  });

  const {
    data: viewResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["viewDataById", viewId, configId, variables],
    queryFn: () => {
      if (!viewId) {
        throw new Error("View ID is required");
      }
      const headers = forceRefreshRef.current
        ? { "cache-control": "max-age=1" }
        : undefined;

      return getViewDataById(viewId, variables, headers);
    },
    enabled: !!viewId && !!configId && !!variables
  });

  const handleRefresh = async () => {
    forceRefreshRef.current = true;
    const result = await refetch();
    forceRefreshRef.current = false;

    if (result.isError) {
      toastError(
        result.error instanceof Error
          ? result.error.message
          : "Failed to refresh view"
      );
    } else if (result.data?.namespace && result.data?.name) {
      await queryClient.invalidateQueries({
        queryKey: ["view-table", result.data.namespace, result.data.name]
      });
    }
  };

  const displayName = viewResult?.title || viewResult?.name || "";

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Config View - ${displayName}`}
      isLoading={isLoading}
      activeTabName={displayName}
      refetch={handleRefresh}
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
