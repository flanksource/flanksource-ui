import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useParams } from "react-router-dom";
import { ConfigItem } from "../../api/types/configs";
import { getViewsByConfigId } from "../../api/services/views";
import {
  getPluginsForConfig,
  pluginTabKey,
  pluginTabPath
} from "../../api/services/configPlugins";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { ReactNode } from "react";
import useConfigAccessSummaryQuery from "@flanksource-ui/api/query-hooks/useConfigAccessSummaryQuery";
import useConfigAccessLogsQuery from "@flanksource-ui/api/query-hooks/useConfigAccessLogsQuery";
import { PluginIcon } from "./PluginIcon";

type ConfigDetailsTab = {
  label: ReactNode;
  key: string;
  path: string;
  icon?: ReactNode;
  search?: string;
};

export function useConfigDetailsTabs(countSummary?: ConfigItem["summary"]): {
  isLoading: boolean;
  isError: boolean;
  tabs: ConfigDetailsTab[];
} {
  const { id } = useParams<{ id: string }>();

  const {
    data: views = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["views", id],
    queryFn: () => getViewsByConfigId(id!),
    enabled: !!id
  });

  const { data: plugins = [] } = useQuery({
    queryKey: ["config", "plugins", id],
    queryFn: () => getPluginsForConfig(id!),
    enabled: !!id
  });

  const { data: accessSummary } = useConfigAccessSummaryQuery(id);
  const accessCount =
    accessSummary?.totalEntries ?? accessSummary?.data?.length ?? 0;

  const { data: accessLogsData } = useConfigAccessLogsQuery(id);
  const accessLogsCount =
    accessLogsData?.totalEntries ?? accessLogsData?.data?.length ?? 0;

  const changesCount = countSummary?.changes ?? 0;
  const insightsCount = countSummary?.analysis ?? 0;
  const relationshipsCount = countSummary?.relationships ?? 0;
  const playbooksCount = countSummary?.playbook_runs ?? 0;
  const checksCount = countSummary?.checks ?? 0;

  const staticTabs: ConfigDetailsTab[] = [
    { label: "Spec", key: "Spec", path: `/catalog/${id}/spec` }
  ];

  if (changesCount > 0) {
    staticTabs.push({
      label: (
        <>
          Changes
          <Badge className="ml-1" text={changesCount} />
        </>
      ),
      key: "Changes",
      path: `/catalog/${id}/changes`
    });
  }

  if (insightsCount > 0) {
    staticTabs.push({
      label: (
        <>
          Insights
          <Badge className="ml-1" text={insightsCount} />
        </>
      ),
      key: "Insights",
      path: `/catalog/${id}/insights`
    });
  }

  if (relationshipsCount > 0) {
    staticTabs.push({
      label: (
        <>
          Relationships
          <Badge className="ml-1" text={relationshipsCount} />
        </>
      ),
      key: "Relationships",
      path: `/catalog/${id}/relationships`
    });
  }

  if (playbooksCount > 0) {
    staticTabs.push({
      label: (
        <>
          Playbooks
          <Badge className="ml-1" text={playbooksCount} />
        </>
      ),
      key: "Playbooks",
      path: `/catalog/${id}/playbooks`
    });
  }

  if (checksCount > 0) {
    staticTabs.push({
      label: (
        <>
          Checks
          <Badge className="ml-1" text={checksCount} />
        </>
      ),
      key: "Checks",
      path: `/catalog/${id}/checks`
    });
  }

  if (accessCount > 0) {
    staticTabs.push({
      label: (
        <>
          Access
          <Badge className="ml-1" text={accessCount} />
        </>
      ),
      key: "Access",
      path: `/catalog/${id}/access`
    });
  }

  if (accessLogsCount > 0) {
    staticTabs.push({
      label: (
        <>
          Access Logs
          <Badge className="ml-1" text={accessLogsCount} />
        </>
      ),
      key: "Access Logs",
      path: `/catalog/${id}/access-logs`
    });
  }

  const hasExplicitOrdering = views.some((view) => view.ordinal != null);

  const orderedViews = hasExplicitOrdering
    ? [...views].sort((a, b) => {
        const aOrdinal = a.ordinal ?? Number.MAX_SAFE_INTEGER;
        const bOrdinal = b.ordinal ?? Number.MAX_SAFE_INTEGER;

        if (aOrdinal !== bOrdinal) {
          return aOrdinal - bOrdinal;
        }

        const aLabel = a.title || a.name;
        const bLabel = b.title || b.name;

        return aLabel.localeCompare(bLabel);
      })
    : views;

  const viewTabs: ConfigDetailsTab[] = orderedViews.map((view) => ({
    label: view.title || view.name,
    key: view.id,
    path: `/catalog/${id}/view/${view.id}`,
    icon: <Icon name={view.icon || "workflow"} />
  }));

  const pluginTabs: ConfigDetailsTab[] = plugins.flatMap((plugin) =>
    (plugin.tabs ?? []).map((tab) => ({
      label: tab.name,
      key: pluginTabKey(plugin.name, tab.name),
      path: pluginTabPath(id!, plugin.name, tab.name),
      icon: <PluginIcon name={tab.icon} />
    }))
  );

  // Views lead the built-in tabs; plugin-contributed tabs trail them.
  return {
    isLoading,
    isError,
    tabs: [...viewTabs, ...staticTabs, ...pluginTabs]
  };
}
