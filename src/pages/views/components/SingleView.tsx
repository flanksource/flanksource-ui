import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { getViewById, getViewData } from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { Head } from "../../../ui/Head";
import { Icon } from "../../../ui/Icons/Icon";

interface SingleViewProps {
  id?: string;
}

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const [error, setError] = useState<string>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Collect and combine all filter parameters from URL
  const filters = useMemo(() => {
    const filterParts: string[] = [];

    const generalFilter = searchParams.get("filter");
    if (generalFilter) {
      filterParts.push(generalFilter);
    }

    for (const [key, value] of searchParams.entries()) {
      if (key !== "filter" && value && value.trim()) {
        const filterValue = tristateOutputToQueryParamValue(value);
        if (filterValue) {
          filterParts.push(`${key}=${filterValue}`);
        }
      }
    }

    return filterParts.join(",");
  }, [searchParams]);

  const {
    data: viewData,
    isLoading: isLoadingView,
    error: viewError
  } = useQuery({
    queryKey: ["view-metadata", id],
    queryFn: () => {
      if (!id) {
        throw new Error("View ID is required");
      }
      return getViewById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const view = viewData?.data?.[0];

  // Fetch unfiltered data to get complete dropdown options
  const { data: unfilteredViewData, isLoading: isLoadingUnfilteredData } =
    useQuery({
      queryKey: ["view-data-unfiltered", view?.namespace, view?.name],
      queryFn: () =>
        getViewData(view?.namespace ?? "", view?.name ?? "", undefined, ""),
      enabled: !!(view?.namespace && view?.name),
      staleTime: 5 * 60 * 1000 // 5 minutes
    });

  // Fetch filtered data for display
  const {
    data: actualViewData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    error: dataError
  } = useQuery({
    queryKey: ["view-data", view?.namespace, view?.name, filters],
    queryFn: () =>
      getViewData(view?.namespace ?? "", view?.name ?? "", undefined, filters),
    enabled: !!(view?.namespace && view?.name),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Calculate dynamic filter fields based on filterable columns
  // This must be called before any conditional rendering to maintain hook order
  const dynamicFilterFields = useMemo(() => {
    const baseFields = ["filter"];

    // Use unfiltered data to determine available columns, fall back to filtered data
    const sourceData = unfilteredViewData || actualViewData;
    if (sourceData?.columns) {
      const filterableFields = sourceData.columns
        .filter((column) => column.filter?.type === "multiselect")
        .map((column) => column.name.toLowerCase());

      return [...baseFields, ...filterableFields];
    }

    return baseFields;
  }, [unfilteredViewData, actualViewData]);

  useEffect(() => {
    if (!id) {
      setError("No view ID provided");
      return;
    }
    if (viewError) {
      setError(
        viewError instanceof Error
          ? viewError.message
          : "Failed to fetch view metadata"
      );
      return;
    }
    if (dataError) {
      setError(
        dataError instanceof Error
          ? dataError.message
          : "Failed to fetch view content"
      );
      return;
    }
    setError(undefined);
  }, [id, viewError, dataError]);

  const isLoading = isLoadingView || isLoadingData || isLoadingUnfilteredData;
  // isRefreshing is true when data exists but is being refetched
  const isRefreshing = actualViewData && isFetchingData && !isLoadingData;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading view...</p>
        </div>
      </div>
    );
  }

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

  if (!view) {
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

  if (!actualViewData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-gray-500">No view data</div>
          <p className="text-gray-600">No data available for this view.</p>
        </div>
      </div>
    );
  }

  const formatLastRefreshed = (timestamp?: string) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const handleForceRefresh = async () => {
    if (view?.namespace && view?.name) {
      const freshData = await getViewData(
        view.namespace,
        view.name,
        {
          "cache-control": "max-age=1" // To force a refresh
        },
        filters
      );
      queryClient.setQueryData(
        ["view-data", view.namespace, view.name, filters],
        freshData
      );
    }
  };

  return (
    <>
      <Head prefix={view.title || view.name} />

      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center text-2xl font-bold text-gray-900">
                <Icon name={view.icon || "workflow"} className="mr-3 h-6 w-6" />
                {view.title || view.name}
              </h1>
              <div className="flex items-center space-x-4">
                {actualViewData?.lastRefreshedAt && (
                  <p className="text-sm text-gray-500">
                    Last refreshed:{" "}
                    {formatLastRefreshed(actualViewData.lastRefreshedAt)}
                  </p>
                )}
                <button
                  onClick={handleForceRefresh}
                  disabled={isLoading || isRefreshing}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    className={`mr-2 h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto flex-grow space-y-6 px-4 py-6">
          <FormikFilterForm
            paramsToReset={[]}
            filterFields={dynamicFilterFields}
          >
            <View
              title=""
              view={actualViewData}
              icon="workflow"
              showSearch={true}
              dropdownOptionsData={unfilteredViewData}
            />
          </FormikFilterForm>
        </main>
      </div>
    </>
  );
};

export default SingleView;
