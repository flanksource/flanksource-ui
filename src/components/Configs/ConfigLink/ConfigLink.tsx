import clsx from "clsx";
import ConfigsTypeIcon, { ConfigIconProps } from "../ConfigsTypeIcon";
import dayjs from "dayjs";

import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { ConfigItem } from "../../../api/types/configs";
import { FaTrash } from "react-icons/fa";
import { formatDateForTooltip } from "@flanksource-ui/ui/Age/Age";
import { getConfigsByID } from "@flanksource-ui/api/services/configs";
import { HTMLAttributeAnchorTarget } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";

type ConfigLinkItem = Pick<
  ConfigItem,
  "type" | "name" | "id" | "health" | "status" | "deleted_at"
>;

type ConfigLinkProps = ConfigIconProps & {
  config?: ConfigLinkItem;
  configId?: string;
  className?: string;
  configTypeSecondary?: string;
  variant?: "label" | "link";
  target?: HTMLAttributeAnchorTarget;
};

export default function ConfigLink({
  config,
  configId,
  variant = "link",
  className = "text-zinc-600 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis",
  showLabel = false,
  showPrimaryIcon = true,
  showSecondaryIcon = true
}: ConfigLinkProps) {
  const { data: configFromRequest } = useQuery({
    queryKey: ["config", configId, config],
    queryFn: () => getConfigsByID(configId!),
    // Only run the query if we have a configId and we don't have a config
    enabled: !!configId && !config
  });

  const data = config || configFromRequest;

  // if (isLoading) {
  //   return <TextSkeletonLoader className="h-5 w-24" />;
  // }

  if (!data) {
    return null;
  }

  if (variant === "link") {
    return (
      <Link
        to={{
          pathname: `/catalog/${data.id}`
        }}
        className={clsx("flex flex-row gap-2", className)}
      >
        <ConfigHealth health={data.health} />
        <ConfigsTypeIcon
          config={data}
          showLabel={showLabel}
          showPrimaryIcon={showPrimaryIcon}
          showSecondaryIcon={showSecondaryIcon}
        >
          <span className="flex-1 overflow-hidden text-ellipsis">
            {data.name}{" "}
            {data.deleted_at && (
              <FaTrash
                data-tooltip-id={`deleted-${data.id}`}
                className="ml-1 inline text-red-500"
              />
            )}
          </span>
        </ConfigsTypeIcon>
        {data.deleted_at && (
          <Tooltip
            id={`deleted-${data.id}`}
            content={`Deleted: ${formatDateForTooltip(dayjs(data.deleted_at))}`}
          />
        )}
      </Link>
    );
  }

  return (
    <div className={clsx("flex flex-row gap-1", className)}>
      <ConfigHealth health={data.health!} />
      <ConfigIcon config={data} />
      <span className="overflow-hidden text-ellipsis text-sm">
        {data.name}{" "}
        {data.deleted_at && (
          <FaTrash
            data-tooltip-id={`deleted-label-${data.id}`}
            className="ml-1 inline text-red-500"
          />
        )}
      </span>
      {data.deleted_at && (
        <Tooltip
          id={`deleted-label-${data.id}`}
          content={`Deleted: ${formatDateForTooltip(dayjs(data.deleted_at))}`}
        />
      )}
    </div>
  );
}

type ConfigHealthProps = {
  health?: "healthy" | "unhealthy" | "warning" | "unknown";
};

export function ConfigHealth({ health }: ConfigHealthProps) {
  let color = "bg-gray-400";
  if (health === "healthy") {
    color = "bg-green-400";
  } else if (health === "unhealthy") {
    color = "bg-red-400";
  } else if (health === "warning") {
    color = "bg-yellow-400";
  }

  return (
    <span
      className={`inline-block h-3 w-3 flex-shrink-0 rounded-full shadow-md ${color} my-auto self-center`}
    />
  );
}
