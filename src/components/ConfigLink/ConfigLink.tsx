import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { HTMLAttributeAnchorTarget } from "react";
import clsx from "clsx";

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
  className = "text-zinc-600 text-sm",
  ...props
}: ConfigLinkProps) {
  if (variant === "link") {
    return (
      <Link
        to={{
          pathname: `/configs/${configId}`
        }}
        className={clsx("flex flex-row space-x-1", className)}
      >
        <Icon
          name={configType}
          secondary={configTypeSecondary}
          className="w-5 mr-1 h-5"
        />
        <div className="h-5 overflow-hidden truncate flex-1">{configName}</div>
      </Link>
    );
  }
  return (
    <div className={clsx("flex flex-row space-x-1", className)}>
      <Icon
        name={configType}
        secondary={configTypeSecondary}
        className="w-5 mr-1 h-5"
      />
      <div className="h-5 overflow-hidden truncate flex-1 text-sm">{configName}</div>
    </div>
  );
}
