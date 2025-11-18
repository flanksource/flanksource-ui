import React, { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewDataById } from "../../../api/services/views";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import View from "../../audit-report/components/View/View";
import { Head } from "../../../ui/Head";
import { Icon } from "../../../ui/Icons/Icon";
import { SearchLayout } from "../../../ui/Layout/SearchLayout";
import { BreadcrumbNav, BreadcrumbRoot } from "../../../ui/BreadcrumbNav";
import Age from "../../../ui/Age/Age";
import { toastError } from "../../../components/Toast/toast";

interface SingleViewProps {
  id: string;
}

// This is the prefix for all the query params that are related to the view variables.
const VIEW_VAR_PREFIX = "viewvar";

interface ViewLayoutProps {
  title: string;
  icon: string;
  onRefresh: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;
  centered?: boolean;
}

const ViewLayout: React.FC<ViewLayoutProps> = ({
  title,
  icon,
  onRefresh,
  loading,
  extra,
  children,
  centered = false
}) => (
  <>
    <Head prefix={title} />
    <SearchLayout
      title={
        <BreadcrumbNav
          list={[
            <BreadcrumbRoot key={"view"} link="/views">
              <Icon name={icon} className="mr-2 h-4 w-4" />
              {title}
            </BreadcrumbRoot>
          ]}
        />
      }
      onRefresh={onRefresh}
      contentClass="p-0 h-full"
      loading={loading}
      extra={extra}
    >
      {centered ? (
        <div className="flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : (
        children
      )}
    </SearchLayout>
  </>
);

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const queryClient = useQueryClient();
  const forceRefreshRef = useRef(false);

  // Use prefixed search params for view variables
  // NOTE: Backend uses view variables (template parameters) to partition the rows in the view table.
  // We must remove the global query parameters from the URL params.
  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const currentViewVariables = Object.fromEntries(viewVarParams.entries());

  // Fetch all the view metadata, panel results and the column definitions
  // NOTE: This doesn't fetch the table rows.
  const {
    data: viewResult,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["view-result", id, currentViewVariables],
    queryFn: () => {
      const headers = forceRefreshRef.current
        ? { "cache-control": "max-age=1" }
        : undefined;
      return getViewDataById(id, currentViewVariables, headers);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData: any) => previousData
  });

  const handleForceRefresh = async () => {
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

  if (isLoading && !viewResult) {
    return (
      <ViewLayout
        title="View"
        icon="workflow"
        onRefresh={handleForceRefresh}
        centered
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading view results...</p>
        </div>
      </ViewLayout>
    );
  }

  if (error) {
    return (
      <ViewLayout
        title="View Error"
        icon="workflow"
        onRefresh={handleForceRefresh}
        centered
      >
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Something went wrong</div>
          <p className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "Failed to fetch view data"}
          </p>
        </div>
      </ViewLayout>
    );
  }

  if (!viewResult) {
    return (
      <ViewLayout
        title="View Not Found"
        icon="workflow"
        onRefresh={handleForceRefresh}
        centered
      >
        <div className="text-center">
          <div className="mb-4 text-xl text-gray-500">View not found</div>
          <p className="text-gray-600">
            The requested view could not be found.
          </p>
        </div>
      </ViewLayout>
    );
  }

  const { icon, title, namespace, name } = viewResult;

  return (
    <ViewLayout
      title={title || name}
      icon={icon || "workflow"}
      onRefresh={handleForceRefresh}
      loading={isFetching}
      extra={
        viewResult.lastRefreshedAt && (
          <p className="text-sm text-gray-500">
            Last refreshed:{" "}
            <Age from={viewResult.lastRefreshedAt} format="full" />
          </p>
        )
      }
    >
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto p-6 pb-0">
        <View
          title=""
          namespace={namespace}
          name={name}
          columns={viewResult?.columns}
          columnOptions={viewResult?.columnOptions}
          panels={viewResult?.panels}
          variables={viewResult?.variables}
          card={viewResult?.card}
          requestFingerprint={viewResult.requestFingerprint}
          currentVariables={currentViewVariables}
        />
      </div>
    </ViewLayout>
  );
};

export default SingleView;
