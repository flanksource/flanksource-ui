import LogItem from "../../types/Logs";
import { Logs, LogsSearch } from "../axios";
import { resolve } from "../resolve";

export const getLogs = async (query) => {
  if (query == null && query.type == null) {
    // eslint-disable-next-line no-console
    console.warn("Skipping empty search");
    return resolve([]);
  }

  return resolve(Logs.post("", query));
};

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
