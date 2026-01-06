import React, { useEffect, useState } from "react";
import Age from "../../../ui/Age/Age";
import ViewLayout from "./ViewLayout";
import ViewWithSections from "./ViewWithSections";
import { useViewData } from "../hooks/useViewData";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";

interface SingleViewProps {
  id: string;
}

const SingleView: React.FC<SingleViewProps> = ({ id }) => {
  const {
    viewResult,
    isLoading,
    isFetching,
    error,
    aggregatedVariables,
    currentVariables,
    handleForceRefresh
  } = useViewData({ viewId: id });
  const [refreshErrorOpen, setRefreshErrorOpen] = useState(false);

  const refreshError =
    viewResult?.refreshStatus === "error" ? viewResult.refreshError : undefined;
  const isCachedResponse = viewResult?.responseSource === "cache";

  useEffect(() => {
    if (refreshError && isCachedResponse) {
      setRefreshErrorOpen(true);
    }
  }, [refreshError, isCachedResponse, viewResult?.requestFingerprint]);

  if (error && !viewResult) {
    return (
      <ViewLayout
        title="View Error"
        icon="workflow"
        onRefresh={handleForceRefresh}
        centered
      >
        <ErrorViewer error={error} className="mx-auto max-w-3xl" />
      </ViewLayout>
    );
  }

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

  if (!viewResult) {
    return (
      <ViewLayout
        title="View Not Found"
        icon="workflow"
        onRefresh={handleForceRefresh}
        centered
      >
        <ErrorViewer
          error="The requested view could not be found."
          className="mx-auto max-w-3xl"
        />
      </ViewLayout>
    );
  }

  const { icon, title, name } = viewResult;

  return (
    <>
      <Dialog open={refreshErrorOpen} onOpenChange={setRefreshErrorOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>View refresh failed</DialogTitle>
            <DialogDescription>
              The view failed to refresh. You are seeing cached data from the
              last successful refresh.
            </DialogDescription>
          </DialogHeader>
          {refreshError ? (
            <ErrorViewer error={refreshError} className="mt-4" />
          ) : null}
        </DialogContent>
      </Dialog>
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
        <ViewWithSections
          className="flex h-full w-full flex-1 flex-col overflow-y-auto px-6"
          viewResult={viewResult}
          aggregatedVariables={aggregatedVariables}
          currentVariables={currentVariables}
        />
      </ViewLayout>
    </>
  );
};

export default SingleView;
