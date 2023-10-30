import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { HTMLAttributeAnchorTarget } from "react";
import { Link } from "react-router-dom";
import { getConfigsByID } from "../../api/services/configs";
import { ConfigItem } from "../../api/types/configs";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";
import { ConfigIcon } from "../Icon/ConfigIcon";

type ConfigLinkProps = {
  config?: ConfigItem;
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
  className = "text-zinc-600 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis"
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
        <ConfigsTypeIcon config={data} />

        <div className="overflow-hidden text-ellipsis flex-1">{data.name}</div>
      </Link>
    );
  }
  return (
    <div className={clsx("flex flex-row gap-1", className)}>
      <ConfigIcon config={data} />
      <div className="overflow-hidden text-ellipsis text-sm">{data.name}</div>
    </div>
  );
}
