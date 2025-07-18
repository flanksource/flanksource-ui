import React from "react";
import { useParams } from "react-router-dom";
import AuditReport from "./components/AuditReport";

export function AuditReportPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  return <AuditReport namespace={namespace} name={name} />;
}
