import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useParams } from "react-router-dom";
import { ConfigItem } from "../../api/types/configs";

export function useConfigDetailsTabs(countSummary?: ConfigItem["summary"]) {
  const { id } = useParams<{ id: string }>();

  return [
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
}
