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

export type PluginUpgradeResult = {
  plugin: string;
  previousVersion?: string;
  resolvedVersion?: string;
  installedPath?: string;
  restarted: boolean;
};

const isUiProxy = (): boolean =>
  typeof window !== "undefined" &&
  (window.location.pathname === "/ui" ||
    window.location.pathname.startsWith("/ui/"));

const pluginRequestConfig = () => (isUiProxy() ? { baseURL: "" } : undefined);

export function getPlugins() {
  return apiBase.get<PluginListing[]>("/plugins", pluginRequestConfig());
}

export function upgradePlugin(name: string) {
  return apiBase.post<PluginUpgradeResult>(
    `/plugins/${encodeURIComponent(name)}/upgrade`,
    undefined,
    pluginRequestConfig()
  );
}
