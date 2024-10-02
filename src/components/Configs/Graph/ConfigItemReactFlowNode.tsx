import { Status } from "@flanksource-ui/components/Status";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import clsx from "clsx";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { MdOutlineDifference } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
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
    return data.data.config.changes;
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
          "card relative mb-3 flex w-96 flex-col gap-2 rounded-8px border-0 border-t-8 bg-lightest-gray shadow-card",
          (config.status
            ? StatusStyles[config.status as ConfigStatus]
            : "border-white") || "border-white"
        )}
      >
        <div className="flex flex-col gap-2 rounded-t-md border-b bg-white p-2">
          <div
            className="flex flex-1 flex-col overflow-hidden truncate text-ellipsis align-middle text-15pxinrem font-bold leading-1.21rel"
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
                <span className="block flex-1 overflow-hidden text-ellipsis">
                  {config.name}
                </span>
              </ConfigsTypeIcon>
            </Link>
          </div>
        </div>
        <div className="flex-column flex rounded-b-8px bg-lightest-gray p-1">
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
                    className="flex flex-row items-center gap-1 text-sm"
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
                  <>
                    <Badge
                      color="gray"
                      className="min-w-min"
                      data-tooltip-content={`namespace: ${config.tags.namespace}`}
                      data-tooltip-class-name="z-[99999]"
                      data-tooltip-id={`namespace-${config.tags.namespace}`}
                      text={config.tags.namespace}
                    />
                    <Tooltip id={`namespace-${config.tags.namespace}`} />
                  </>
                )}
                {config.tags.cluster && (
                  <>
                    <Badge
                      color="gray"
                      text={config.tags.cluster}
                      data-tooltip-content={`cluster: ${config.tags.cluster}`}
                      data-tooltip-class-name="z-[99999]"
                      data-tooltip-id={`cluster-${config.tags.cluster}`}
                    />
                    <Tooltip id={`cluster-${config.tags.cluster}`} />
                  </>
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
