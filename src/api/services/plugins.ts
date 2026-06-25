import { apiBase, ConfigDB } from "../axios";

export type PluginSpec = {
  source?: string;
  address?: string;
  version?: string;
  description?: string;
  [key: string]: unknown;
};

export type PluginListing = {
  id: string;
  name: string;
  namespace?: string;
  source?: string | null;
  spec?: PluginSpec | null;
  installed_path?: string | null;
  plugin_version?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  description?: string;
  version?: string;
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

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export async function getPlugins(): Promise<PluginListing[]> {
  const params = new URLSearchParams({
    select:
      "id,name,namespace,source,spec,installed_path,plugin_version,created_at,updated_at,deleted_at",
    deleted_at: "is.null",
    order: "namespace.asc,name.asc"
  });

  const response = await ConfigDB.get<PluginListing[]>(
    `/plugins?${params.toString()}`
  );

  return (response.data ?? []).map((plugin) => ({
    ...plugin,
    description: stringValue(plugin.spec?.description),
    version:
      stringValue(plugin.plugin_version) ?? stringValue(plugin.spec?.version)
  }));
}

export function upgradePlugin(name: string) {
  return apiBase.post<PluginUpgradeResult>(
    `/plugins/${encodeURIComponent(name)}/upgrade`,
    undefined,
    pluginRequestConfig()
  );
}
