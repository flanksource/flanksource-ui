import React, { useState } from "react";
import { LogsTable } from "./Table/logs-table";

export const LogsViewer = React.memo(function LogsViewer({
  logs,
  componentId
}) {
  const [variant] = useState("comfortable");

  return (
    <>
      {/* <div
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
      </div> */}
      <LogsTable logs={logs} variant={variant} componentId={componentId} />
    </>
  );
});

LogsViewer.displayName = "LogsViewer";
