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
      >
        <Icon
          name={configType}
          secondary={configTypeSecondary}
          className="w-5 mr-1"
        />
        <span className={className}>{configName}</span>
      </Link>
    );
  }
  return (
    <>
      <Icon
        name={configType}
        secondary={configTypeSecondary}
        className="w-5 mr-1"
      />
      <span className={clsx(className, "text-sm")}>{configName}</span>
    </>
  );
}
