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

type ConfigLinkProps = ConfigIconProps & {
  config?: Pick<ConfigItem, "type" | "name" | "id" | "deleted_at"> | undefined;
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
        <ConfigsTypeIcon
          config={data}
          showLabel={showLabel}
          showPrimaryIcon={showPrimaryIcon}
          showSecondaryIcon={showSecondaryIcon}
        >
          <span className="flex-1 overflow-hidden text-ellipsis">
            {data.name}
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
      <ConfigIcon config={data} />
      <span className="overflow-hidden text-ellipsis text-sm">
        {data.name}
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
