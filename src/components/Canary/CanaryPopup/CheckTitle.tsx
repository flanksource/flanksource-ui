import { HealthCheck } from "@flanksource-ui/api/types/health";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import clsx from "clsx";
import React from "react";
import { Icon } from "../../../ui/Icons/Icon";
import AgentName from "../../Agents/AgentName";

type CheckTitleProps = Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
  check?: Partial<HealthCheck>;
  size?: string;
};

export function CheckTitle({
  check,
  className,
  size = "large",
  ...rest
}: CheckTitleProps) {
  // todo: this is a hack to get the agent id from the check, before it gets
  // update to a check without the agent id
  const agentID = check?.agent_id;
  const namespace = check?.namespace;

  return (
    <div className={`flex flex-row items-center ${className}`} {...rest}>
      <div
        className={clsx(
          "flex-shrink-0",
          size === "large" ? "w-14 pr-1" : "pr-2"
        )}
      >
        <Icon
          name={check?.icon || check?.type}
          className={
            size === "large"
              ? "flex h-auto w-14 flex-row"
              : "flex h-auto w-6 flex-row"
          }
        />
      </div>
      <div
        className={clsx(
          "flex flex-1 flex-row gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap",
          size === "large" ? "mr-10" : ""
        )}
      >
        <div className="flex flex-row items-center overflow-x-auto">
          <span
            title={check?.name}
            className={clsx(
              "flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap pr-1 font-semibold text-gray-800",
              size === "large" ? "text-2xl" : ""
            )}
          >
            {check?.name}
          </span>{" "}
          {size === "large" && (
            <span
              className="hidden sm:block"
              title={`Namespace for ${check?.name}`}
              style={{ paddingTop: "1px" }}
            >
              <Badge text={check?.namespace ?? ""} />
            </span>
          )}
        </div>
        <div
          title={`Endpoint for ${check?.name}`}
          className="mt-0.5 overflow-x-hidden overflow-ellipsis break-all text-sm text-gray-400"
        >
          {check?.endpoint}
        </div>
        <div
          className="flex items-center"
          title={`Namespace for ${check?.name}`}
        >
          <Badge
            className="bg-blue-100 text-blue-500"
            text={namespace}
            size="sm"
          />
        </div>
        <AgentName
          className="bg-blue-100 text-blue-500"
          size="sm"
          agentId={agentID}
        />
      </div>
    </div>
  );
}
