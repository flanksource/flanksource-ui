import React, { useEffect, useState } from "react";
import Age from "../../../ui/Age/Age";
import ViewLayout from "./ViewLayout";
import ViewContent from "./ViewContent";
import { useViewData } from "../hooks/useViewData";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";

interface ViewContainerProps {
  id: string;
}

const ViewContainer: React.FC<ViewContainerProps> = ({ id }) => {
  const {
    viewResult,
    isLoading,
    isFetching,
    isPreviousData,
    error,
    aggregatedVariables,
    currentVariables,
    sectionData,
    handleForceRefresh
  } = useViewData({ viewId: id });
  const [refreshErrorOpen, setRefreshErrorOpen] = useState(false);

  const refreshError =
    viewResult?.refreshStatus === "error" ? viewResult.refreshError : undefined;
  const isCachedResponse = viewResult?.responseSource === "cache";
  const showTransitionOverlay = isFetching && isPreviousData;

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
        <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
          <ViewContent
            className="flex h-full w-full flex-1 flex-col overflow-y-auto px-6"
            viewResult={viewResult}
            sectionData={sectionData}
            aggregatedVariables={aggregatedVariables}
            currentVariables={currentVariables}
          />

          {showTransitionOverlay && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="sr-only">Loading view</span>
              </div>
            </div>
          )}
        </div>
      </ViewLayout>
    </>
  );
};

export default ViewContainer;
