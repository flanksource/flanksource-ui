import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { useComponentNameQuery } from "../../api/query-hooks";
import { useMemo } from "react";

type TopologyBreadcrumbsProps = {
  topologyId?: string;
  refererId?: string | null | undefined;
};

function TopologyBreadcrumbItem({
  topologyId
}: {
  topologyId: string | undefined;
}) {
  const { data: component } = useComponentNameQuery(topologyId, {});

  if (!component) {
    return null;
  }

  return (
    <>
      &nbsp;/&nbsp;
      <Link
        to={{
          pathname: `/topology/${component.id}`
        }}
        className="flex flex-nowrap hover:text-gray-500 my-auto "
      >
        <Icon name={component.icon} size="xl" className="mr-1" />
        {component.name}
      </Link>
    </>
  );
}

export function TopologyBreadcrumbs({
  topologyId,
  refererId
}: TopologyBreadcrumbsProps) {
  const componentId = refererId || topologyId;
  const { data: component } = useComponentNameQuery(componentId, {});
  const ids = useMemo(() => {
    const topologyIds = [
      ...(component?.path || "").split("."),
      refererId,
      topologyId
    ].filter((v) => v?.trim());
    return topologyIds;
  }, [component, topologyId, refererId]);

  return (
    <>
      <Link to="/topology" className="hover:text-gray-500 ">
        Topology
      </Link>
      {ids?.map((id) => {
        return <TopologyBreadcrumbItem key={id} topologyId={id} />;
      })}
    </>
  );
}
