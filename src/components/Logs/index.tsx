import { useState } from "react";
import { LogsTable } from "./Table/LogsTable";

export function LogsViewer() {
  console.log("Hello from LogsViewer");
  const [variant, setVariant] = useState("comfortable");

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
}
