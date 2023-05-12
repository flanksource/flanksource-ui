import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { HTMLAttributeAnchorTarget } from "react";

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
  className,
  ...props
}: ConfigLinkProps) {
  if (variant === "link") {
    return (
      <Link
        to={{
          pathname: `/configs/${configId}`
        }}
      >
        <Icon name={configType || configTypeSecondary} className="w-5 mr-1" />
        <span className={className}>{configName}</span>
      </Link>
    );
  }
  return (
    <Link
      {...props}
      to={{
        pathname: `/configs/${configId}`
      }}
    >
      <Icon name={configType || configTypeSecondary} className="w-5 mr-1" />
      <span className={className}>{configName}</span>
    </Link>
  );
}
