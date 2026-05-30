import { apiBase } from "../axios";
import { AgentItem } from "../types/common";

export type PluginListing = {
  name: string;
  description?: string;
  version?: string;
  agent?: AgentItem;
  tabs?: unknown[];
  operations?: unknown[];
};

export function getPlugins() {
  return apiBase.get<PluginListing[]>("/plugins");
}
