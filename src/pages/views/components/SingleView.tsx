import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  getViewSummary,
  getViewDataById,
  queryViewTable
} from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import { Head } from "../../../ui/Head";
import { Icon } from "../../../ui/Icons/Icon";
import { CombinedViewResult } from "@flanksource-ui/pages/audit-report/types";
import { SearchLayout } from "../../../ui/Layout/SearchLayout";
import { BreadcrumbNav, BreadcrumbRoot } from "../../../ui/BreadcrumbNav";

interface SingleViewProps {
  id: string;
}

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const [error, setError] = useState<string>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // 1. Get view metadata (namespace, name, title, icon, etc.)
  const {
    data: viewData,
    isLoading: isLoadingView,
    error: viewError
  } = useQuery({
    queryKey: ["view-metadata", id],
    queryFn: () => {
      return getViewSummary(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const view = viewData?.data?.[0];

  // 2. Get view panel results and the column definition for the table
  const {
    data: viewFullData,
    isLoading: isLoadingViewData,
    error: viewDataError
  } = useQuery({
    queryKey: ["view-panel-results-and-table-columns", id],
    queryFn: () => {
      return getViewDataById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // 3. Get table rows with current filters applied - only if view has columns
  const {
    data: tableResponse,
    isLoading: isLoadingTable,
    isFetching: isFetchingTable,
    error: tableError
  } = useQuery({
    queryKey: [
      "view-table",
      view?.namespace,
      view?.name,
      searchParams.toString()
    ],
    queryFn: () =>
      queryViewTable(
        view?.namespace ?? "",
        view?.name ?? "",
        viewFullData?.columns ?? [],
        searchParams
      ),
    enabled: !!viewFullData?.columns,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Construct ViewResult using columns from view data and rows from table query
  const actualViewData = useMemo(() => {
    if (!viewFullData) return undefined;
    return {
      columns: viewFullData.columns,
      rows: tableResponse?.data || [],
      panels: viewFullData.panels,
      lastRefreshedAt: viewFullData.lastRefreshedAt,
      totalEntries: tableResponse?.totalEntries,
      columnOptions: viewFullData.columnOptions
    } as CombinedViewResult;
  }, [viewFullData, tableResponse]);

  // Calculate dynamic filter fields based on filterable columns
  // This must be called before any conditional rendering to maintain hook order
  const dynamicFilterFields = useMemo(() => {
    const baseFields: string[] = []; // Remove "filter" to remove search bar

    if (viewFullData?.columns) {
      const filterableFields = viewFullData.columns
        .filter((column) => column.filter?.type === "multiselect")
        .map((column) => column.name.toLowerCase());

      return [...baseFields, ...filterableFields];
    }

    return baseFields;
  }, [viewFullData]);

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
    if (viewDataError) {
      setError(
        viewDataError instanceof Error
          ? viewDataError.message
          : "Failed to fetch view data"
      );
      return;
    }
    if (tableError) {
      setError(
        tableError instanceof Error
          ? tableError.message
          : "Failed to fetch table data"
      );
      return;
    }
    setError(undefined);
  }, [id, viewError, viewDataError, tableError]);

  // Include table loading states only if view has columns
  const isLoading =
    isLoadingView ||
    isLoadingViewData ||
    (viewFullData?.columns && isLoadingTable);
  // isRefreshing is true when data exists but is being refetched
  const isRefreshing = actualViewData && isFetchingTable && !isLoadingTable;

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

  // For views with columns, check if we have actualViewData
  // For views without columns, we can still render (they might have panels)
  if (viewFullData?.columns && !actualViewData) {
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
    if (id && view?.namespace && view?.name && viewFullData?.columns) {
      // Refresh both view data and table data
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["view-panel-results-and-table-columns", id]
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "view-table",
            view.namespace,
            view.name,
            searchParams.toString()
          ]
        })
      ]);
    } else if (id) {
      // Just refresh view data if no table
      await queryClient.invalidateQueries({
        queryKey: ["view-panel-results-and-table-columns", id]
      });
    }
  };

  return (
    <>
      <Head prefix={view.title || view.name} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"view"} link="/views">
                <Icon name={view.icon || "workflow"} className="mr-2 h-4 w-4" />
                {view.title || view.name}
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={handleForceRefresh}
        contentClass="p-0 h-full"
        loading={isLoading || isRefreshing}
        extra={
          actualViewData?.lastRefreshedAt && (
            <p className="text-sm text-gray-500">
              Last refreshed:{" "}
              {formatLastRefreshed(actualViewData.lastRefreshedAt)}
            </p>
          )
        }
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <View
            title=""
            view={
              actualViewData ||
              viewFullData || {
                columns: [],
                rows: [],
                panels: [],
                columnOptions: {}
              }
            }
            icon="workflow"
            showFilter={true}
            dropdownOptionsData={viewFullData}
            filterFields={dynamicFilterFields}
          />
        </div>
      </SearchLayout>
    </>
  );
};

export default SingleView;
