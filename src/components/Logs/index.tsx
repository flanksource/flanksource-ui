import { ComponentProps, useState } from "react";
import LogItem from "../../types/Logs";
import { LogsTable } from "./Table/LogsTable";

type LogsProps = {
  logs: LogItem[];
};

export function LogsViewer({ logs }: LogsProps) {
  const [variant, setVariant] =
    useState<ComponentProps<typeof LogsTable>["variant"]>("comfortable");

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
