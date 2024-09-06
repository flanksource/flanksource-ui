import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { useParams } from "react-router-dom";
import { ConfigItemDetails } from "../../api/types/configs";

export function useConfigDetailsTabs(
  countSummary?: ConfigItemDetails["summary"],
  basePath: `/${string}` = "/catalog"
) {
  const { id } = useParams<{ id: string }>();

  return [
    { label: "Config", key: "Catalog", path: `${basePath}/${id}` },
    {
      label: (
        <>
          Changes
          <Badge className="ml-1" text={countSummary?.changes ?? 0} />
        </>
      ),
      key: "Changes",
      path: `${basePath}/${id}/changes`
    },
    {
      label: (
        <>
          Insights
          <Badge className="ml-1" text={countSummary?.analysis ?? 0} />
        </>
      ),
      key: "Insights",
      path: `${basePath}/${id}/insights`
    },
    {
      label: (
        <>
          Relationships
          <Badge className="ml-1" text={countSummary?.relationships ?? 0} />
        </>
      ),
      key: "Relationships",
      path: `${basePath}/${id}/relationships`
    },
    {
      label: (
        <>
          Playbooks
          <Badge className="ml-1" text={countSummary?.playbook_runs ?? 0} />
        </>
      ),
      key: "Playbooks",
      path: `${basePath}/${id}/playbooks`
    },
    {
      label: (
        <>
          Checks
          <Badge className="ml-1" text={countSummary?.checks ?? 0} />
        </>
      ),
      key: "Checks",
      path: `${basePath}/${id}/checks`
    }
  ];
}
