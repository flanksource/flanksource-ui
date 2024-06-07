import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { HTMLAttributeAnchorTarget } from "react";
import { Link } from "react-router-dom";
import { getConfigsByID } from "../../../api/services/configs";
import { ConfigItem } from "../../../api/types/configs";
import { ConfigIcon } from "../../../ui/Icons/ConfigIcon";
import ConfigsTypeIcon, { ConfigIconProps } from "../ConfigsTypeIcon";

type ConfigLinkProps = ConfigIconProps & {
  config?: Pick<ConfigItem, "type" | "name" | "id"> | undefined;
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
  const { data } = useQuery(["config", configId, config], () => {
    if (config) {
      return config;
    }
    if (configId != null) {
      return getConfigsByID(configId);
    }
    return null;
  });

  if (data == null) {
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
          <span className="overflow-hidden text-ellipsis flex-1">
            {data.name}
          </span>
        </ConfigsTypeIcon>
      </Link>
    );
  }
  return (
    <div className={clsx("flex flex-row gap-1", className)}>
      <ConfigIcon config={data} />
      <span className="overflow-hidden text-ellipsis text-sm">{data.name}</span>
    </div>
  );
}
