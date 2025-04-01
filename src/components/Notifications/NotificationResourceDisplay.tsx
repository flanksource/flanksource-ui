import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Topology } from "@flanksource-ui/api/types/topology";
import { CheckLink } from "../Canary/HealthChecks/CheckLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import { TopologyLink } from "../Topology/TopologyLink";

type NotificationResourceDisplayProps = {
  notification: Pick<
    NotificationSendHistoryApiResponse,
    "resource" | "resource_type"
  >;
};

export default function NotificationResourceDisplay({
  notification
}: NotificationResourceDisplayProps) {
  const resource = notification.resource;

  const resourceType = notification.resource_type;

  return (
    <>
      {resourceType === "check" && (
        <CheckLink
          className="flex w-full flex-row items-center justify-between space-x-2 rounded-md hover:bg-gray-100"
          check={resource as HealthCheck}
          showHealthIndicator={false}
        />
      )}
      {resourceType === "config" && (
        <ConfigLink config={resource as ConfigItem} />
      )}
      {resourceType === "component" && (
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
