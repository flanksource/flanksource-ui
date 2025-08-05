import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { getViewData } from "@flanksource-ui/api/services/views";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Loading } from "@flanksource-ui/ui/Loading";
import View from "@flanksource-ui/pages/audit-report/components/View/View";

export function ConfigDetailsViewPage() {
  const { id, viewName } = useParams<{ id: string; viewName: string }>();

  const {
    data: viewData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["viewData", viewName, id],
    queryFn: () => getViewData("default", viewName!, { "X-Config-ID": id! }),
    enabled: !!id && !!viewName
  });

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Config View - ${viewName}`}
      isLoading={isLoading}
      activeTabName={viewName!}
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
