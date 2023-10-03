import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { HTMLAttributeAnchorTarget } from "react";
import clsx from "clsx";
import ConfigsTypeIcon from "../Configs/ConfigsTypeIcon";

type ConfigLinkProps = {
  configId: string;
  configName: string;
  configType?: string;
  className?: string;
  configTypeSecondary?: string;
  variant?: "label" | "link";
  target?: HTMLAttributeAnchorTarget;
};

export default function ConfigLink({
  configId,
  configName,
  configType,
  configTypeSecondary,
  variant = "link",
  className = "text-zinc-600 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis"
}: ConfigLinkProps) {
  if (variant === "link") {
    return (
      <Link
        to={{
          pathname: `/catalog/${configId}`
        }}
        className={clsx("flex flex-row gap-2", className)}
      >
        <ConfigsTypeIcon
          config={{
            type: configType
          }}
        />
        <div className="overflow-hidden text-ellipsis flex-1">{configName}</div>
      </Link>
    );
  }
  return (
    <div className={clsx("flex flex-row gap-1", className)}>
      <Icon
        name={configType}
        secondary={configTypeSecondary}
        className="w-5 h-5"
      />
      <div className="overflow-hidden text-ellipsis text-sm">{configName}</div>
    </div>
  );
}
