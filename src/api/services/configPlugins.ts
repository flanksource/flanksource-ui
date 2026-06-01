import { apiBase } from "../axios";

export type PluginTabSpec = {
  name: string;
  icon?: string;
  path: string;
  scope?: string;
};

export type PluginListing = {
  name: string;
  description?: string;
  version?: string;
  tabs?: PluginTabSpec[];
  operations?: unknown[];
};

/**
 * Lists the plugins whose resource selector matches the given config item.
 * Each plugin contributes zero or more tabs rendered on the catalog detail
 * page. Served by mission-control at GET /api/plugins?config_id=X.
 */
export const getPluginsForConfig = async (
  configId: string
): Promise<PluginListing[]> => {
  const res = await apiBase.get<PluginListing[]>(
    `/plugins?config_id=${encodeURIComponent(configId)}`
  );
  return res.data ?? [];
};

/**
 * pluginUiSrc constructs the iframe src for a plugin tab. The plugin's backend
 * serves its static UI under the host's reverse proxy at
 * /api/plugins/<name>/ui; config_id is forwarded so the plugin can scope
 * itself without a cross-origin postMessage handshake.
 */
export const pluginUiSrc = (
  pluginName: string,
  path: string,
  configId: string
): string => {
  const sep = path.startsWith("/") ? "" : "/";
  return `/api/plugins/${encodeURIComponent(pluginName)}/ui${sep}${path}?config_id=${encodeURIComponent(configId)}`;
};

/**
 * pluginTabKey is the stable tab identifier shared between the tab list and
 * the plugin detail page so the active tab highlights correctly.
 */
export const pluginTabKey = (pluginName: string, tabName: string): string =>
  `plugin:${pluginName}:${tabName}`;

/**
 * pluginTabPath is the route a plugin tab links to under a config item.
 */
export const pluginTabPath = (
  configId: string,
  pluginName: string,
  tabName: string
): string =>
  `/catalog/${configId}/plugin/${encodeURIComponent(pluginName)}/${encodeURIComponent(tabName)}`;
