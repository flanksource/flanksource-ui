import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewDataById } from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import { Head } from "../../../ui/Head";
import { Icon } from "../../../ui/Icons/Icon";
import { SearchLayout } from "../../../ui/Layout/SearchLayout";
import { BreadcrumbNav, BreadcrumbRoot } from "../../../ui/BreadcrumbNav";
import Age from "../../../ui/Age/Age";

interface SingleViewProps {
  id: string;
}

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const [error, setError] = useState<string>();
  const [currentGlobalFilters, setCurrentGlobalFilters] = useState<
    Record<string, string>
  >({});
  const queryClient = useQueryClient();

  // Fetch all the view metadata, panel results and the column definitions
  // NOTE: This doesn't fetch the table rows.
  // Use currentGlobalFilters in the query key so it updates when filters change
  const {
    data: viewResult,
    isLoading,
    error: viewDataError
  } = useQuery({
    queryKey: ["view-result", id, currentGlobalFilters],
    queryFn: () => {
      console.log("useQuery running with filters:", currentGlobalFilters);
      return getViewDataById(id, currentGlobalFilters);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (viewDataError) {
      setError(
        viewDataError instanceof Error
          ? viewDataError.message
          : "Failed to fetch view data"
      );
      return;
    }
    setError(undefined);
  }, [viewDataError]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading view results...</p>
        </div>
      </div>
    );
  }

  if (!viewResult) {
    // FIXME: No view result does not mean the view is not found.
    // we need to display the error in here.
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-gray-500">View not found</div>
          <p className="text-gray-600">
            The requested view could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { icon, title, namespace, name } = viewResult;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const handleForceRefresh = async () => {
    if (namespace && name) {
      const freshData = await getViewDataById(id, currentGlobalFilters, {
        "cache-control": "max-age=1"
      });
      queryClient.setQueryData(
        ["view-result", id, currentGlobalFilters],
        freshData
      );
      // Invalidate the table query that will be handled by the View component
      await queryClient.invalidateQueries({
        queryKey: ["view-table", namespace, name]
      });
    }
  };

  return (
    <>
      <Head prefix={title || name} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"view"} link="/views">
                <Icon name={icon || "workflow"} className="mr-2 h-4 w-4" />
                {title || name}
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={handleForceRefresh}
        contentClass="p-0 h-full"
        loading={isLoading}
        extra={
          viewResult?.lastRefreshedAt && (
            <p className="text-sm text-gray-500">
              Last refreshed:{" "}
              <Age from={viewResult.lastRefreshedAt} format="full" />
            </p>
          )
        }
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <View
            title=""
            namespace={namespace}
            name={name}
            columns={viewResult?.columns}
            columnOptions={viewResult?.columnOptions}
            panels={viewResult?.panels}
            filters={viewResult?.filters}
            viewId={id}
            onGlobalFilterStateChange={setCurrentGlobalFilters}
            viewResult={viewResult}
            currentGlobalFilters={currentGlobalFilters}
          />
        </div>
      </SearchLayout>
    </>
  );
};

export default SingleView;
