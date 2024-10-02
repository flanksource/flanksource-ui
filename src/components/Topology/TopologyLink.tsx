import { useComponentNameQuery } from "@flanksource-ui/api/query-hooks";
import { Component, Topology } from "@flanksource-ui/api/types/topology";
import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icons/Icon";

export function TopologyLink({
  topology,
  topologyId,
  viewType = "link",
  size = "xl",
  className,
  linkClassName
}: {
  topologyId?: string | undefined;
  topology?: Pick<Topology, "id" | "icon" | "name">;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  className?: string;
  linkClassName?: string;
}) {
  if (topology != null) {
    return (
      <TopologyLinkLocal
        topology={topology}
        viewType={viewType}
        size={size}
        className={className}
        linkClassName={linkClassName}
      />
    );
  }
  return (
    <TopologyLinkRemote
      topologyId={topologyId || ""}
      viewType={viewType}
      size={size}
      className={className}
      linkClassName={linkClassName}
    />
  );
}

function TopologyLinkRemote({
  topologyId,
  viewType = "link",
  size = "xl",
  className,
  linkClassName
}: {
  topologyId: string;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  className?: string;
  linkClassName?: string;
}) {
  const { data: component, isLoading } = useComponentNameQuery(topologyId, {});

  if (isLoading) {
    return null;
  }

  return (
    <TopologyLinkLocal
      topology={component}
      viewType={viewType}
      size={size}
      className={className}
      linkClassName={linkClassName}
    />
  );
}

function TopologyLinkLocal({
  topology,
  viewType = "link",
  size = "xl",
  className = "mr-1 h-5 w-5 object-center",
  linkClassName = "my-auto flex flex-row items-center hover:text-gray-500"
}: {
  topology?: Pick<Component, "id" | "icon" | "name"> | undefined | null;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  className?: string;
  linkClassName?: string;
}) {
  if (!topology) {
    return null;
  }

  if (viewType === "link") {
    return (
      <Link
        role="link"
        to={{
          pathname: `/topology/${topology.id}`
        }}
        className={linkClassName}
      >
        <Icon name={topology.icon} className={className} />
        <span className={`text-${size}`}> {topology.name}</span>
      </Link>
    );
  }

  return (
    <>
      <Icon name={topology.icon} className={className} />
      <span className={`text-${size}`}> {topology.name}</span>
    </>
  );
}
