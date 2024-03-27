import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Handle, NodeProps } from "reactflow";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

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
}: NodeProps<ConfigItem>) {
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
          (data.status
            ? StatusStyles[data.status as ConfigStatus]
            : "border-white") || "border-white"
        )}
      >
        <div className="flex flex-col gap-2 bg-white border-b rounded-t-md p-2">
          <div
            className="flex flex-col font-bold flex-1 overflow-hidden truncate text-ellipsis align-middle text-15pxinrem leading-1.21rel"
            title={data.name}
          >
            <Link
              to={{
                pathname: `/catalog/${data.id}/relationships`
              }}
              className={clsx("flex flex-row gap-2")}
            >
              <ConfigsTypeIcon config={data}>
                <span className="block overflow-hidden text-ellipsis flex-1">
                  {data.name}
                </span>
              </ConfigsTypeIcon>
            </Link>
          </div>
        </div>
        <div className="flex flex-column bg-lightest-gray rounded-b-8px p-1">
          <div className="flex flex-row items-center gap-1.5 text-gray-500">
            <Badge
              color="gray"
              text={
                <ConfigsTypeIcon
                  config={data}
                  showLabel
                  showPrimaryIcon={false}
                  showSecondaryIcon={false}
                />
              }
            />
            {data.tags && (
              <>
                {data.tags.namespace && (
                  <Badge color="gray" text={data.tags.namespace} />
                )}
                {data.tags.cluster && (
                  <Badge color="gray" text={data.tags.cluster} />
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
