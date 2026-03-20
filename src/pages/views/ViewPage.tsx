import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  getViewIdByNamespaceAndName,
  getViewIdByName
} from "../../api/services/views";

const ViewContainer = React.lazy(() => import("./components/ViewContainer"));

/**
 * ViewPage supports the following routes:
 * - /view/:id
 * - /view/:namespace/:name
 * - /view/:name
 * @returns
 */
export function ViewPage() {
  const { id, namespace, name } = useParams<{
    id?: string;
    namespace?: string;
    name?: string;
  }>();
  // `id` is directly available from the route — no need to duplicate it in state.
  // `fetchedId` holds the resolved ID when we had to look it up by name/namespace.
  const [fetchedId, setFetchedId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  // Derived: prefer the direct `id` param; fall back to whatever we fetched.
  const viewId = id ?? fetchedId;

  useEffect(() => {
    // When a direct `id` is present there is nothing to fetch.
    if (id) return;

    if (!name) {
      setError("No view identifier provided");
      return;
    }

    // AbortController lets us cancel the in-flight request if the component
    // unmounts or the route params change before the response arrives,
    // preventing stale-closure / race-condition state updates.
    const controller = new AbortController();

    const fetchViewId = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let resolved: string | undefined;

        if (namespace) {
          resolved = await getViewIdByNamespaceAndName(
            namespace,
            name,
            controller.signal
          );
        } else {
          resolved = await getViewIdByName(name, controller.signal);
        }

        if (controller.signal.aborted) return;

        if (!resolved) {
          setError(
            `View not found: ${namespace ? `${namespace}/${name}` : name}`
          );
          return;
        }

        setFetchedId(resolved);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err ?? "Failed to load view");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchViewId();

    return () => controller.abort();
  }, [id, namespace, name]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading view metadata...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <ErrorViewer error={error} className="w-full max-w-2xl" />
      </div>
    );
  }

  if (!viewId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <ErrorViewer
          error="No view identifier provided"
          className="w-full max-w-2xl"
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading view...
        </div>
      }
    >
      <ViewContainer id={viewId} />
    </Suspense>
  );
}
