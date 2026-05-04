// ABOUTME: Resolves the homepage destination using /api/dashboard which returns
// ABOUTME: the dashboard view definition and pre-resolved section data in a
// ABOUTME: single call. Pre-seeds the react-query cache so downstream components
// ABOUTME: skip their individual fetch round trips.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import React, { Suspense, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getDashboard,
  DashboardResponse,
  getSectionResultByViewRef
} from "../api/services/views";
import { useUserAccessStateContext } from "../context/UserAccessContext/UserAccessContext";
import { tables } from "../context/UserAccessContext/permissions";
import FullPageSkeletonLoader from "../ui/SkeletonLoader/FullPageSkeletonLoader";

const ViewContainer = React.lazy(
  () => import("../pages/views/components/ViewContainer")
);

const homepageFallbacks = [
  { resource: tables.canaries, path: "/health" },
  { resource: tables.incident, path: "/incidents" },
  { resource: tables.catalog, path: "/catalog" },
  { resource: tables.playbooks, path: "/playbooks" },
  { resource: tables.applications, path: "/applications" }
];

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
  const { hasResourceAccess, roles } = useUserAccessStateContext();
  const [fallbackPath, setFallbackPath] = useState<string | null>(null);
  const [canReadViews, setCanReadViews] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsCheckingAccess(true);

    Promise.all([
      hasResourceAccess(tables.views, "read"),
      ...homepageFallbacks.map((item) =>
        hasResourceAccess(item.resource, "read").then((hasAccess) => ({
          ...item,
          hasAccess
        }))
      )
    ]).then(([hasViewsAccess, ...fallbackResults]) => {
      if (cancelled) {
        return;
      }

      setCanReadViews(Boolean(hasViewsAccess));
      setFallbackPath(
        fallbackResults.find((item) => item.hasAccess)?.path ?? null
      );
      setIsCheckingAccess(false);
    });

    return () => {
      cancelled = true;
    };
  }, [hasResourceAccess, roles]);

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

  if (isLoading || isCheckingAccess) {
    return <FullPageSkeletonLoader />;
  }

  if (!error && dashboard?.id && canReadViews) {
    return (
      <Suspense fallback={<FullPageSkeletonLoader />}>
        <ViewContainer id={dashboard.id} />
      </Suspense>
    );
  }

  if (fallbackPath) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <FullPageSkeletonLoader />;
}
