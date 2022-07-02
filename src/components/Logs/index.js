import React, { useState, useMemo } from "react";
import { EvidenceType } from "../../api/services/evidence";
import { Modal } from "../Modal";
import { LogsTable } from "./Table/logs-table";

export const LogsViewer = React.memo(function LogsViewer({ logs }) {
  const [selectedList, setSelectedList] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const [variant, setVariant] = useState("comfortable");

  return (
    <>
      <div
        className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg mb-4"
        role="group"
      >
        <button
          type="button"
          className="btn-primary rounded-r-none"
          onClick={() => setVariant("comfortable")}
        >
          Comfortable
        </button>
        <button
          type="button"
          className="btn-primary rounded-l-none"
          onClick={() => setVariant("compact")}
        >
          Compact
        </button>
      </div>
      <LogsTable logs={logs} variant={variant} />
    </>
  );
});

LogsViewer.displayName = "LogsViewer";
