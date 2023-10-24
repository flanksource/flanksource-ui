import clsx from "clsx";
import { HTMLAttributeAnchorTarget } from "react";
import { Link } from "react-router-dom";
import { ConfigItem } from "../../api/services/configs";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";
import { ConfigIcon } from "../Icon/ConfigIcon";

type ConfigLinkProps = {
  config?: ConfigItem;
  className?: string;
  configTypeSecondary?: string;
  variant?: "label" | "link";
  target?: HTMLAttributeAnchorTarget;
};

export default function ConfigLink({
  config,
  variant = "link",
  className = "text-zinc-600 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis"
}: ConfigLinkProps) {
  if (config == null) {
    return null;
  }
  if (variant === "link") {
    return (
      <Link
        to={{
          pathname: `/catalog/${config.id}`
        }}
        className={clsx("flex flex-row gap-2", className)}
      >
        <ConfigsTypeIcon config={config} />

        <div className="overflow-hidden text-ellipsis flex-1">
          {config.name}
        </div>
      </Link>
    );
  }
  return (
    <div className={clsx("flex flex-row gap-1", className)}>
      <ConfigIcon config={config} />
      <div className="overflow-hidden text-ellipsis text-sm">{config.name}</div>
    </div>
  );
}
