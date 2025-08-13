import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getViewIdByNamespaceAndName,
  getViewIdByName
} from "../../api/services/views";

const SingleView = React.lazy(() => import("./components/SingleView"));

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
  const [viewId, setViewId] = useState<string | undefined>(id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setViewId(id);
      return;
    }

    if (!name) {
      setError("No view identifier provided");
      return;
    }

    const fetchViewId = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let fetchedId: string | undefined;

        if (namespace) {
          fetchedId = await getViewIdByNamespaceAndName(namespace, name);
        } else {
          fetchedId = await getViewIdByName(name);
        }

        if (!fetchedId) {
          setError(
            `View not found: ${namespace ? `${namespace}/${name}` : name}`
          );
          return;
        }

        setViewId(fetchedId);
      } catch (err) {
        setError(
          `Failed to load view: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewId();
  }, [id, namespace, name]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading view...</div>
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

  if (!viewId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Error</div>
          <p className="text-gray-600">No view identifier provided</p>
        </div>
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
      <SingleView id={viewId} />
    </Suspense>
  );
}
