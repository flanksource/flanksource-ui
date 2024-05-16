import { Status } from "@flanksource-ui/components/Status";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import clsx from "clsx";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Handle, NodeProps } from "reactflow";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { ConfigGraphNodes } from "./ConfigRelationshipGraph";

export enum ConfigStatus {
  unhealthy = "unhealthy",
  warning = "warning"
}

export const StatusStyles: Record<keyof typeof ConfigStatus, string> = {
  [ConfigStatus.unhealthy]: "border-red-300",
  [ConfigStatus.warning]: "border-orange-300"
} as const;

export function ConfigItemReactFlowNode({
  data,
  sourcePosition,
  targetPosition
}: NodeProps<ConfigGraphNodes>) {
  if (data.nodeType === "intermediary") {
    return null;
  }

  return (
    <>
      <style global jsx>{`
        .react-flow__handle {
          opacity: 0;
        }
      `}</style>
      {targetPosition && <Handle type="target" position={targetPosition} />}
      <div
        className={clsx(
          "flex flex-col w-96 gap-2 rounded-8px mb-3 shadow-card card bg-lightest-gray border-0 border-t-8 relative",
          (data.config.status
            ? StatusStyles[data.config.status as ConfigStatus]
            : "border-white") || "border-white"
        )}
      >
        <div className="flex flex-col gap-2 bg-white border-b rounded-t-md p-2">
          <div
            className="flex flex-col font-bold flex-1 overflow-hidden truncate text-ellipsis align-middle text-15pxinrem leading-1.21rel"
            title={data.config.name}
          >
            <Link
              to={{
                pathname: `/catalog/${data.config.id}/relationships`
              }}
              className={clsx("flex flex-row gap-2")}
            >
              <ConfigsTypeIcon config={data.config}>
                <span className="block overflow-hidden text-ellipsis flex-1">
                  {data.config.name}
                </span>
              </ConfigsTypeIcon>
            </Link>
          </div>
        </div>
        <div className="flex flex-column bg-lightest-gray rounded-b-8px p-1">
          <div className="flex flex-wrap items-center gap-1 text-gray-500">
            {data.config.health &&
              data.config.status &&
              !data.config.deleted_at && (
                <Badge
                  color="gray"
                  text={
                    <Status
                      status={data.config.health}
                      statusText={data.config.status}
                      className="text-xs"
                    />
                  }
                />
              )}
            {data.config.deleted_at && (
              <Badge
                color="gray"
                text={
                  <>
                    <FaTrash className="text-red-500" />
                    <span className="text-red-500">{data.config.status}</span>
                  </>
                }
              />
            )}
            <Badge
              color="gray"
              text={
                <ConfigsTypeIcon
                  config={data.config}
                  showLabel
                  showPrimaryIcon={false}
                  showSecondaryIcon={false}
                />
              }
            />
            {data.config.tags && (
              <>
                {data.config.tags.namespace && (
                  <Badge
                    color="gray"
                    className="min-w-min"
                    text={data.config.tags.namespace}
                  />
                )}
                {data.config.tags.cluster && (
                  <Badge color="gray" text={data.config.tags.cluster} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {sourcePosition && <Handle type="source" position={sourcePosition!} />}
    </>
  );
}
