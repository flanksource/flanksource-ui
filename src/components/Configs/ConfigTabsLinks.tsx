import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useParams } from "react-router-dom";
import { ConfigItem } from "../../api/types/configs";
import { getViewsByConfigId } from "../../api/services/views";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { ReactNode } from "react";
import useConfigAccessSummaryQuery from "@flanksource-ui/api/query-hooks/useConfigAccessSummaryQuery";

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

  const { data: accessSummary } = useConfigAccessSummaryQuery(id);
  const accessCount =
    accessSummary?.totalEntries ?? accessSummary?.data?.length ?? 0;

  const staticTabs: ConfigDetailsTab[] = [
    { label: "Spec", key: "Spec", path: `/catalog/${id}/spec` },
    {
      label: (
        <>
          Changes
          <Badge className="ml-1" text={countSummary?.changes ?? 0} />
        </>
      ),
      key: "Changes",
      path: `/catalog/${id}/changes`
    },
    {
      label: (
        <>
          Insights
          <Badge className="ml-1" text={countSummary?.analysis ?? 0} />
        </>
      ),
      key: "Insights",
      path: `/catalog/${id}/insights`
    },
    {
      label: (
        <>
          Relationships
          <Badge className="ml-1" text={countSummary?.relationships ?? 0} />
        </>
      ),
      key: "Relationships",
      path: `/catalog/${id}/relationships`
    },
    {
      label: (
        <>
          Playbooks
          <Badge className="ml-1" text={countSummary?.playbook_runs ?? 0} />
        </>
      ),
      key: "Playbooks",
      path: `/catalog/${id}/playbooks`
    },
    {
      label: (
        <>
          Checks
          <Badge className="ml-1" text={countSummary?.checks ?? 0} />
        </>
      ),
      key: "Checks",
      path: `/catalog/${id}/checks`
    }
  ];

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

  if (viewTabs.length === 0) {
    return { isLoading, isError, tabs: staticTabs };
  }

  // Views configured for a config should appear ahead of the built-in tabs.
  return { isLoading, isError, tabs: [...viewTabs, ...staticTabs] };
}
