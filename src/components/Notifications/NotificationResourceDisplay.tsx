import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { NotificationSendHistoryResource } from "@flanksource-ui/api/types/notifications";
import { Topology } from "@flanksource-ui/api/types/topology";
import { CheckLink } from "../Canary/HealthChecks/CheckLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import { TopologyLink } from "../Topology/TopologyLink";

type NotificationResourceDisplayProps = {
  resource?: NotificationSendHistoryResource;
  resourceKind?: "config" | "check" | "component" | "canary";
};

export default function NotificationResourceDisplay({
  resource,
  resourceKind
}: NotificationResourceDisplayProps) {
  if (!resource) {
    return <span>Unknown</span>;
  }

  return (
    <>
      {resourceKind === "check" && (
        <CheckLink
          className="flex w-full flex-row items-center justify-between space-x-2 rounded-md hover:bg-gray-100"
          check={resource as HealthCheck}
          showHealthIndicator={false}
        />
      )}
      {resourceKind === "config" && (
        <ConfigLink config={resource as ConfigItem} />
      )}
      {resourceKind === "component" && (
        <TopologyLink
          topology={resource as Topology}
          className="h-5 w-5 text-gray-600"
          linkClassName="text-gray-600"
          size="md"
        />
      )}
    </>
  );
}
