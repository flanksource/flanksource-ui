import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewDataById } from "../../../api/services/views";
import ViewSection from "./ViewSection";
import Age from "../../../ui/Age/Age";
import { toastError } from "../../../components/Toast/toast";
import ViewLayout from "./ViewLayout";
import { useAggregatedViewVariables } from "../hooks/useAggregatedViewVariables";
import GlobalFiltersForm from "../../audit-report/components/View/GlobalFiltersForm";
import GlobalFilters from "../../audit-report/components/View/GlobalFilters";
import { VIEW_VAR_PREFIX } from "../constants";
import type { ViewRef } from "../../audit-report/types";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

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

  // Collect all section refs (main view + additional sections)
  // Must be called before early returns to satisfy React hooks rules
  const allSectionRefs = useMemo<ViewRef[]>(() => {
    if (!viewResult?.namespace || !viewResult?.name) {
      return [];
    }
    const refs = [{ namespace: viewResult.namespace, name: viewResult.name }];
    if (viewResult?.sections) {
      viewResult.sections.forEach((section) => {
        refs.push({
          namespace: section.viewRef.namespace,
          name: section.viewRef.name
        });
      });
    }
    return refs;
  }, [viewResult?.namespace, viewResult?.name, viewResult?.sections]);

  // Fetch and aggregate variables from all sections
  const { variables: aggregatedVariables, currentVariables } =
    useAggregatedViewVariables(allSectionRefs);

  const handleForceRefresh = async () => {
    forceRefreshRef.current = true;
    const result = await refetch();
    forceRefreshRef.current = false;

    if (result.isError) {
      const err = result.error as any;
      toastError(
        err?.message ||
          err?.error ||
          err?.detail ||
          err?.msg ||
          "Failed to refresh view"
      );
      return;
    }

    // Invalidate all section data (view results and tables) so they refetch
    const sectionsToRefresh =
      allSectionRefs.length > 0 &&
      allSectionRefs[0].namespace &&
      allSectionRefs[0].name
        ? allSectionRefs
        : result.data?.namespace && result.data.name
          ? [{ namespace: result.data.namespace, name: result.data.name }]
          : [];

    // Also clear the main view query by id so the metadata refetches
    await queryClient.invalidateQueries({ queryKey: ["view-result", id] });

    await Promise.all(
      sectionsToRefresh.flatMap((section) => [
        queryClient.invalidateQueries({
          queryKey: ["view-result", section.namespace, section.name]
        }),
        queryClient.invalidateQueries({
          queryKey: ["view-table", section.namespace, section.name]
        }),
        queryClient.invalidateQueries({
          queryKey: ["view-variables", section.namespace, section.name]
        })
      ])
    );
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
        <ErrorViewer error={error} className="mx-auto max-w-3xl" />
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

  const { icon, title, namespace, name } = viewResult;

  // Render the main view through ViewSection to reuse its spacing/scroll styling;
  // rendering the raw View here caused padding/overflow glitches alongside sections.
  const primaryViewSection = {
    title: title || name,
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
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto px-6">
        {/* Render aggregated variables once at the top */}
        {aggregatedVariables && aggregatedVariables.length > 0 && (
          <GlobalFiltersForm
            variables={aggregatedVariables}
            globalVarPrefix={VIEW_VAR_PREFIX}
            currentVariables={currentVariables}
          >
            <GlobalFilters variables={aggregatedVariables} />
          </GlobalFiltersForm>
        )}

        {aggregatedVariables && aggregatedVariables.length > 0 && (
          <hr className="my-4 border-gray-200" />
        )}

        <div className="mt-2">
          <ViewSection
            key={`${namespace || "default"}:${name}`}
            section={primaryViewSection}
            hideVariables
          />
        </div>

        {viewResult?.sections && viewResult.sections.length > 0 && (
          <>
            {viewResult.sections.map((section) => (
              <div
                key={`${section.viewRef.namespace}:${section.viewRef.name}`}
                className="mt-4"
              >
                <ViewSection section={section} hideVariables />
              </div>
            ))}
          </>
        )}
      </div>
    </ViewLayout>
  );
};

export default SingleView;
