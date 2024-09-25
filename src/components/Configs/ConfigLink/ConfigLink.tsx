import { getConfigsByID } from "@flanksource-ui/api/services/configs";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { HTMLAttributeAnchorTarget } from "react";
import { Link } from "react-router-dom";
import { ConfigItem } from "../../../api/types/configs";
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
  const { data: configFromRequest, isLoading } = useQuery({
    queryKey: ["config", configId, config],
    queryFn: () => getConfigsByID(configId!),
    // Only run the query if we have a configId and we don't have a config
    enabled: !!configId && !config
  });

  const data = config || configFromRequest;

  if (isLoading) {
    return <TextSkeletonLoader className="h-5 w-24" />;
  }

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
