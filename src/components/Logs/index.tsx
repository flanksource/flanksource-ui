import { ComponentProps, useState } from "react";
import LogItem from "../../types/Logs";
import { LogsTable } from "./Table/LogsTable";

type LogsProps = {
  logs: LogItem[];
};

export function LogsViewer({ logs }: LogsProps) {
  const [variant] =
    useState<ComponentProps<typeof LogsTable>["variant"]>("comfortable");

  return <LogsTable logs={logs} variant={variant} componentId="12345678" />;
}
