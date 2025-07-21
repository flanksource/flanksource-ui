import React from "react";
import { useParams } from "react-router-dom";
import AuditReport from "./components/AuditReport";

export function AuditReportPage() {
  const { id } = useParams<{ id: string }>();
  return <AuditReport applicationId={id} />;
}
