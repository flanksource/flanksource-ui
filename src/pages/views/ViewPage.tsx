import React, { Suspense } from "react";
import { useParams } from "react-router-dom";

const SingleView = React.lazy(() => import("./components/SingleView"));

export function ViewPage() {
  const { id } = useParams<{ id: string }>();

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
