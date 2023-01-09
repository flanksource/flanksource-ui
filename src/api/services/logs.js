import { Logs } from "../axios";
import { resolve } from "../resolve";

export const getLogs = async (query) => {
  if (query == null && query.type == null) {
    // eslint-disable-next-line no-console
    console.warning("Skipping empty search");
    return resolve([]);
  }

  return resolve(Logs.post("", query));
};
