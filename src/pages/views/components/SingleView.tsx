import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewDataById } from "../../../api/services/views";
import { ViewVariable } from "../../audit-report/types";
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
  const [currentViewVariables, setCurrentViewVariables] = useState<
    Record<string, string>
  >({});
  const [hasFiltersInitialized, setHasFiltersInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all the view metadata, panel results and the column definitions
  // NOTE: This doesn't fetch the table rows.
  const {
    data: viewResult,
    isLoading,
    isFetching,
    error: viewDataError
  } = useQuery({
    queryKey: ["view-result", id, currentViewVariables],
    queryFn: () => {
      return getViewDataById(id, currentViewVariables);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData: any) => previousData
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

  // Initialize filters when view data loads, but preserve user selections
  useEffect(() => {
    if (viewResult?.variables && viewResult.variables.length > 0) {
      if (!hasFiltersInitialized) {
        // First time - initialize with defaults
        const initial: Record<string, string> = {};
        viewResult.variables.forEach((filter: ViewVariable) => {
          const defaultValue =
            filter.default ||
            (filter.options.length > 0 ? filter.options[0] : "");
          if (defaultValue) {
            initial[filter.key] = defaultValue;
          }
        });
        setCurrentViewVariables(initial);
        setHasFiltersInitialized(true);
      }
    }
  }, [viewResult?.variables, hasFiltersInitialized]);

  // Handle global filter changes with useCallback to stabilize reference
  const handleGlobalFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      setCurrentViewVariables(newFilters);
    },
    []
  );

  // Only show full loading screen for initial load, not for filter refetches
  if (isLoading && !viewResult) {
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
    // TODO: Better error handling.
    // viewResult = undefined does not mean the view is not found.
    // There could be errors other than 404.
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
      const freshData = await getViewDataById(id, currentViewVariables, {
        "cache-control": "max-age=1"
      });
      queryClient.setQueryData(
        ["view-result", id, currentViewVariables],
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
        loading={isFetching}
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
            variables={viewResult?.variables}
            onVariableStateChange={handleGlobalFilterChange}
            viewResult={viewResult}
            currentVariables={currentViewVariables}
          />
        </div>
      </SearchLayout>
    </>
  );
};

export default SingleView;
