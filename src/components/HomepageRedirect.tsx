// ABOUTME: Resolves the homepage destination using /api/dashboard which returns
// ABOUTME: the dashboard view definition and pre-resolved section data in a
// ABOUTME: single call. Pre-seeds the react-query cache so downstream components
// ABOUTME: skip their individual fetch round trips.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import { getDashboard, DashboardResponse } from "../api/services/views";
import { HealthPage } from "../pages/health";
import FullPageSkeletonLoader from "../ui/SkeletonLoader/FullPageSkeletonLoader";

const ViewContainer = React.lazy(
  () => import("../pages/views/components/ViewContainer")
);

/**
 * Pre-seed the react-query cache with dashboard data so downstream components
 * don't make redundant fetch calls:
 * - ["view-metadata", viewId] for useViewData's top-level metadata fetch
 * - ["view-section-result", namespace, name, ""] for section view fetches
 */
function useSeedDashboardCache(
  dashboard: DashboardResponse | null | undefined
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!dashboard?.id) return;

    // Seed top-level metadata cache (skips GET /api/view/metadata/{id})
    queryClient.setQueryData(["view-metadata", dashboard.id], dashboard);

    // Seed each section result cache (skips POST /api/view/{namespace}/{name})
    if (dashboard.sectionResults) {
      for (const [name, sectionResult] of Object.entries(
        dashboard.sectionResults
      )) {
        const section = dashboard.sections?.find(
          (s) => s.viewRef?.name === name
        );
        const namespace =
          section?.viewRef?.namespace ?? dashboard.namespace ?? "";

        queryClient.setQueryData(
          ["view-section-result", namespace, name, ""],
          sectionResult
        );
      }
    }
  }, [dashboard, queryClient]);
}

export function HomepageRedirect() {
  const {
    data: dashboard,
    isLoading,
    error
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000
  });

  useSeedDashboardCache(dashboard);

  if (isLoading) {
    return <FullPageSkeletonLoader />;
  }

  // Fall back to health checks page when there's no dashboard view (404) or on error
  if (error || !dashboard?.id) {
    return <HealthPage url="/api/canary/api/summary" />;
  }

  return (
    <Suspense fallback={<FullPageSkeletonLoader />}>
      <ViewContainer id={dashboard.id} />
    </Suspense>
  );
}
