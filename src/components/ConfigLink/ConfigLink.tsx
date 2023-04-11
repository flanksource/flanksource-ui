import { Link } from "react-router-dom";

import { Icon } from "../Icon";

type ConfigLinkProps = {
  configId: string;
  configName: string;
  configType?: string;
  className?: string;
  configTypeSecondary?: string;
  variant?: "label" | "link";
};
export default function ConfigLink({
  configId,
  configName,
  configType,
  configTypeSecondary,
  variant = "link",
  className
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
    <>
      <Icon name={configType || configTypeSecondary} className="w-5 mr-1" />
      <span className={className}>{configName}</span>
    </>
  );
}
