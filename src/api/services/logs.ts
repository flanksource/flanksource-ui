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

export const searchLogs = async ({
  id,
  logSelector,
  query
}: {
  id: string;
  logSelector: string;
  query?: string;
}) => {
  const res = await resolve(
    LogsSearch.post("", {
      name: logSelector,
      id,
      query
    })
  );
  return res.data;
};
