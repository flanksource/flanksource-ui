import React, { Suspense } from "react";
import { useParams } from "react-router-dom";

const AuditReport = React.lazy(() => import("./components/AuditReport"));

export function AuditReportPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading audit report...
        </div>
      }
    >
      <AuditReport namespace={namespace} name={name} />
    </Suspense>
  );
}
