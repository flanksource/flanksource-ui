// ABOUTME: Renders a catalog plugin's UI tab by embedding the plugin's own
// ABOUTME: front-end in a sandboxed iframe served through the host's proxy.
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@flanksource-ui/ui/Loading";
import {
  getPluginsForConfig,
  pluginTabKey,
  pluginUiSrc
} from "@flanksource-ui/api/services/configPlugins";

export function ConfigDetailsPluginPage() {
  const { id, pluginName, tabName } = useParams<{
    id: string;
    pluginName: string;
    tabName: string;
  }>();

  const {
    data: plugins = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["config", "plugins", id],
    queryFn: () => getPluginsForConfig(id!),
    enabled: !!id
  });

  const plugin = plugins.find((p) => p.name === pluginName);
  const tab = plugin?.tabs?.find((t) => t.name === tabName);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={`Plugin - ${tabName ?? ""}`}
      isLoading={isLoading}
      activeTabName={
        pluginName && tabName ? pluginTabKey(pluginName, tabName) : ""
      }
      refetch={refetch}
    >
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Loading />
        </div>
      ) : tab && pluginName && id ? (
        <PluginFrame pluginName={pluginName} tabPath={tab.path} configId={id} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-xl text-gray-500">Plugin not found</div>
            <p className="text-gray-600">
              This plugin is not enabled for this config item.
            </p>
          </div>
        </div>
      )}
    </ConfigDetailsTabs>
  );
}

type PluginFrameProps = {
  pluginName: string;
  tabPath: string;
  configId: string;
};

/**
 * PluginFrame embeds a plugin's UI in a sandboxed iframe. The plugin may send
 * {type: "mc.tab.ready"} via postMessage to clear the loading overlay early;
 * plugins that don't still clear it on the iframe's onLoad.
 */
function PluginFrame({ pluginName, tabPath, configId }: PluginFrameProps) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.source !== ref.current?.contentWindow) {
        return;
      }
      const msg = e.data as { type?: string };
      if (msg?.type === "mc.tab.ready") {
        setReady(true);
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
          <Loading text={`Loading ${pluginName}…`} />
        </div>
      )}
      <iframe
        ref={ref}
        src={pluginUiSrc(pluginName, tabPath, configId)}
        title={`${pluginName} – ${tabPath}`}
        className="h-full w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
