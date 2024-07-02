import { Status } from "@flanksource-ui/components/Status";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import clsx from "clsx";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { MdOutlineDifference } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams({
    outgoing: "true"
  });

  const totalChanges = useMemo(() => {
    if (data.data.type === "intermediary") {
      return undefined;
    }
    return data.data.config.changes?.reduce(
      (acc, change) => acc + change.total,
      0
    );
  }, [data]);

  if (data.data.type === "intermediary") {
    return null;
  }

  const config = data.data.config;

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
          (config.status
            ? StatusStyles[config.status as ConfigStatus]
            : "border-white") || "border-white"
        )}
      >
        <div className="flex flex-col gap-2 bg-white border-b rounded-t-md p-2">
          <div
            className="flex flex-col font-bold flex-1 overflow-hidden truncate text-ellipsis align-middle text-15pxinrem leading-1.21rel"
            title={config.name}
          >
            <Link
              to={{
                pathname: `/catalog/${config.id}/relationships`,
                search: searchParams.toString()
              }}
              className={clsx("flex flex-row gap-2")}
            >
              <ConfigsTypeIcon config={config}>
                <span className="block overflow-hidden text-ellipsis flex-1">
                  {config.name}
                </span>
              </ConfigsTypeIcon>
            </Link>
          </div>
        </div>
        <div className="flex flex-column bg-lightest-gray rounded-b-8px p-1">
          <div className="flex flex-wrap items-center gap-1 text-gray-500">
            {config.health && config.status && !config.deleted_at && (
              <Badge
                color="gray"
                text={
                  <Status
                    status={config.health}
                    statusText={config.status}
                    className="text-xs"
                  />
                }
              />
            )}
            {config.deleted_at && (
              <Badge
                color="gray"
                text={
                  <>
                    <FaTrash className="text-red-500" />
                    <span className="text-red-500">{config.status}</span>
                  </>
                }
              />
            )}
            <Badge
              color="gray"
              text={
                <ConfigsTypeIcon
                  config={config}
                  showLabel
                  showPrimaryIcon={false}
                  showSecondaryIcon={false}
                />
              }
            />
            {totalChanges && (
              <Badge
                color="gray"
                text={
                  <Link
                    to={{
                      pathname: `/catalog/${config.id}/changes`
                    }}
                    className="flex flex-row gap-1 items-center text-sm"
                  >
                    <MdOutlineDifference />
                    <span> {totalChanges}</span>
                  </Link>
                }
              />
            )}
            {config.tags && (
              <>
                {config.tags.namespace && (
                  <Badge
                    color="gray"
                    className="min-w-min"
                    text={config.tags.namespace}
                  />
                )}
                {config.tags.cluster && (
                  <Badge color="gray" text={config.tags.cluster} />
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
