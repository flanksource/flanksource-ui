import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { getViewData } from "@flanksource-ui/api/services/views";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import View from "@flanksource-ui/pages/audit-report/components/View/View";

export function ConfigDetailsViewPage() {
  const {
    id: configId,
    name,
    namespace
  } = useParams<{
    id: string;
    name: string;
    namespace: string;
  }>();

  const {
    data: viewData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["viewData", namespace, name, configId],
    queryFn: () => getViewData(namespace!, name!, { "X-Config-ID": configId! }),
    enabled: !!configId && !!name
  });

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Config View - ${name}`}
      isLoading={isLoading}
      activeTabName={name!}
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
