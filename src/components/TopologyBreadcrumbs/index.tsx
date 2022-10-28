import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { useComponentNameQuery } from "../../api/query-hooks";
import { useMemo } from "react";

type Props = {
  topologyId?: string;
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

export function TopologyBreadcrumbs({ topologyId }: Props) {
  const { data: component } = useComponentNameQuery(topologyId, {});
  const ids = useMemo(() => {
    const topologyIds = [
      ...(component?.path || "").split("."),
      topologyId
    ].filter((v) => v?.trim());
    return topologyIds;
  }, [component, topologyId]);

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
