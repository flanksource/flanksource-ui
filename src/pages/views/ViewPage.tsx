import React, { Suspense } from "react";
import { useParams } from "react-router-dom";

const SingleView = React.lazy(() => import("./components/SingleView"));

export function ViewPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Error</div>
          <p className="text-gray-600">No view ID provided</p>
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
      <SingleView id={id} />
    </Suspense>
  );
}
