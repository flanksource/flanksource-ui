import React, { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewDataById } from "../../../api/services/views";
import ViewSection from "./ViewSection";
import Age from "../../../ui/Age/Age";
import { toastError } from "../../../components/Toast/toast";
import ViewLayout from "./ViewLayout";

interface SingleViewProps {
  id: string;
}

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const queryClient = useQueryClient();
  const forceRefreshRef = useRef(false);

  // Fetch view metadata only. Each section (including the main view) will fetch
  // its own data with its own variables using its unique prefix.
  const {
    data: viewResult,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["view-result", id],
    queryFn: () => {
      const headers = forceRefreshRef.current
        ? { "cache-control": "max-age=1" }
        : undefined;
      return getViewDataById(id, undefined, headers);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
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

  // Render the main view as a section as well.
  // Doing this due to some CSS issues that I couldn't solve.
  const mySection = {
    title: "",
    viewRef: {
      namespace: namespace || "",
      name: name
    }
  };

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
        <div>
          <ViewSection key={name} section={mySection} />
        </div>

        {viewResult?.sections && viewResult.sections.length > 0 && (
          <>
            {viewResult.sections.map((section) => (
              <div key={section.viewRef.name} className="mt-6 pt-6">
                <ViewSection section={section} />
              </div>
            ))}
          </>
        )}
      </div>
    </ViewLayout>
  );
};

export default SingleView;
