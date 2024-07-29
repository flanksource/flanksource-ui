import { useComponentNameQuery } from "@flanksource-ui/api/query-hooks";
import { Component, Topology } from "@flanksource-ui/api/types/topology";
import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icons/Icon";

export function TopologyLink({
  topology,
  topologyId,
  viewType = "link",
  size = "xl"
}: {
  topologyId?: string | undefined;
  topology?: Topology;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
}) {
  if (topology != null) {
    return (
      <TopologyLinkLocal topology={topology} viewType={viewType} size={size} />
    );
  }
  return (
    <TopologyLinkRemote
      topologyId={topologyId || ""}
      viewType={viewType}
      size={size}
    />
  );
}

function TopologyLinkRemote({
  topologyId,
  viewType = "link",
  size = "xl"
}: {
  topologyId: string;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
}) {
  const { data: component, isLoading } = useComponentNameQuery(topologyId, {});

  if (isLoading) {
    return null;
  }

  return (
    <TopologyLinkLocal topology={component} viewType={viewType} size={size} />
  );
}

function TopologyLinkLocal({
  topology,
  viewType = "link",
  size = "xl"
}: {
  topology?: Component | undefined | null;
  viewType?: "link" | "label";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
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
        className="my-auto flex flex-row items-center hover:text-gray-500"
      >
        <Icon name={topology.icon} className="mr-1 h-5 object-center" />
        <span className={`text-${size}`}> {topology.name}</span>
      </Link>
    );
  }

  return (
    <>
      <Icon name={topology.icon} className="mr-1 h-5 object-center" />
      <span className={`text-${size}`}> {topology.name}</span>
    </>
  );
}
