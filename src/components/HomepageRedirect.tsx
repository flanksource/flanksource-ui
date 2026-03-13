// ABOUTME: Resolves the homepage destination using /api/dashboard which returns
// ABOUTME: the dashboard view definition and pre-resolved section data in a
// ABOUTME: single call. Pre-seeds the react-query cache so downstream components
// ABOUTME: skip their individual fetch round trips.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import React, { Suspense } from "react";
import {
  getDashboard,
  DashboardResponse,
  getSectionResultByViewRef
} from "../api/services/views";
import { HealthPage } from "../pages/health";
import FullPageSkeletonLoader from "../ui/SkeletonLoader/FullPageSkeletonLoader";

const ViewContainer = React.lazy(
  () => import("../pages/views/components/ViewContainer")
);

/**
 * Pre-seed react-query cache with dashboard metadata so ViewContainer can
 * render without issuing extra metadata/section requests.
 */
function seedDashboardCache(
  queryClient: QueryClient,
  dashboard: DashboardResponse | null
) {
  if (!dashboard?.id) {
    return;
  }

  // Seed top-level metadata cache (skips GET /api/view/metadata/{id})
  queryClient.setQueryData(["view-metadata", dashboard.id], dashboard);

  // Seed each section result cache (skips POST /api/view/{namespace}/{name})
  dashboard.sections?.forEach((section) => {
    if (!section.viewRef?.name) {
      return;
    }

    const sectionResult = getSectionResultByViewRef(
      dashboard.sectionResults,
      section.viewRef
    );

    if (!sectionResult) {
      return;
    }

    queryClient.setQueryData(
      [
        "view-section-result",
        section.viewRef.namespace ?? "",
        section.viewRef.name,
        ""
      ],
      sectionResult
    );
  });
}

export function HomepageRedirect() {
  const queryClient = useQueryClient();

  const {
    data: dashboard,
    isLoading,
    error
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await getDashboard();
      seedDashboardCache(queryClient, response);
      return response;
    },
    staleTime: 5 * 60 * 1000
  });

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
