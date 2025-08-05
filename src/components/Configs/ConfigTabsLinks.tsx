import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useParams } from "react-router-dom";
import { ConfigItem } from "../../api/types/configs";
import { getViewsByConfigId } from "../../api/services/views";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";

export function useConfigDetailsTabs(countSummary?: ConfigItem["summary"]) {
  const { id } = useParams<{ id: string }>();

  const { data: views = [] } = useQuery({
    queryKey: ["views", id],
    queryFn: () => getViewsByConfigId(id!),
    enabled: !!id
  });

  const staticTabs = [
    { label: "Config", key: "Catalog", path: `/catalog/${id}` },
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

  const viewTabs = views.map((view) => ({
    label: view.title,
    key: view.id,
    path: `/catalog/${id}/view/${view.name}`,
    icon: <Icon name={view.icon} />
  }));

  return [...staticTabs, ...viewTabs];
}
