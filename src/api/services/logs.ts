import LogItem from "../../types/Logs";
import { LogsSearch } from "../axios";

export type LogsResponse = {
  total: number;
  results: LogItem[];
};

export type SearchLogsPayload = {
  id: string;
  name: string;
  query?: string;
};

export const searchLogs = async ({ id, name, query }: SearchLogsPayload) => {
  const res = await LogsSearch.post<LogsResponse>("", {
    name,
    id,
    query
  });
  return res.data;
};
