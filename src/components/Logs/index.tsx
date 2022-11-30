import LogItem from "../../types/Logs";
import { LogsTable } from "./Table/LogsTable";

type LogsProps = {
  logs: LogItem[];
  componentId: string;
};

export function LogsViewer({ logs, componentId }: LogsProps) {
  return (
    <LogsTable logs={logs} variant="comfortable" componentId={componentId} />
  );
}
